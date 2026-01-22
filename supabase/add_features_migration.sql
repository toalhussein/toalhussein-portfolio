-- ============================================
-- Add Key Features to Projects Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add features_ar and features_en columns to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS features_ar TEXT[],
ADD COLUMN IF NOT EXISTS features_en TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN public.projects.features_ar IS 'Array of key features in Arabic';
COMMENT ON COLUMN public.projects.features_en IS 'Array of key features in English';
