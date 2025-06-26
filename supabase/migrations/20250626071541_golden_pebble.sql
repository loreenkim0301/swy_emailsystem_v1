/*
  # 비즈니스 로직 정리 마이그레이션

  1. 데이터 정리
    - status='published'이지만 url이 없는 항목들을 status='coming-soon'으로 변경
    - 데이터 일관성 확보

  2. 제약 조건 추가
    - status='published'인 경우 반드시 url이 있어야 함
    - 비즈니스 로직 강제

  3. 데이터 검증
    - 변경된 데이터 확인
    - 일관성 체크
*/

-- 1. 기존 데이터 정리: status='published'이지만 url이 없는 항목들을 'coming-soon'으로 변경
UPDATE blogs 
SET 
  status = 'coming-soon',
  updated_at = now()
WHERE 
  status = 'published' 
  AND (url IS NULL OR url = '');

-- 2. 비즈니스 로직 강제를 위한 제약 조건 추가
-- published 상태인 경우 반드시 유효한 URL이 있어야 함
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'check_published_must_have_url'
  ) THEN
    ALTER TABLE blogs 
    ADD CONSTRAINT check_published_must_have_url 
    CHECK (
      (status = 'published' AND url IS NOT NULL AND url != '') 
      OR status != 'published'
    );
  END IF;
END $$;

-- 3. 데이터 검증 쿼리 (로그용)
-- 변경된 데이터 확인
DO $$
DECLARE
  affected_count INTEGER;
  published_without_url INTEGER;
  coming_soon_count INTEGER;
BEGIN
  -- 현재 상태 확인
  SELECT COUNT(*) INTO published_without_url
  FROM blogs 
  WHERE status = 'published' AND (url IS NULL OR url = '');
  
  SELECT COUNT(*) INTO coming_soon_count
  FROM blogs 
  WHERE status = 'coming-soon';
  
  -- 로그 출력
  RAISE NOTICE '=== 비즈니스 로직 정리 완료 ===';
  RAISE NOTICE 'URL 없는 published 항목: %', published_without_url;
  RAISE NOTICE '현재 coming-soon 항목 수: %', coming_soon_count;
  
  IF published_without_url = 0 THEN
    RAISE NOTICE '✅ 데이터 정리 성공: 모든 published 항목이 유효한 URL을 가지고 있습니다.';
  ELSE
    RAISE WARNING '⚠️ 아직 정리되지 않은 데이터가 있습니다.';
  END IF;
END $$;

-- 4. 향후 데이터 입력 시 자동 검증을 위한 트리거 함수 (선택사항)
CREATE OR REPLACE FUNCTION validate_blog_status_url()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- published 상태로 변경하려는데 URL이 없으면 에러
  IF NEW.status = 'published' AND (NEW.url IS NULL OR NEW.url = '') THEN
    RAISE EXCEPTION 'published 상태의 블로그는 반드시 유효한 URL이 있어야 합니다.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- 트리거 생성 (INSERT와 UPDATE 모두 적용)
DROP TRIGGER IF EXISTS validate_blog_status_url_trigger ON blogs;
CREATE TRIGGER validate_blog_status_url_trigger
  BEFORE INSERT OR UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION validate_blog_status_url();

-- 5. 최종 상태 확인을 위한 뷰 생성
CREATE OR REPLACE VIEW blog_status_summary AS
SELECT 
  category,
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE url IS NOT NULL AND url != '') as with_url_count,
  COUNT(*) FILTER (WHERE url IS NULL OR url = '') as without_url_count
FROM blogs 
GROUP BY category, status
ORDER BY category, status;

-- 뷰 접근 권한 부여
GRANT SELECT ON blog_status_summary TO anon, authenticated;

-- 6. 데이터 일관성 확인 함수
CREATE OR REPLACE FUNCTION check_blog_data_consistency()
RETURNS TABLE (
  issue_type text,
  count bigint,
  description text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    'published_without_url' as issue_type,
    COUNT(*) as count,
    'published 상태이지만 URL이 없는 항목' as description
  FROM blogs 
  WHERE status = 'published' AND (url IS NULL OR url = '')
  
  UNION ALL
  
  SELECT 
    'coming_soon_with_url' as issue_type,
    COUNT(*) as count,
    'coming-soon 상태이지만 URL이 있는 항목 (정상)' as description
  FROM blogs 
  WHERE status = 'coming-soon' AND url IS NOT NULL AND url != ''
  
  UNION ALL
  
  SELECT 
    'total_published' as issue_type,
    COUNT(*) as count,
    '전체 published 항목 수' as description
  FROM blogs 
  WHERE status = 'published'
  
  UNION ALL
  
  SELECT 
    'total_coming_soon' as issue_type,
    COUNT(*) as count,
    '전체 coming-soon 항목 수' as description
  FROM blogs 
  WHERE status = 'coming-soon';
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION check_blog_data_consistency() TO anon, authenticated;