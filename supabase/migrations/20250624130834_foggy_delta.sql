/*
  # 게시글 조회수 증가 함수 생성

  1. Functions
    - `increment_blog_view_count` - 게시글 조회수를 안전하게 증가시키는 함수

  2. Security
    - 함수는 public 접근 허용 (조회수 증가는 누구나 가능)
    - 원자적 연산으로 동시성 문제 해결
*/

-- 게시글 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count integer;
BEGIN
    UPDATE blogs 
    SET view_count = view_count + 1,
        updated_at = now()
    WHERE id = blog_id
    RETURNING view_count INTO new_count;
    
    RETURN COALESCE(new_count, 0);
END;
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION increment_blog_view_count(uuid) TO anon, authenticated;