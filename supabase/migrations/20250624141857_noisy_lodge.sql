/*
  # Fix blogs table schema and add missing functions

  1. Table Updates
    - Ensure blogs table has all required columns with proper types
    - Add missing RPC function for view count increment
    
  2. Functions
    - Create increment_blog_view_count function used by the client code
    
  3. Security
    - Ensure RLS policies are properly configured
*/

-- Ensure the blogs table exists with all required columns
CREATE TABLE IF NOT EXISTS blogs (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  title text DEFAULT '' NOT NULL,
  description text,
  content text,
  category text DEFAULT 'general',
  status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  keywords text[],
  view_count integer DEFAULT 0,
  author_id uuid,
  slug text,
  meta_title text,
  meta_description text,
  published_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Check and add category column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'category'
  ) THEN
    ALTER TABLE blogs ADD COLUMN category text DEFAULT 'general';
  END IF;

  -- Check and add status column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'status'
  ) THEN
    ALTER TABLE blogs ADD COLUMN status text DEFAULT 'draft';
  END IF;

  -- Check and add featured column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'featured'
  ) THEN
    ALTER TABLE blogs ADD COLUMN featured boolean DEFAULT false;
  END IF;

  -- Check and add view_count column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE blogs ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  -- Check and add keywords column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE blogs ADD COLUMN keywords text[];
  END IF;

  -- Check and add slug column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'slug'
  ) THEN
    ALTER TABLE blogs ADD COLUMN slug text;
  END IF;

  -- Check and add meta columns if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE blogs ADD COLUMN meta_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE blogs ADD COLUMN meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE blogs ADD COLUMN published_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE blogs ADD COLUMN author_id uuid;
  END IF;
END $$;

-- Add constraints if they don't exist
DO $$
BEGIN
  -- Add category constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'check_blogs_category'
  ) THEN
    ALTER TABLE blogs ADD CONSTRAINT check_blogs_category 
    CHECK (category = ANY (ARRAY['general'::text, 'learning-tool'::text, 'tutorial'::text, 'news'::text, 'guide'::text]));
  END IF;

  -- Add status constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'check_blogs_status'
  ) THEN
    ALTER TABLE blogs ADD CONSTRAINT check_blogs_status 
    CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'coming-soon'::text, 'archived'::text]));
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs (category);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs (status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs (featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs (published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON blogs (view_count);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug_unique ON blogs (slug) WHERE slug IS NOT NULL;

-- Create the update function for blogs
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_blogs_updated_at_trigger ON blogs;
CREATE TRIGGER update_blogs_updated_at_trigger
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- Create the increment view count function that the client code expects
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_id bigint)
RETURNS void AS $$
BEGIN
  UPDATE blogs 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Public can read published blogs" ON blogs;
CREATE POLICY "Public can read published blogs"
  ON blogs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users can read all blogs" ON blogs;
CREATE POLICY "Authenticated users can read all blogs"
  ON blogs
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON blogs;
CREATE POLICY "Authenticated users can insert blogs"
  ON blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update blogs" ON blogs;
CREATE POLICY "Authenticated users can update blogs"
  ON blogs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON blogs;
CREATE POLICY "Authenticated users can delete blogs"
  ON blogs
  FOR DELETE
  TO authenticated
  USING (true);