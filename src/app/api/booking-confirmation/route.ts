import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // -------------------------------------------------------------------------
    // THE VISTA BRIDGE: Server-side trigger for n8n/webhook.site
    // -------------------------------------------------------------------------
    const N8N_WEBHOOK_URL = "https://webhook.site/bfeaeb6d-fa7d-4162-9548-a1a51fb1506c";

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Automation error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Vista Automation Bridge Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
