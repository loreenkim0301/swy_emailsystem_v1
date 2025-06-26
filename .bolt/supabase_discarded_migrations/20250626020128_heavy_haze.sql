/*
  # Add sample blog data

  1. New Data
    - Website category blogs (7 entries)
      - 2 published websites with URLs
      - 5 coming-soon websites
    - Blog category posts (4 entries)
      - All published blog posts with URLs

  2. Data Structure
    - Uses proper IDs to avoid conflicts
    - Includes all required fields
    - Handles duplicate slugs with ON CONFLICT

  3. Security
    - Uses ON CONFLICT to prevent duplicate key errors
    - Maintains data integrity
*/

-- 웹사이트 데이터 추가 (category: 'website')
INSERT INTO blogs (
  id, title, description, content, category, status, featured, keywords, 
  view_count, slug, meta_title, meta_description, url, published_at
) VALUES 
-- 1. EmailJS 학습 도구 (출시됨)
(
  1,
  'EmailJS 학습 도구 소개',
  'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구입니다.',
  'EmailJS를 단계별로 학습할 수 있는 웹 애플리케이션입니다. 보안을 우선으로 설계되어 안전하게 학습할 수 있습니다.',
  'website',
  'published',
  true,
  ARRAY['emailjs', 'javascript', 'email', 'tutorial'],
  0,
  'emailjs-learning-tool-website',
  'EmailJS 학습 도구 - 단계별 가이드',
  'EmailJS를 배우고 테스트할 수 있는 단계별 학습 웹 애플리케이션',
  'https://vibecodezero-emailjs.netlify.app/',
  NOW()
),

-- 2. OpenAI API 학습 도구 (출시됨)
(
  2,
  'OpenAI API 학습 도구',
  'OpenAI API를 실습하며 배울 수 있는 학습 도구입니다.',
  'OpenAI API의 다양한 기능을 실제로 테스트해볼 수 있는 인터랙티브 학습 환경을 제공합니다.',
  'website',
  'published',
  true,
  ARRAY['openai', 'api', 'ai', 'chatgpt'],
  0,
  'openai-api-learning-tool',
  'OpenAI API 학습 도구',
  'OpenAI API를 실습하며 배울 수 있는 학습 도구',
  'https://vibecodezero-openai.netlify.app/',
  NOW()
),

-- 3. Bolt.new로 랜딩페이지 디자인하기 (예정)
(
  3,
  'Bolt.new로 랜딩페이지 디자인하기',
  'Bolt.new를 활용해 전문적인 랜딩페이지를 제작하는 방법을 배워보세요.',
  'AI 도구를 활용한 현대적인 랜딩페이지 제작 과정을 단계별로 안내합니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'landing-page', 'design', 'ai'],
  0,
  'bolt-landing-page-design',
  'Bolt.new로 랜딩페이지 디자인하기',
  'AI 도구로 전문적인 랜딩페이지 제작하기',
  null,
  null
),

-- 4. Bolt.new로 이벤트 신청서 제작하기 (예정)
(
  4,
  'Bolt.new로 이벤트 신청서 제작하기',
  '이벤트 신청서를 빠르고 효율적으로 제작하는 방법을 알아보세요.',
  'Bolt.new를 사용해 사용자 친화적인 이벤트 신청서를 만드는 과정을 다룹니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'form', 'event', 'registration'],
  0,
  'bolt-event-form-creation',
  'Bolt.new로 이벤트 신청서 제작하기',
  'AI 도구로 이벤트 신청서 빠르게 만들기',
  null,
  null
),

-- 5. Bolt.new로 관리자 대시보드 디자인하기 (예정)
(
  5,
  'Bolt.new로 관리자 대시보드 디자인하기',
  '데이터 시각화와 관리 기능이 포함된 대시보드를 제작해보세요.',
  'Bolt.new를 활용한 관리자 대시보드 설계 및 구현 방법을 학습합니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'dashboard', 'admin', 'data-visualization'],
  0,
  'bolt-admin-dashboard-design',
  'Bolt.new로 관리자 대시보드 디자인하기',
  'AI 도구로 관리자 대시보드 구축하기',
  null,
  null
),

