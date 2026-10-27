import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30; // 30 seconds

// We use the admin client here because this is a server route and we just need read access to public tables quickly
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CACHE_TTL_MS = 60_000;
const MODEL_CHAIN = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash'];
const FIRST_TOKEN_TIMEOUT_MS = 6_000;
let cache: { at: number; services: any[] | null; contentRows: any[] | null } | null = null;

// Live Supabase data (prices, contact info), cached briefly so most chat turns skip the DB round trip
async function getLiveData() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache;
  const [{ data: services }, { data: contentRows }] = await Promise.all([
    supabase.from('services').select('*'),
    supabase.from('site_content').select('*')
  ]);
  cache = { at: Date.now(), services, contentRows };
  return cache;
}


const SERVICE_ID_TO_PACKAGE: Record<string, string> = {
  "c2a502e8-e825-4876-b459-9334e801e363": "wash",
  "a92d99bf-11be-4afb-9860-5844233d2899": "interior",
  "4b293e74-9b13-4af4-8901-49ac014ad043": "paint",
  "f90656aa-808f-41f4-a789-7dcf6a934df8": "ceramic",
  "49d0b87f-744d-4bf8-9821-2df1f9c67a60": "concourse",
  "7d2e4a81-9b51-4e1a-8f12-9c3f6e8a0112": "ppf",
  "5c3d1e92-8a40-4d2b-9e23-8b2e5f7a0223": "leather",
  "3b1c9d83-7f39-4c3a-8d34-7a1e4d6a0334": "engine",
  "9e4f1a2b-3c5d-4e6f-8a0b-1c2d3e4f5a6b": "graphene",
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { services, contentRows } = await getLiveData();

  // Format site content (like phone number, address, custom service titles & descriptions)
  const contentMap = contentRows?.reduce((acc, row: any) => ({ ...acc, [row.key]: row.value }), {}) || {};
  const phone = contentMap['contact_phone'] || '+61 400 764 508';
  const address = contentMap['business_address'] || '64 Bulla Rd, Strathmore, VIC 3041';
  const waPhone = phone.replace(/[^0-9]/g, '').startsWith('0') ? `61${phone.replace(/[^0-9]/g, '').substring(1)}` : phone.replace(/[^0-9]/g, '');

  // Format the services into a rich readable string for the AI, drawing both base_price and live CMS descriptions
  const liveServices = services?.map((s: any) => {
    const pkg = SERVICE_ID_TO_PACKAGE[s.id];
    const customTitle = pkg ? contentMap[`service_title_${pkg}`] : null;
    const title = customTitle || s.name;
    const desc = pkg ? contentMap[`service_desc_${pkg}`] : '';
    const rawFeatures = pkg ? contentMap[`service_features_${pkg}`] : '';
    const features = rawFeatures ? ` [Includes: ${rawFeatures.split('\n').filter(Boolean).join(', ')}]` : '';
    return `- ${title} (FROM $${(s.base_price / 100).toFixed(0)} AUD)${desc ? `: ${desc}` : ''}${features}`;
  }).join('\n') || 'Our premium services are currently being updated.';

  // 2. The Elite System Prompt
  const systemPrompt = `
You are the elite Digital Concierge for "Auto-Bath Detailing", a premium, luxury automotive detailing facility located in Melbourne, Australia (${address}).

PERSONA & TONE:
- You are friendly, highly professional, relatable, and culturally attuned to Australia (you can use subtle Australian phrasing, but keep it high-end and luxurious).
- You are deeply knowledgeable about the automotive industry, paint correction, ceramic coatings (liquid quartz, 9H hardness), and car culture. You have your own insights and can explain complex detailing concepts (like dual-action polishing or pH-neutral foam) in a very relatable, easy-to-understand manner.
- Do NOT say "car wash". You provide "automotive rejuvenation", "concourse-level restoration", and "paint preservation".
- You are helpful but concise. Do not write massive walls of text unless asked for a detailed explanation. Keep it mobile-friendly and scannable.

LIVE DATABASE KNOWLEDGE:
Here are our exact, current live services and starting prices pulled directly from our database:
${liveServices}

Our Contact Phone: ${phone}

YOUR DIRECTIVES:
1. If a customer asks for pricing or services, quote the EXACT live data provided above. Do not invent prices.
2. If a customer wants to book an appointment, warmly instruct them to click the "X" to close this chat, and click any of the "Book Now" buttons on the pricing grid, which will open our live booking calendar.
3. If they need to send photos of their car for an exact quote on paint correction, tell them they can message us on WhatsApp directly at https://wa.me/${waPhone}
4. Always be encouraging. If they ask if a scratch can be removed, explain that it depends on if it has breached the clear coat, and offer that our Paint Correction experts can assess it in person at our Strathmore facility.
`;

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const modelId of MODEL_CHAIN) {
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), FIRST_TOKEN_TIMEOUT_MS);
        let sentAnything = false;
        try {
          const result = streamText({
            model: google(modelId),
            system: systemPrompt,
            messages,
            abortSignal: abort.signal,
            onError: ({ error }) => console.error(`Chat stream error (${modelId}):`, error),
          });

          for await (const chunk of result.textStream) {
            if (!sentAnything) clearTimeout(timer);
            sentAnything = true;
            controller.enqueue(encoder.encode(chunk));
          }
          clearTimeout(timer);
          if (sentAnything) return controller.close();
          console.warn(`Model ${modelId} returned nothing, trying next fallback`);
        } catch (error) {
          clearTimeout(timer);
          console.error(`Chat model ${modelId} failed:`, error);
          if (sentAnything) return controller.close();
        }
      }
      controller.close();
    },
  });

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
