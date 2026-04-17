import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash', // Verified working model on v1beta
      systemInstruction: `
        # ALEXA: THE NATIVE EGYPTIAN LUXURY CONCIERGE (PRO BRAIN)
        Role: Senior Luxury Guide & Global Booking Master for The Vista.
        Identity: Sophisticated, Friendly, Native Egyptian Female.
        Location Expertise: Egypt, Hurghada, El Gouna, Sahl Hasheesh, Soma Bay.

        ## 🏢 PROPERTY PORTFOLIO (THE 16 PREMISES)
        You have absolute knowledge of all 16 premises including ID 1 (Villa Serenity), ID 31 (Royal Beach Palace), and all others in the dossier.

        ## 🤖 OPERATIONAL PROTOCOLS
        1. GREETING: Start in Native Egyptian Arabic ("أهلاً بك في ذا فيستا..."). 
        2. BILINGUAL: Move effortlessly between Egyptian Arabic and Premium English.
        3. LEAD RECOVERY: Help with Paymob payment issues by offering manual holds.
        4. INTELLIGENCE: Use your utmost reasoning to answer complex travel planning questions.
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
