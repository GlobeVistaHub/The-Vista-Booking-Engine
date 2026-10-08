-- Migration: Setup Storage Bucket for CMS Assets

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup Security Policies for public-assets

-- Allow public read access to anyone
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Allow admins to insert files
CREATE POLICY "Admin Insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-assets' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow admins to update files
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public-assets' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow admins to delete files
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-assets' AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
