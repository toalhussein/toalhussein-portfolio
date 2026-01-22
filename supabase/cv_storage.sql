-- ============================================
-- CV Storage Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Add cv_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Update the profiles table RLS policies (already exist, just ensuring they cover cv_url)
-- No changes needed as existing policies cover all columns

-- ============================================
-- STORAGE BUCKET FOR CV FILES
-- ============================================
-- Create storage bucket for CV files (run in Supabase Dashboard > Storage)
-- Bucket name: 'cv-files'
-- Public: true

-- Storage policies for cv-files bucket
-- Run these after creating the bucket:

-- Allow public to read CV files
CREATE POLICY "Public can view CV files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cv-files');

-- Allow authenticated users with admin role to upload CV files
CREATE POLICY "Admins can upload CV files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv-files' AND
  (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ))
);

-- Allow authenticated users with admin role to update CV files
CREATE POLICY "Admins can update CV files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ))
);

-- Allow authenticated users with admin role to delete CV files
CREATE POLICY "Admins can delete CV files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ))
);
