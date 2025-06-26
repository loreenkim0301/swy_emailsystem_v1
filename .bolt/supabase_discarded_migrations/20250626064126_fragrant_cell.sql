/*
  # Database Cleanup and Optimization

  1. Functions
    - Add missing increment_blog_view_count function
    - Clean up duplicate trigger functions
    
  2. Indexes
    - Add search optimization indexes
    - Add composite indexes for better performance
    
  3. Constraints
    - Add email format validation
    - Add URL format validation
    - Strengthen data validation
    
  4. Security
    - Review and optimize RLS policies
    - Add additional security constraints
*/

-- 1. Create missing increment_blog_view_count function
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = now()
  WHERE id = blog_id;
END;
$$;

-- 2. Clean up and standardize trigger functions
-- Drop duplicate functions if they exist
DROP FUNCTION IF EXISTS update_blogs_updated_at_column();
DROP FUNCTION IF EXISTS update_blogs_updated_at();

-- Create a single, standardized updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ensure triggers are using the correct function
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
DROP TRIGGER IF EXISTS update_blogs_updated_at_trigger ON blogs;

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. Add search optimization indexes
-- Full-text search index for blogs
CREATE INDEX IF NOT EXISTS idx_blogs_search 
ON blogs USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_blogs_category_status_published 
ON blogs (category, status, published_at DESC) 
WHERE status IN ('published', 'coming-soon');

CREATE INDEX IF NOT EXISTS idx_blogs_featured_category 
ON blogs (featured, category, created_at DESC) 
WHERE featured = true;

-- 4. Add data validation constraints
-- Email format validation for subscribers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'check_subscribers_email_format'
  ) THEN
    ALTER TABLE subscribers 
    ADD CONSTRAINT check_subscribers_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- URL format validation for blogs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'check_blogs_url_format'
  ) THEN
    ALTER TABLE blogs 
    ADD CONSTRAINT check_blogs_url_format 
    CHECK (url IS NULL OR url ~* '^https?://[^\s/$.?#].[^\s]*$');
  END IF;
END $$;

-- Slug format validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'check_blogs_slug_format'
  ) THEN
    ALTER TABLE blogs 
    ADD CONSTRAINT check_blogs_slug_format 
    CHECK (slug IS NULL OR slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$');
  END IF;
END $$;

-- 5. Optimize RLS policies
-- More efficient policy for public blog reading
DROP POLICY IF EXISTS "Public can read published blogs" ON blogs;
DROP POLICY IF EXISTS "Anyone can read blogs" ON blogs;

CREATE POLICY "Public can read published content" 
ON blogs FOR SELECT 
TO anon, authenticated 
USING (status = 'published' OR status = 'coming-soon');

-- 6. Add performance monitoring
-- Create a view for blog statistics
CREATE OR REPLACE VIEW blog_performance AS
SELECT 
  category,
  status,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE featured = true) as featured_count,
  AVG(view_count) as avg_views,
  MAX(view_count) as max_views,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_count
FROM blogs 
GROUP BY category, status;

-- Grant access to the view
GRANT SELECT ON blog_performance TO anon, authenticated;

-- 7. Add helpful database functions
-- Function to get blog statistics
CREATE OR REPLACE FUNCTION get_blog_statistics()
RETURNS TABLE (
  total_blogs bigint,
  published_blogs bigint,
  coming_soon_blogs bigint,
  website_count bigint,
  blog_count bigint,
  featured_count bigint,
  total_views bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_blogs,
    COUNT(*) FILTER (WHERE status = 'published') as published_blogs,
    COUNT(*) FILTER (WHERE status = 'coming-soon') as coming_soon_blogs,
    COUNT(*) FILTER (WHERE category = 'website') as website_count,
    COUNT(*) FILTER (WHERE category = 'blog') as blog_count,
    COUNT(*) FILTER (WHERE featured = true) as featured_count,
    COALESCE(SUM(view_count), 0) as total_views
  FROM blogs;
$$;

-- Function to search blogs with ranking
CREATE OR REPLACE FUNCTION search_blogs_ranked(search_term text, search_limit int DEFAULT 10)
RETURNS TABLE (
  id bigint,
  title text,
  description text,
  category text,
  status text,
  url text,
  slug text,
  created_at timestamptz,
  rank real
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.id,
    b.title,
    b.description,
    b.category,
    b.status,
    b.url,
    b.slug,
    b.created_at,
    ts_rank(to_tsvector('english', b.title || ' ' || COALESCE(b.description, '') || ' ' || COALESCE(b.content, '')), 
             plainto_tsquery('english', search_term)) as rank
  FROM blogs b
  WHERE 
    b.status IN ('published', 'coming-soon')
    AND to_tsvector('english', b.title || ' ' || COALESCE(b.description, '') || ' ' || COALESCE(b.content, '')) 
        @@ plainto_tsquery('english', search_term)
  ORDER BY rank DESC, b.created_at DESC
  LIMIT search_limit;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_blog_statistics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_blogs_ranked(text, int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_blog_view_count(bigint) TO anon, authenticated;