/*
  # Blogs 테이블 생성 및 기본 데이터 추가

  1. New Tables
    - `blogs`
      - `id` (uuid, primary key)
      - `title` (text, not null) - 게시글 제목
      - `url` (text, unique, not null) - 게시글 URL
      - `description` (text) - 게시글 설명
      - `keywords` (text[]) - 키워드 배열
      - `category` (text, default 'learning-tool') - 카테고리
      - `status` (text, default 'published') - 상태 (published, draft, coming-soon)
      - `featured` (boolean, default false) - 추천 게시글 여부
      - `view_count` (integer, default 0) - 조회수
      - `created_at` (timestamp with timezone, default now)
      - `updated_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `blogs` table
    - Add policy for public read access
    - Add policy for authenticated users to manage blogs

  3. Initial Data
    - 7개의 기본 게시글 데이터 추가
*/

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text UNIQUE NOT NULL,
  description text,
  keywords text[],
  category text DEFAULT 'learning-tool',
  status text DEFAULT 'published',
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view blogs)
CREATE POLICY "Anyone can read blogs"
  ON blogs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR status = 'coming-soon');

-- Policy for authenticated users to manage blogs (admin access)
CREATE POLICY "Authenticated users can manage blogs"
  ON blogs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_keywords ON blogs USING GIN(keywords);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blogs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blogs_updated_at_column();

-- Insert initial blog data
INSERT INTO blogs (title, url, description, keywords, category, status, featured) VALUES
(
  'EmailJS 학습 도구',
  'https://vibecodezero-emailjs.netlify.app/',
  'EmailJS를 배우고 테스트할 수 있는 단계별 학습 웹 애플리케이션입니다. 실제 이메일 발송 기능을 구현하면서 EmailJS의 핵심 개념을 익힐 수 있습니다.',
  ARRAY['EmailJS', 'JavaScript', 'Email', 'Bolt.new', '학습도구', 'API'],
  'learning-tool',
  'published',
  true
),
(
  'OpenAI API 학습 도구',
  'https://vibecodezero-openai.netlify.app/',
  'OpenAI API를 활용한 AI 기능 구현을 실습할 수 있는 학습 도구입니다. ChatGPT API 연동부터 실제 AI 서비스 개발까지 단계별로 학습할 수 있습니다.',
  ARRAY['OpenAI', 'ChatGPT', 'API', 'AI', 'Bolt.new', '인공지능'],
  'learning-tool',
  'published',
  true
),
(
  'Bolt.new로 랜딩페이지 디자인하기',
  '#',
  'Bolt.new를 활용하여 전문적인 랜딩페이지를 디자인하고 개발하는 방법을 배웁니다. 반응형 디자인부터 사용자 경험 최적화까지 실무에 바로 적용할 수 있는 노하우를 제공합니다.',
  ARRAY['Bolt.new', '랜딩페이지', '웹디자인', 'UI/UX', '반응형'],
  'tutorial',
  'coming-soon',
  false
),
(
  'Bolt.new로 이벤트 신청서 제작하기',
  '#',
  '이벤트나 세미나 신청을 받을 수 있는 동적 폼을 Bolt.new로 제작하는 방법을 학습합니다. 폼 검증, 데이터 저장, 이메일 알림 등 실무에 필요한 모든 기능을 구현합니다.',
  ARRAY['Bolt.new', '폼', '이벤트', '신청서', '데이터베이스'],
  'tutorial',
  'coming-soon',
  false
),
(
  'Bolt.new로 관리자 대시보드 디자인하기',
  '#',
  '데이터 시각화와 관리 기능이 포함된 관리자 대시보드를 Bolt.new로 구축하는 방법을 배웁니다. 차트, 테이블, 필터링 등 관리자가 필요로 하는 모든 기능을 구현합니다.',
  ARRAY['Bolt.new', '대시보드', '관리자', '데이터시각화', 'Admin'],
  'tutorial',
  'coming-soon',
  false
),
(
  'Bolt.new로 데이터베이스의 CRUD 연습하기',
  '#',
  'Create, Read, Update, Delete 기본 데이터베이스 조작을 Bolt.new 환경에서 실습합니다. Supabase와 연동하여 실제 서비스에서 사용할 수 있는 데이터 관리 시스템을 구축합니다.',
  ARRAY['Bolt.new', 'CRUD', '데이터베이스', 'Supabase', 'SQL'],
  'tutorial',
  'coming-soon',
  false
),
(
  'Bolt.new로 게시판 기능 개발하기',
  '#',
  '사용자 인증, 글 작성, 댓글, 검색 등이 포함된 완전한 게시판 시스템을 Bolt.new로 개발하는 방법을 학습합니다. 실제 커뮤니티 사이트에서 사용할 수 있는 수준의 기능을 구현합니다.',
  ARRAY['Bolt.new', '게시판', '커뮤니티', '사용자인증', '댓글시스템'],
  'tutorial',
  'coming-soon',
  false
);