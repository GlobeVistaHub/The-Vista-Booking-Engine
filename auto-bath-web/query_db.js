const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sb.from('bookings').select('id, status, created_at, profiles(full_name)').order('created_at', { ascending: false }).limit(5).then(res => console.log(JSON.stringify(res.data, null, 2)));
