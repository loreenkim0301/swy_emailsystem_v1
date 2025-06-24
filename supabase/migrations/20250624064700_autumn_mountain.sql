/*
  # Fix RLS policies for subscribers table

  1. Security Updates
    - Update RLS policies to allow anonymous users to:
      - INSERT new subscribers (for newsletter signup)
      - SELECT to check existing emails (for duplicate prevention)
    - Keep authenticated user policies for admin functions

  2. Policy Changes
    - Allow anonymous users to read subscriber data for duplicate checking
    - Ensure anonymous users can insert new subscribers
    - Maintain admin access for authenticated users
*/

-- Drop existing policies to recreate them with proper permissions
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
DROP POLICY IF EXISTS "Authenticated users can read subscribers" ON subscribers;
DROP POLICY IF EXISTS "Authenticated users can update subscribers" ON subscribers;

-- Policy for anonymous users to check existing emails (needed for duplicate prevention)
CREATE POLICY "Anonymous users can check existing emails"
  ON subscribers
  FOR SELECT
  TO anon
  USING (true);

-- Policy for public subscription (anonymous users can subscribe)
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy for authenticated users to read all subscriber data (admin access)
CREATE POLICY "Authenticated users can read all subscribers"
  ON subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update subscriber status (admin access)
CREATE POLICY "Authenticated users can update subscribers"
  ON subscribers
  FOR UPDATE
  TO authenticated
  USING (true);