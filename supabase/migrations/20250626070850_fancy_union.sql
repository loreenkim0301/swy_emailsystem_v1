/*
  # 상태 결정 로직 개선 및 데이터 정리

  1. 비즈니스 로직 단순화
    - published + url 없음 → coming-soon으로 변경
    - 일관된 상태 관리 구현
  
  2. 데이터 정리
    - 기존 published 상태이지만 url이 없는 항목들을 coming-soon으로 변경
    - 데이터 일관성 확보
*/

-- 1. 기존 published 상태이지만 url이 없는 항목들을 coming-soon으로 변경
UPDATE blogs 
SET status = 'coming-soon',
    updated_at = now()
WHERE status = 'published' 
  AND (url IS NULL OR url = '');

-- 2. 로그 출력 (변경된 항목 수 확인)
DO $$
DECLARE
    affected_count INTEGER;
BEGIN
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RAISE NOTICE '상태 변경 완료: % 개의 게시글이 published에서 coming-soon으로 변경되었습니다.', affected_count;
END $$;

-- 3. 데이터 일관성 검증 쿼리 (로그용)
DO $$
DECLARE
    inconsistent_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO inconsistent_count
    FROM blogs 
    WHERE status = 'published' 
      AND (url IS NULL OR url = '');
    
    IF inconsistent_count > 0 THEN
        RAISE WARNING '아직 % 개의 일관성 없는 데이터가 남아있습니다.', inconsistent_count;
    ELSE
        RAISE NOTICE '✅ 모든 데이터가 일관성 있게 정리되었습니다.';
    END IF;
END $$;