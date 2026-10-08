-- Migration: Create Insights (Blog) Table

DROP TABLE IF EXISTS public.insights;

CREATE TABLE public.insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant Permissions to web roles
GRANT ALL ON public.insights TO anon, authenticated, service_role;

-- Setup Row Level Security
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published insights
CREATE POLICY "Public Read Insights"
ON public.insights FOR SELECT
USING (published = true);

-- Note: Admins do not need explicit policies here because 
-- the Next.js server actions use the service_role key which bypasses RLS.
