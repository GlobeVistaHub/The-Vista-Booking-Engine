const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Creating public-assets bucket...");
  const { data, error } = await supabase.storage.createBucket('public-assets', {
    public: true,
    fileSizeLimit: 10485760, // 10MB limit
  });
  
  if (error) {
    console.log("Error creating bucket:", error.message);
  } else {
    console.log("Bucket created successfully:", data);
  }
}

main();
