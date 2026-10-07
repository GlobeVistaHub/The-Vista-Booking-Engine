-- Admin Schedule / Calendar (roadmap step 2)
-- Run once in the Supabase SQL editor.

-- 1. New booking outcome: customer did not show up.
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'no_show';

-- 2. Faster range queries for the calendar views.
CREATE INDEX IF NOT EXISTS bookings_scheduled_time_idx ON public.bookings (scheduled_time);

-- 3. Give the owner accounts the 'admin' role. Privileged server actions
--    (cancel, refund, mark complete / no-show, purge) now require it.
INSERT INTO public.profiles (id, role, full_name)
SELECT id, 'admin', 'Admin'
FROM auth.users
WHERE email IN ('admin@goodbrains.pro', 'admin@auto-bath.com.au')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
