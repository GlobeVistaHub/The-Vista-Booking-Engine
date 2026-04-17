import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // -------------------------------------------------------------------------
    // THE VISTA SIMULATION: "Fake Server" Hack
    // We wait 2 seconds to simulate internet travel time (Cinematic experience)
    // -------------------------------------------------------------------------
    await new Promise(resolve => setTimeout(resolve, 2000));

    const N8N_WEBHOOK_URL = "https://webhook.site/bfeaeb6d-fa7d-4162-9548-a1a51fb1506c";

    try {
      // We try to talk to n8n for your funnel test
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Even if n8n is slow or fails, we return success to the frontend
      // This is the "Mock API" hack to keep the water flowing in the funnel
      return NextResponse.json({ success: true, simulated: !response.ok });
    } catch (e) {
      // Fail-safe: n8n is down but the user sees success
      return NextResponse.json({ success: true, simulated: true });
    }
  } catch (error: any) {
    return NextResponse.json({ success: true, error: "Simulation fail-safe" });
  }
}