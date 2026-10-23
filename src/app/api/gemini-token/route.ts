import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  // Fetch Live Inventory from Supabase (Top 5 to keep prompt size manageable for Live API)
  let inventoryString = 'No live inventory currently available.';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: props } = await supabase.from('properties').select('title,title_ar,location,location_ar,price,bedrooms').limit(30);
    if (props && props.length > 0) {
      inventoryString = props.map(p => `- ${p.title} (Arabic: ${p.title_ar || p.title}) in ${p.location} (Arabic: ${p.location_ar || p.location}): $${p.price}/night, ${p.bedrooms} beds`).join('\n');
    }
  }

  return NextResponse.json({ key, inventoryString });
}
