/*
  # Core Tables Creation

  1. New Tables
    - `blogs`
      - `id` (bigint, primary key, auto-increment)
      - `title` (text, required)
      - `description` (text)
      - `content` (text)
      - `category` (text)
      - `status` (text)
      - `url` (text)
      - `slug` (text)
      - `featured` (boolean)
      - `view_count` (bigint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `subscribers`
      - `id` (bigint, primary key, auto-increment)
      - `email` (text, unique, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add read policy for public on blogs
    - Add insert/read policy for subscribers
*/

CREATE TABLE IF NOT EXISTS blogs (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  description text,
  content text,
  category text DEFAULT 'blog',
  status text DEFAULT 'coming-soon',
  url text,
  slug text,
  featured boolean DEFAULT false,
  view_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR status = 'coming-soon');

CREATE POLICY "Anyone can insert subscriber"
  ON subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read subscribers"
  ON subscribers FOR SELECT
  TO anon, authenticated
  USING (true);
