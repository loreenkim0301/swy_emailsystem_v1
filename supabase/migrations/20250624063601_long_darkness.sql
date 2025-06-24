/*
  # 구독자 테이블 생성

  1. New Tables
    - `subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `subscribed_at` (timestamp with timezone, default now)
      - `source` (text, default 'emailjs-learning-tool')
      - `status` (text, default 'active')
      - `created_at` (timestamp with timezone, default now)
      - `updated_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `subscribers` table
    - Add policy for public insert (구독 등록)
    - Add policy for authenticated users to read data (관리자용)
*/

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  source text DEFAULT 'emailjs-learning-tool',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policy for public subscription (anyone can subscribe)
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy for reading subscriber data (authenticated users only - for admin)
CREATE POLICY "Authenticated users can read subscribers"
  ON subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for updating subscriber status (authenticated users only - for admin)
CREATE POLICY "Authenticated users can update subscribers"
  ON subscribers
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON subscribers(subscribed_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();