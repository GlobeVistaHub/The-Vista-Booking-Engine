-- Step 4: CMS Manager (Content + Assets)

-- 1. Create a flexible key-value store for site content
CREATE TABLE IF NOT EXISTS public.site_content (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone can read the content (it's for the public website)
CREATE POLICY "Public can read site content"
    ON public.site_content
    FOR SELECT
    USING (true);

-- Only admins can update the content
CREATE POLICY "Admins can insert site content"
    ON public.site_content
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

CREATE POLICY "Admins can update site content"
    ON public.site_content
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

-- 4. Insert Default Values (Fallback content if not edited yet)
INSERT INTO public.site_content (key, value) VALUES
    ('hero_headline', 'Melbourne''s Premier Auto Detailing'),
    ('hero_subheadline', 'We restore your vehicle to showroom condition with surgical precision.'),
    ('contact_email', 'hello@auto-bath.com.au'),
    ('contact_phone', '0400 000 000'),
    ('social_instagram', 'https://instagram.com/autobath'),
    ('social_facebook', 'https://facebook.com/autobath'),
    ('social_tiktok', 'https://tiktok.com/@autobath')
ON CONFLICT (key) DO NOTHING;

-- 5. Add an updated_at trigger
CREATE OR REPLACE FUNCTION update_site_content_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_content_modtime_trigger
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION update_site_content_modtime();
