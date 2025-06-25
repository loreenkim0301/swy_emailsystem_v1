/*
  # Update blog post status to coming-soon

  1. Changes
    - Update the selected blog post status from 'published' to 'coming-soon'
    - This will change the display from "공개됨" to "출시 예정"
    - Remove the URL since it's not yet available
    - Update the published_at to null since it's not published yet

  2. Security
    - No security changes needed for this update
*/

-- Update the blog post status to coming-soon
-- Based on the screenshot, this appears to be the Supabase database guide post
UPDATE blogs 
SET 
  status = 'coming-soon',
  url = null,
  published_at = null,
  updated_at = NOW()
WHERE id = 203 AND title = 'Supabase로 데이터베이스 구축하기';