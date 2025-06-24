/*
  # Add missing columns to blogs table

  1. Table Updates
    - Add all missing columns to blogs table
    - Add proper indexes for performance
    - Add check constraints for data validation
    - Add RLS policies for security

  2. Functions
    - Create function to increment view count
    - Create trigger for automatic updated_at

  3. Sample Data
    - Insert test blog posts for development
*/

-- Add missing columns to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS content text,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS keywords text[],
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS author_id uuid,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS published_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON blogs(view_count);

-- Add unique index on slug if not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug_unique ON blogs(slug) WHERE slug IS NOT NULL;

-- Add check constraints using DO block to handle IF NOT EXISTS
DO $$
BEGIN
  -- Add status constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_blogs_status' 
    AND table_name = 'blogs'
  ) THEN
    ALTER TABLE blogs 
    ADD CONSTRAINT check_blogs_status 
    CHECK (status IN ('draft', 'published', 'coming-soon', 'archived'));
  END IF;

  -- Add category constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_blogs_category' 
    AND table_name = 'blogs'
  ) THEN
    ALTER TABLE blogs 
    ADD CONSTRAINT check_blogs_category 
    CHECK (category IN ('general', 'learning-tool', 'tutorial', 'news', 'guide'));
  END IF;
END $$;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs 
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE id = blog_id;
END;
$$;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_blogs_updated_at_trigger ON blogs;
CREATE TRIGGER update_blogs_updated_at_trigger
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- Add RLS policies
CREATE POLICY "Public can read published blogs"
  ON blogs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all blogs"
  ON blogs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blogs"
  ON blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blogs"
  ON blogs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blogs"
  ON blogs
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert some sample data for testing
INSERT INTO blogs (title, description, content, category, status, featured, keywords, slug, meta_title, meta_description, published_at)
VALUES 
  (
    'EmailJS 학습 도구 소개',
    'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구를 소개합니다.',
    'EmailJS는 클라이언트 사이드에서 직접 이메일을 보낼 수 있게 해주는 강력한 서비스입니다...',
    'learning-tool',
    'published',
    true,
    ARRAY['emailjs', 'javascript', 'email', 'tutorial'],
    'emailjs-learning-tool-intro',
    'EmailJS 학습 도구 소개 | EmailJS Tutorial',
    'EmailJS를 쉽게 배울 수 있는 인터랙티브 학습 도구를 소개합니다.',
    now()
  ),
  (
    'JavaScript로 이메일 보내기 튜토리얼',
    'JavaScript와 EmailJS를 사용해서 웹사이트에서 이메일을 보내는 방법을 단계별로 알아봅시다.',
    '이 튜토리얼에서는 EmailJS 서비스를 사용해서 JavaScript로 이메일을 보내는 방법을 배워보겠습니다...',
    'tutorial',
    'published',
    true,
    ARRAY['javascript', 'emailjs', 'tutorial', 'web development'],
    'javascript-email-tutorial',
    'JavaScript로 이메일 보내기 튜토리얼',
    'JavaScript와 EmailJS를 사용해서 웹사이트에서 이메일을 보내는 방법을 단계별로 알아봅시다.',
    now()
  ),
  (
    'EmailJS 고급 기능 활용하기',
    'EmailJS의 고급 기능들을 활용해서 더 강력한 이메일 시스템을 구축해보세요.',
    '이번 포스트에서는 EmailJS의 고급 기능들을 살펴보겠습니다...',
    'tutorial',
    'published',
    false,
    ARRAY['emailjs', 'advanced', 'javascript'],
    'emailjs-advanced-features',
    'EmailJS 고급 기능 활용하기',
    'EmailJS의 고급 기능들을 활용해서 더 강력한 이메일 시스템을 구축해보세요.',
    now()
  ),
  (
    '새로운 학습 도구 출시 예정',
    '곧 출시될 새로운 EmailJS 학습 도구에 대한 미리보기입니다.',
    '새로운 기능들과 개선사항들을 포함한 학습 도구가 곧 출시됩니다...',
    'learning-tool',
    'coming-soon',
    false,
    ARRAY['emailjs', 'learning', 'coming-soon'],
    'new-learning-tool-preview',
    '새로운 학습 도구 출시 예정',
    '곧 출시될 새로운 EmailJS 학습 도구에 대한 미리보기입니다.',
    null
  )
ON CONFLICT (id) DO NOTHING;