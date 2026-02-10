/*
  # Add subscriber fields

  1. Add missing columns to subscribers table
    - `status` (text, default 'active')
    - `source` (text, default 'unknown')
    - `subscribed_at` (timestamp)

  2. Update existing rows with defaults
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscribers' AND column_name = 'status'
  ) THEN
    ALTER TABLE subscribers ADD COLUMN status text DEFAULT 'active';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscribers' AND column_name = 'source'
  ) THEN
    ALTER TABLE subscribers ADD COLUMN source text DEFAULT 'unknown';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscribers' AND column_name = 'subscribed_at'
  ) THEN
    ALTER TABLE subscribers ADD COLUMN subscribed_at timestamptz DEFAULT now();
  END IF;
END $$;
