/*
  # 블로그 카테고리 구조 업데이트 및 웹사이트 데이터 추가

  1. 카테고리 업데이트
    - 기존 카테고리 제약조건 수정
    - 'website'와 'blog' 카테고리 추가
    - URL 필드 활용 강화

  2. 데이터 추가
    - 웹사이트 항목들 (왼쪽 섹션용)
    - 블로그 포스트 항목들 (오른쪽 섹션용)

  3. 인덱스 최적화
    - 카테고리별 조회 성능 향상
*/

-- 기존 카테고리 제약조건 삭제 후 새로 생성
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS check_blogs_category;

-- 새로운 카테고리 제약조건 추가 (website, blog 포함)
ALTER TABLE blogs ADD CONSTRAINT check_blogs_category 
CHECK (category = ANY (ARRAY['website'::text, 'blog'::text, 'general'::text, 'learning-tool'::text, 'tutorial'::text, 'news'::text, 'guide'::text]));

-- URL 컬럼이 없다면 추가 (외부 링크 저장용)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'url'
  ) THEN
    ALTER TABLE blogs ADD COLUMN url text;
  END IF;
END $$;

-- URL 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_blogs_url ON blogs (url);

-- 기존 샘플 데이터 삭제 (새로운 구조로 재생성하기 위해)
DELETE FROM blogs WHERE slug IN (
  'emailjs-learning-tool-intro',
  'javascript-email-tutorial', 
  'emailjs-advanced-features',
  'new-learning-tool-preview'
);

-- 웹사이트 데이터 추가 (왼쪽 섹션: "더 많은 학습 도구")
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
-- 1. EmailJS 학습 도구
(
  'EmailJS 학습 도구',
  'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구입니다.',
  'EmailJS의 기본 개념부터 실제 이메일 발송까지 단계별로 학습할 수 있는 웹 애플리케이션입니다. 실제 설정을 입력하고 테스트해볼 수 있어 실무에 바로 적용 가능합니다.',
  'website',
  'published',
  true,
  ARRAY['emailjs', 'javascript', 'email', 'learning', 'interactive'],
  'emailjs-learning-tool',
  'EmailJS 학습 도구 | 인터랙티브 이메일 발송 학습',
  'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구입니다.',
  'https://vibecodezero-emailjs.netlify.app/',
  now()
),

-- 2. OpenAI API 학습 도구
(
  'OpenAI API 학습 도구',
  'OpenAI API를 활용한 AI 기능 구현을 학습할 수 있는 도구입니다.',
  'OpenAI의 GPT API를 사용해서 챗봇, 텍스트 생성, 번역 등 다양한 AI 기능을 구현하는 방법을 단계별로 학습할 수 있습니다.',
  'website',
  'published',
  true,
  ARRAY['openai', 'api', 'ai', 'gpt', 'chatbot', 'learning'],
  'openai-api-learning-tool',
  'OpenAI API 학습 도구 | AI 기능 구현 학습',
  'OpenAI API를 활용한 AI 기능 구현을 학습할 수 있는 도구입니다.',
  'https://vibecodezero-openai.netlify.app/',
  now()
),

-- 3. 랜딩페이지 디자인 도구 (예정)
(
  'Bolt.new로 랜딩페이지 디자인하기',
  'Bolt.new를 활용해서 전문적인 랜딩페이지를 디자인하는 방법을 배워보세요.',
  'AI 코딩 도구 Bolt.new를 사용해서 반응형 랜딩페이지를 처음부터 끝까지 제작하는 과정을 단계별로 학습할 수 있습니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'landing-page', 'design', 'responsive', 'ai-coding'],
  'bolt-landing-page-design',
  'Bolt.new로 랜딩페이지 디자인하기 | AI 코딩 학습',
  'Bolt.new를 활용해서 전문적인 랜딩페이지를 디자인하는 방법을 배워보세요.',
  null,
  null
),

-- 4. 이벤트 신청서 제작 도구 (예정)
(
  'Bolt.new로 이벤트 신청서 제작하기',
  '이벤트 등록과 관리를 위한 신청서 시스템을 구축해보세요.',
  'Bolt.new를 사용해서 이벤트 신청서부터 참가자 관리 시스템까지 완전한 이벤트 관리 솔루션을 만드는 방법을 학습합니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'event', 'form', 'registration', 'management'],
  'bolt-event-registration-system',
  'Bolt.new로 이벤트 신청서 제작하기 | 이벤트 관리 시스템',
  '이벤트 등록과 관리를 위한 신청서 시스템을 구축해보세요.',
  null,
  null
),

-- 5. 관리자 대시보드 디자인 도구 (예정)
(
  'Bolt.new로 관리자 대시보드 디자인하기',
  '데이터 시각화와 관리 기능이 포함된 대시보드를 제작해보세요.',
  'Bolt.new를 활용해서 차트, 테이블, 필터링 기능이 포함된 전문적인 관리자 대시보드를 설계하고 구현하는 방법을 배웁니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'dashboard', 'admin', 'data-visualization', 'management'],
  'bolt-admin-dashboard-design',
  'Bolt.new로 관리자 대시보드 디자인하기 | 데이터 관리 시스템',
  '데이터 시각화와 관리 기능이 포함된 대시보드를 제작해보세요.',
  null,
  null
),

