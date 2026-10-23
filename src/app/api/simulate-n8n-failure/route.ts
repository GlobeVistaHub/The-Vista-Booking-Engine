import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  
  if (!url) {
    return NextResponse.json({ error: "N8N Configuration missing in .env.local" }, { status: 500 });
  }

  // Force it to use the test webhook so n8n "Listen for Test Event" catches it instantly
  const testUrl = url.replace('/webhook/', '/webhook-test/');

  const formData = new FormData();
  formData.append('status', 'FAILURE');
  formData.append('bookingRef', 'VST-SIMULATION-999');
  formData.append('guestName', 'Jane Doe');
  formData.append('guestEmail', 'jane.doe@test.com');
  formData.append('propertyName', 'The Glass Oasis');
  formData.append('amount', 'USD 1,450');
  formData.append('checkIn', '4/21/2026');
  formData.append('checkOut', '4/25/2026');

  const recoveryNote = `⚠️ PAYMENT INTERRUPTED

[Owner Alert Details]
Guest: Jane Doe
Email: jane.doe@test.com
Property: The Glass Oasis
Amount: USD 1,450
Ref: VST-SIMULATION-999

----------------
[Guest Follow-up Draft]
Hi Jane Doe,

We noticed you had an issue completing your booking for The Glass Oasis. 

Please let our Concierge know if we can assist you with finalizing your reservation.`;

  formData.append('ownerNotification', recoveryNote);
  formData.append('waMsg', recoveryNote);
  formData.append('ownerPhone', '201145551163');
  formData.append('ownerEmail', 'support@globevistahub.com');

  try {
    const response = await fetch(testUrl, { method: "POST", body: formData });
    
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "✅ FORCE SIGNAL SENT TO N8N TEST URL SUCCESSFULLY!",
        target_url: testUrl
      });
    } else {
      const err = await response.text();
      return NextResponse.json({ 
        success: false, 
        message: "❌ N8N REJECTED THE SIGNAL",
        n8n_response_status: response.status,
        n8n_error: err
      }, { status: 502 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
