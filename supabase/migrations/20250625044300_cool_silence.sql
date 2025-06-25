/*
  # 블로그 준비중 상태 추가

  1. 상태 업데이트
    - 기존 상태: 'draft', 'published', 'coming-soon', 'archived'
    - 추가 상태: 'preparing' (준비중)
  
  2. 데이터 업데이트
    - 일부 블로그 포스트를 'preparing' 상태로 변경
    - 준비중인 게시글들에 대한 설정
*/

-- 블로그 상태 체크 제약조건 업데이트 (preparing 상태 추가)
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS check_blogs_status;
ALTER TABLE blogs ADD CONSTRAINT check_blogs_status 
  CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'coming-soon'::text, 'preparing'::text, 'archived'::text]));

-- 일부 블로그 포스트를 준비중 상태로 업데이트
UPDATE blogs 
SET status = 'preparing'
WHERE category = 'blog' 
  AND title IN (
    'Bolt.new 완전 정복 가이드',
    'Supabase로 실시간 데이터베이스 구축하기'
  );

-- 준비중인 블로그 포스트 추가 데이터 삽입
INSERT INTO blogs (
  id, title, description, content, category, status, featured, keywords, 
  view_count, slug, meta_title, meta_description, url
) VALUES 
(
  5,
  'AI 코딩으로 SaaS 제품 만들기',
  '기획자가 AI와 함께 실제 SaaS 제품을 개발한 과정과 노하우를 공유합니다.',
  '준비중인 콘텐츠입니다.',
  'blog',
  'preparing',
  false,
  ARRAY['ai', 'saas', 'product', 'planning'],
  0,
  'ai-coding-saas-development',
  'AI 코딩으로 SaaS 제품 만들기 - 기획자의 개발 여정',
  '기획자가 AI 도구를 활용해 실제 SaaS 제품을 개발한 경험담과 실무 노하우',
  null
),
(
  6,
  'Bolt.new vs 다른 AI 코딩 도구 비교',
  'Bolt.new, Cursor, GitHub Copilot 등 주요 AI 코딩 도구들의 장단점을 비교 분석합니다.',
  '준비중인 콘텐츠입니다.',
  'blog',
  'preparing',
  false,
  ARRAY['bolt', 'ai-tools', 'comparison', 'coding'],
  0,
  'ai-coding-tools-comparison',
  'AI 코딩 도구 완전 비교 - Bolt.new vs Cursor vs GitHub Copilot',
  '주요 AI 코딩 도구들의 기능, 성능, 가격을 상세히 비교한 가이드',
  null
);