-- 6. CRUD 연습 도구 (예정)
(
  'Bolt.new로 데이터베이스 CRUD 연습하기',
  '데이터베이스의 기본 CRUD 작업을 실습할 수 있는 학습 도구입니다.',
  'Create, Read, Update, Delete 기능을 Bolt.new와 Supabase를 사용해서 구현하면서 데이터베이스 조작의 기본을 마스터할 수 있습니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'crud', 'database', 'supabase', 'practice'],
  'bolt-database-crud-practice',
  'Bolt.new로 데이터베이스 CRUD 연습하기 | 데이터베이스 학습',
  '데이터베이스의 기본 CRUD 작업을 실습할 수 있는 학습 도구입니다.',
  null,
  null
),

-- 7. 게시판 기능 개발 도구 (예정)
(
  'Bolt.new로 게시판 기능 개발하기',
  '완전한 게시판 시스템을 처음부터 끝까지 개발해보세요.',
  '글 작성, 수정, 삭제, 댓글, 검색, 페이지네이션 등 게시판의 모든 기능을 Bolt.new로 구현하면서 웹 개발의 핵심을 학습합니다.',
  'website',
  'coming-soon',
  false,
  ARRAY['bolt.new', 'board', 'forum', 'web-development', 'full-stack'],
  'bolt-board-system-development',
  'Bolt.new로 게시판 기능 개발하기 | 웹 개발 학습',
  '완전한 게시판 시스템을 처음부터 끝까지 개발해보세요.',
  null,
  null
);

-- 블로그 포스트 데이터 추가 (오른쪽 섹션: "바이브코딩 인사이트")
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
-- 블로그 포스트 1
(
  'JavaScript로 이메일 보내기 완벽 가이드',
  'JavaScript와 EmailJS를 사용해서 웹사이트에서 이메일을 보내는 방법을 단계별로 알아봅시다.',
  '이 포스트에서는 EmailJS 서비스를 사용해서 JavaScript로 이메일을 보내는 방법을 자세히 설명합니다. 설정부터 실제 구현까지 모든 과정을 다룹니다.',
  'blog',
  'published',
  true,
  ARRAY['javascript', 'emailjs', 'tutorial', 'web-development', 'email'],
  'javascript-email-complete-guide',
  'JavaScript로 이메일 보내기 완벽 가이드 | EmailJS Tutorial',
  'JavaScript와 EmailJS를 사용해서 웹사이트에서 이메일을 보내는 방법을 단계별로 알아봅시다.',
  'https://brunch.co.kr/@loreenkim/javascript-email-guide',
  now()
),

-- 블로그 포스트 2
(
  'Bolt.new 활용법: AI와 함께하는 웹 개발',
  'AI 코딩 도구 Bolt.new를 효과적으로 활용하는 방법과 팁을 공유합니다.',
  'Bolt.new를 사용해서 더 빠르고 효율적으로 웹 개발을 하는 방법, 그리고 AI와 협업하는 노하우를 정리했습니다.',
  'blog',
  'published',
  true,
  ARRAY['bolt.new', 'ai-coding', 'web-development', 'productivity', 'tips'],
  'bolt-new-web-development-tips',
  'Bolt.new 활용법: AI와 함께하는 웹 개발 | AI 코딩 가이드',
  'AI 코딩 도구 Bolt.new를 효과적으로 활용하는 방법과 팁을 공유합니다.',
  'https://brunch.co.kr/@loreenkim/bolt-new-tips',
  now()
),

-- 블로그 포스트 3
(
  'Supabase로 실시간 데이터베이스 구축하기',
  'Supabase를 사용해서 실시간 데이터베이스를 구축하고 웹 앱에 연동하는 방법을 알아봅시다.',
  'Firebase의 대안으로 주목받는 Supabase를 사용해서 실시간 데이터베이스를 구축하는 과정을 단계별로 설명합니다.',
  'blog',
  'published',
  false,
  ARRAY['supabase', 'database', 'realtime', 'postgresql', 'backend'],
  'supabase-realtime-database-guide',
  'Supabase로 실시간 데이터베이스 구축하기 | Backend 개발',
  'Supabase를 사용해서 실시간 데이터베이스를 구축하고 웹 앱에 연동하는 방법을 알아봅시다.',
  'https://brunch.co.kr/@loreenkim/supabase-database',
  now()
),

-- 블로그 포스트 4
(
  '기획자도 할 수 있는 AI 코딩의 비밀',
  '비개발자도 AI 도구를 활용해서 웹 개발을 할 수 있는 방법과 경험을 공유합니다.',
  '기획자 출신으로서 AI 코딩 도구들을 활용해 실제 서비스를 만들어본 경험과 노하우를 정리했습니다.',
  'blog',
  'published',
  true,
  ARRAY['ai-coding', 'no-code', 'planner', 'career', 'experience'],
  'planner-ai-coding-experience',
  '기획자도 할 수 있는 AI 코딩의 비밀 | 커리어 전환 이야기',
  '비개발자도 AI 도구를 활용해서 웹 개발을 할 수 있는 방법과 경험을 공유합니다.',
  'https://brunch.co.kr/@loreenkim/planner-ai-coding',
  now()
);

-- 데이터 확인을 위한 뷰 생성 (선택사항)
CREATE OR REPLACE VIEW blog_summary AS
SELECT 
  category,
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE featured = true) as featured_count
FROM blogs 
GROUP BY category, status
ORDER BY category, status;