const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function checkColumns() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .limit(1);

  if (error) {
    console.error("DB Error:", error.message);
    return;
  }
  
  if (data && data.length > 0) {
    console.log("Found Columns:", Object.keys(data[0]));
  } else {
    console.log("Table is empty, trying to fetch schema info...");
    // Alternative: check a specific column
    const { data: colData, error: colError } = await supabase
      .from('bookings')
      .select('booking_reference')
      .limit(1);
    
    if (colError) {
      console.log("Column 'booking_reference' missing!");
    } else {
      console.log("Column 'booking_reference' exists.");
    }
  }
}

checkColumns();
