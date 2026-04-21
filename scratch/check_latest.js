const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function checkLatest() {
  console.log("Checking latest booking...");
  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("Latest Booking ID:", data.id);
  console.log("Ref:", data.booking_reference);
  console.log("Payment Status:", data.payment_status);
  console.log("Guest:", data.guest_name);
  console.log("Property:", data.properties?.title || "N/A");
  console.log("Created At:", data.created_at);
}

checkLatest();
