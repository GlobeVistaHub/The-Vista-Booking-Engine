import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

/**
 * Knowledge Miner for Alex (AI Concierge) - DATABASE EDITION
 * This version fetches all 11+ properties from your live Supabase DB.
 */

async function compileKnowledge() {
  console.log("--- THE VISTA KNOWLEDGE DOSSIER (LIVE DB) ---");
  
  // 1. Load Env Vars manually from .env.local
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(`Error: .env.local not found at ${envPath}`);
    return;
  }
  
  const envContent = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  
  envContent.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;
    
    const firstEqual = trimmedLine.indexOf("=");
    if (firstEqual === -1) return;

    const key = trimmedLine.substring(0, firstEqual).trim();
    let value = trimmedLine.substring(firstEqual + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }
    
    env[key] = value;
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Supabase keys not found in .env.local");
    console.log("Found keys:", Object.keys(env)); // Debug help for you
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Fetch all properties
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*");

  if (error || !properties) {
    console.error("Error fetching properties:", error);
    return;
  }

  // 2.1 Fetch dynamic support email
  const { data: supportEmailRec } = await supabase
    .from("site_content")
    .select("value_en")
    .eq("key", "support_email")
    .single();
  
  const conciergeEmail = supportEmailRec?.value_en || "support@globevistahub.com";

  console.log(`Generated on: ${new Date().toLocaleString()}`);
  console.log(`Reporting on: ${properties.length} Total Properties\n`);

  properties.forEach(p => {
    console.log(`[PROPERTY ID: ${p.id}]`);
    console.log(`Name: ${p.title}`);
    console.log(`Location: ${p.location}`);
    console.log(`Type: ${p.type}`);
    console.log(`Pricing: $${p.price} per night (Base guests: ${p.base_guests})`);
    console.log(`Capacity: ${p.guests} guests, ${p.bedrooms} bedrooms`);
    console.log(`Highlights: ${(p.tags || []).join(", ")}`);
    console.log(`Description: ${p.description_en}`);
    console.log(`Owner Contact: ${p.owner_phone} / ${p.owner_email}`);
    console.log("-----------------------------------\n");
  });

  console.log("INSTRUCTIONS FOR ALEX:");
  console.log("1. You are Alex, the premium concierge for The Vista.");
  console.log("2. Use the data above to answer guest questions about amenities, pricing, and locations.");
  console.log("3. If a guest mentions a payment failure, guide them to 'Speak to Alex' and assure them their dates are held.");
  console.log(`4. If a guest needs official support or has a complex request, refer them to: ${conciergeEmail}`);
  console.log("5. Always maintain a sophisticated, helpful, and luxury tone.");
}

compileKnowledge();
