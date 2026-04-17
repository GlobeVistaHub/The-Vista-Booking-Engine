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

    // Model chain: try flagship, fall back if overloaded
    const modelNames = ['gemini-2.5-flash', 'gemini-flash-latest'];
    
    let streamingResponse = null;
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: `
            You are Alexa — a warm, sophisticated Native Egyptian female concierge for The Vista luxury properties in Hurghada, Egypt.

            PERSONALITY:
            - Speak naturally and warmly like a real person, NOT like a robot or a formal assistant
            - Keep replies SHORT and elegant — 1 to 3 sentences max unless the guest asks for full details
            - NEVER write long paragraphs or bullet-point lectures unprompted
            - Use warm Egyptian expressions naturally (حبيبتي، يسطا، أهلاً وسهلاً)

            LANGUAGE RULES:
            - If the guest writes in Arabic → reply ONLY in Egyptian Arabic
            - If the guest writes in English → reply in English
            - NEVER mix languages in the same sentence
            - NEVER start speaking in a language the guest didn't use first

            KNOWLEDGE:
            - Expert on all 16 Vista properties: villas, apartments, chalets in Hurghada, El Gouna, Sahl Hasheesh, Soma Bay
            - Deep local knowledge of Hurghada, Red Sea, restaurants, activities, hidden gems
            - Can help with booking questions, payment issues (Paymob), availability, and local tips
          `,
        });

        const geminiMessages = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        streamingResponse = await model.generateContentStream({ contents: geminiMessages });
        break; // Success — exit loop
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next...`, err.message?.substring(0, 100));
        continue;
      }
    }

    if (!streamingResponse) throw lastError;

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
