import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  // 1. Get the secret from your environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 2. Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out - this is a fake request
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // 3. Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 4. Create a new Svix instance and verify the message
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 })
  }

  // 5. Handle the event (Login/Logout)
  const eventType = evt.type;
  const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
  
  if (eventType === 'session.created') {
    const { user_id, last_active_at } = evt.data;
    
    await supabaseAdmin.from('user_activity').insert({
      user_id,
      event_type: 'login',
      timestamp: last_active_at ? new Date(last_active_at).toISOString() : new Date().toISOString(),
      metadata: { source: 'clerk_webhook', status: 'active' }
    });
    
    console.log(`[Vista-Security] User ${user_id} session recorded (Login)`);
  }

  if (eventType === 'session.ended') {
    const { user_id } = evt.data;
    
    await supabaseAdmin.from('user_activity').insert({
      user_id,
      event_type: 'logout',
      timestamp: new Date().toISOString(),
      metadata: { source: 'clerk_webhook', status: 'ended' }
    });
    
    console.log(`[Vista-Security] User ${user_id} session recorded (Logout)`);
  }

  return new Response('', { status: 200 }) // Sync trigger for Vercel deployment
}
