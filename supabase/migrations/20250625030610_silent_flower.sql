/*
  # 블로그 상태에 '준비중' 추가

  1. Database Changes
    - blogs 테이블의 status 제약조건 업데이트
    - 'preparing' 상태 추가 (공개됨/준비중)

  2. Sample Data
    - 준비중 상태의 블로그 포스트 추가
*/

-- 기존 상태 제약조건 삭제 후 새로 생성 (preparing 상태 추가)
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS check_blogs_status;

-- 새로운 상태 제약조건 추가 (preparing 포함)
ALTER TABLE blogs ADD CONSTRAINT check_blogs_status 
CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'preparing'::text, 'coming-soon'::text, 'archived'::text]));

-- 준비중 상태의 블로그 포스트 추가
INSERT INTO blogs (
  title, 
  description, 
  content, 
  category, 
  status, 
  featured, 
  keywords, 
  slug, 
  meta_title, 
  meta_description, 
  url,
  published_at
) VALUES 
-- 준비중 블로그 포스트 1
(
  'React와 Supabase로 실시간 채팅 앱 만들기',
  'React와 Supabase를 사용해서 실시간 채팅 애플리케이션을 구축하는 방법을 알아봅시다.',
  '이 포스트에서는 React와 Supabase의 실시간 기능을 활용해서 완전한 채팅 애플리케이션을 만드는 과정을 다룹니다.',
  'blog',
  'preparing',
  false,
  ARRAY['react', 'supabase', 'realtime', 'chat', 'websocket'],
  'react-supabase-chat-app',
  'React와 Supabase로 실시간 채팅 앱 만들기 | 실시간 웹 개발',
  'React와 Supabase를 사용해서 실시간 채팅 애플리케이션을 구축하는 방법을 알아봅시다.',
  null,
  null
),

-- 준비중 블로그 포스트 2
(
  'AI 도구로 완성하는 포트폴리오 웹사이트',
  'AI 코딩 도구들을 활용해서 전문적인 포트폴리오 웹사이트를 제작하는 방법을 공유합니다.',
  'Bolt.new, ChatGPT, Midjourney 등 다양한 AI 도구를 조합해서 포트폴리오 사이트를 만드는 전체 과정을 설명합니다.',
  'blog',
  'preparing',
  false,
  ARRAY['ai-tools', 'portfolio', 'web-design', 'bolt.new', 'career'],
  'ai-portfolio-website-guide',
  'AI 도구로 완성하는 포트폴리오 웹사이트 | AI 웹 디자인',
  'AI 코딩 도구들을 활용해서 전문적인 포트폴리오 웹사이트를 제작하는 방법을 공유합니다.',
  null,
  null
),

-- 준비중 블로그 포스트 3
(
  'Vite + TypeScript 프로젝트 세팅 완벽 가이드',
  'Vite와 TypeScript를 사용한 모던 프론트엔드 개발 환경 구축 방법을 알아봅시다.',
  '최신 프론트엔드 개발 환경인 Vite와 TypeScript를 조합해서 효율적인 개발 워크플로우를 만드는 방법을 다룹니다.',
  'blog',
  'preparing',
  false,
  ARRAY['vite', 'typescript', 'frontend', 'development', 'setup'],
  'vite-typescript-setup-guide',
  'Vite + TypeScript 프로젝트 세팅 완벽 가이드 | 모던 프론트엔드',
  'Vite와 TypeScript를 사용한 모던 프론트엔드 개발 환경 구축 방법을 알아봅시다.',
  null,
  null
);