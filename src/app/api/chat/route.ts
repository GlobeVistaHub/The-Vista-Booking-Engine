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
          
          return `
PROPERTY: ${p.title} (${p.title_ar})
Location: ${p.location} (${p.location_ar})
Price: $${p.price}/night
Features: ${JSON.stringify(p.features)}
Rules: ${p.rules || 'Standard luxury stay rules apply.'}
Description: ${p.description}
Current Booked Dates: ${bookingDates || 'None currently confirmed for the future.'}
---`;
        }).join('\n');
      }
    }

    const systemPrompt = `
      ${VISTA_ALEXA_PERSONA}
      ## LIVE INVENTORY
      ${inventoryString}
      ## FORMAT
      ${isVoiceMode 
        ? 'Concise (1-2 sentences max). CRITICAL: NEVER use markdown, asterisks, bold text, or bullet points. You are speaking out loud. Respond in pure, natural plain text only.' 
        : 'Elegant, helpful, and highly readable. Keep paragraphs short (2-3 sentences max per paragraph). Limit total response length to avoid overwhelming the user. Use gentle spacing.'}
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