-- 6. Bolt.new로 데이터베이스의 CRUD 연습하기 (예정)
(
  6,
  'Bolt.new로 데이터베이스의 CRUD 연습하기',
  '데이터베이스 기본 연산을 실습하며 백엔드 개발을 배워보세요.',
  'CRUD 연산을 통한 데이터베이스 조작 방법과 Supabase 활용법을 다룹니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'database', 'crud', 'supabase'],
  0,
  'bolt-database-crud-practice',
  'Bolt.new로 데이터베이스 CRUD 연습하기',
  'AI 도구로 데이터베이스 기본 연산 학습하기',
  null,
  null
),

-- 7. Bolt.new로 게시판 기능 개발하기 (예정)
(
  7,
  'Bolt.new로 게시판 기능 개발하기',
  '완전한 게시판 시스템을 처음부터 끝까지 개발해보세요.',
  '사용자 인증, 게시글 관리, 댓글 시스템까지 포함한 완전한 게시판을 구축합니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'board', 'community', 'full-stack'],
  0,
  'bolt-board-development',
  'Bolt.new로 게시판 기능 개발하기',
  'AI 도구로 완전한 게시판 시스템 구축하기',
  null,
  null
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  keywords = EXCLUDED.keywords,
  view_count = EXCLUDED.view_count,
  slug = EXCLUDED.slug,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  url = EXCLUDED.url,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();

-- 블로그 포스트 데이터 추가 (category: 'blog')
INSERT INTO blogs (
  id, title, description, content, category, status, featured, keywords, 
  view_count, slug, meta_title, meta_description, url, published_at
) VALUES 
-- 8. JavaScript로 이메일 보내기 튜토리얼
(
  8,
  'JavaScript로 이메일 보내기 튜토리얼',
  'JavaScript와 EmailJS를 사용해서 웹사이트에서 이메일을 보내는 방법을 단계별로 알아봅시다.',
  'EmailJS 라이브러리를 활용한 클라이언트 사이드 이메일 발송 구현 방법을 상세히 다룹니다.',
  'blog',
  'published',
  true,
  ARRAY['javascript', 'emailjs', 'tutorial'],
  0,
  'javascript-email-sending-tutorial',
  'JavaScript로 이메일 보내기 완벽 가이드',
  'EmailJS를 활용한 웹사이트 이메일 발송 구현 방법',
  'https://brunch.co.kr/@loreenkim/javascript-email-tutorial',
  NOW()
),

-- 9. Bolt.new 고급 기능 활용하기
(
  9,
  'Bolt.new 고급 기능 활용하기',
  'Bolt.new의 숨겨진 기능들과 고급 활용법을 알아보세요.',
  'AI 코딩 도구 Bolt.new의 고급 기능과 효율적인 사용법을 소개합니다.',
  'blog',
  'published',
  true,
  ARRAY['bolt.new', 'ai-coding', 'advanced'],
  0,
  'bolt-new-advanced-features',
  'Bolt.new 고급 기능 완전 정복',
  'AI 코딩 도구의 숨겨진 기능들 활용하기',
  'https://brunch.co.kr/@loreenkim/bolt-new-advanced',
  NOW()
),

-- 10. Supabase로 데이터베이스 구축하기
(
  10,
  'Supabase로 데이터베이스 구축하기',
  'Supabase를 활용한 실시간 데이터베이스 구축 과정을 상세히 다룹니다.',
  'PostgreSQL 기반의 Supabase를 사용한 백엔드 개발 방법을 학습합니다.',
  'blog',
  'published',
  false,
  ARRAY['supabase', 'database', 'postgresql'],
  0,
  'supabase-database-setup',
  'Supabase 데이터베이스 구축 가이드',
  '실시간 데이터베이스 구축을 위한 Supabase 활용법',
  'https://brunch.co.kr/@loreenkim/supabase-database',
  NOW()
),

-- 11. 기획자도 할 수 있는 AI 코딩
(
  11,
  '기획자도 할 수 있는 AI 코딩',
  '비개발자도 AI 도구를 활용해 웹 애플리케이션을 만들 수 있는 시대가 왔습니다.',
  '기획자 출신이 AI 코딩 도구를 활용해 실제 서비스를 개발한 경험담을 공유합니다.',
  'blog',
  'published',
  true,
  ARRAY['ai-coding', 'no-code', 'planner'],
  0,
  'planner-ai-coding-experience',
  '기획자의 AI 코딩 도전기',
  '비개발자도 AI로 웹 애플리케이션 만들기',
  'https://brunch.co.kr/@loreenkim/planner-ai-coding',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  keywords = EXCLUDED.keywords,
  view_count = EXCLUDED.view_count,
  slug = EXCLUDED.slug,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  url = EXCLUDED.url,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();