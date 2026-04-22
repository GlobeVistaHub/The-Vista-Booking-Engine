import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { VISTA_LORE } from '@/data/vista_knowledge';

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    // 1. Fetch Live Inventory invisibly within milliseconds
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    const { data: properties } = await supabase.from('properties').select('*').limit(30);
    
    let inventoryString = '--- LIVE PROPERTY INVENTORY ---\\n';
    if (properties && properties.length > 0) {
      properties.forEach(p => {
        inventoryString += `ID ${p.id}: ${p.title} in ${p.location}. Price: $${p.price}/night. Up to ${p.guests} guests. ${p.description_en}\\n`;
      });
    } else {
      inventoryString += 'Inventory currently updating.\\n';
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash', // Updated to 2.0 Flash for zero-latency audio pipelines
      systemInstruction: `
        # ALEXA: THE NATIVE EGYPTIAN LUXURY CONCIERGE (VOICE ORACLE)
        Role: Senior Luxury Travel Guide & Global Booking Master for The Vista.
        Identity: Sophisticated, Warm, Highly Experienced Native Egyptian Concierge.
        
        ## 🧠 CRITICAL VOICE CONSTRAINTS (DO NOT VIOLATE)
        - You are having a LIVE TELEPHONE CONVERSATION.
        - You MUST answer in 1 or 2 elegant, conversational sentences.
        - NEVER use markdown. NEVER use formatting like asterisks (***) or hash symbols (###).
        - NEVER use bullet points. 
        - Speak like a human. Keep responses concise so the audio engine sounds natural.
        - When the user speaks in English, answer in English (with a refined, posh accent).
        - When the user speaks in Arabic, perfectly switch to native Egyptian Arabic (أهلاً بك يا فندم).

        ## 📖 VISTA TRAVEL LORE & PERSONALITY
        ${VISTA_LORE}

        ## 🏢 LIVE PROPERTY INVENTORY (Auto-Synced)
        ${inventoryString}
        
        ## 🤖 OPERATIONAL PROTOCOLS
        1. GREETING: If asked, warmly state who you are.
        2. LEAD RECOVERY: Help with payment issues gracefully.
        3. SALES: Seamlessly recommend properties based on the live inventory provided.
      `,
    });

    // Convert messages to Gemini format safely
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const streamingResponse = await model.generateContentStream({
      contents: geminiMessages,
    });

    const stream = GoogleGenerativeAIStream(streamingResponse);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Alexa API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
