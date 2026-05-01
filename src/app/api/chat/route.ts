import { createClient } from '@supabase/supabase-js';
import { VISTA_ALEXA_PERSONA } from '@/data/vista_knowledge';
import fetchNode from 'node-fetch';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, isVoiceMode } = await req.json();

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is missing');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let inventoryString = '';
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // 1. Fetch detailed property info
      const { data: props } = await supabase
        .from('properties')
        .select('id, title, title_ar, location, location_ar, price, description, description_ar, features, rules')
        .limit(30);

      // 2. Fetch recent bookings to help with availability questions
      const { data: bookings } = await supabase
        .from('bookings')
        .select('property_id, check_in, check_out, status')
        .eq('status', 'confirmed')
        .gte('check_out', new Date().toISOString())
        .limit(50);

      if (props) {
        inventoryString = props.map(p => {
          const propertyBookings = bookings?.filter(b => b.property_id === (p as any).id) || [];
          const bookingDates = propertyBookings.map(b => `${b.check_in} to ${b.check_out}`).join(', ');
          const amenities = Array.isArray(p.features) ? p.features.join(', ') : 'Luxury amenities';
          
          return `
[PROPERTY START]
Name: ${p.title}
Arabic Name: ${p.title_ar}
Location: ${p.location}
Price: $${p.price}/night
Amenities: ${amenities}
Description: ${p.description}
Unavailable Dates: ${bookingDates || 'All dates currently available'}
[PROPERTY END]`;
        }).join('\n');
      }
    }

    const systemPrompt = `
      ${VISTA_ALEXA_PERSONA}

      # YOUR CURRENT REAL-TIME INVENTORY (TRUST THIS OVER EVERYTHING)
      ${inventoryString}

      # CRITICAL INSTRUCTION
      - You must ONLY use the properties listed above.
      - If a user asks about a property in the list, acknowledge it enthusiastically.
      - If a user mentions "Neon Penthouse", it is one of your most premium listings.
      
      # FORMATTING
      ${isVoiceMode 
        ? 'Respond in 1-2 sentences only. NO markdown. NO bold. NO bullet points. Just plain text for speaking.' 
        : 'Elegant and luxurious. Use short paragraphs.'}
    `;

    const requestBody = JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    // Bypass Next.js built-in fetch (which crashes Node 24 on Windows) by using node-fetch
    const geminiRes = await fetchNode(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
    });

    if (!geminiRes.ok) {
      const errTxt = await geminiRes.text();
      console.warn("Gemini API Error:", errTxt);
      try {
        const errObj = JSON.parse(errTxt);
        throw new Error(errObj.error?.message || "Gemini API Error");
      } catch (e) {
        throw new Error("API Limit reached or invalid request: " + errTxt);
      }
    }

    const data = await geminiRes.json() as any;
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I seem to have lost my connection.";

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`0:${JSON.stringify(responseText)}\n`));
        controller.close();
      }
    });

    return new Response(stream, { 
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      } 
    });

  } catch (error: any) {
    console.warn('ALEXA SDK ERROR:', error.message);
    return new Response(error.message, { status: 500 });
  }
}
