import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for the n8n Recovery Webhook.
 * Sends ONLY the WhatsApp alert (ownerPhone + ownerNotification fields).
 * Does NOT trigger n8n's email node to avoid the "Booking Confirmed" inverted logic.
 * The failure EMAIL must be handled by a separate n8n workflow or SMTP integration.
 */
export async function POST(req: NextRequest) {
  const url = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!url) {
    console.error('[RECOVERY API] N8N webhook URL is not defined in environment.');
    return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
  }

  try {
    const payload = await req.json();
    const {
      guestName, guestEmail, bookingId,
      propertyTitle, propertyLocation,
      totalAmount, checkIn, checkOut,
      adminPhone, whatsappLink
    } = payload;

    // Resolved values with safe fallbacks
    const resolvedName = guestName && guestName !== 'Guest' ? guestName : guestEmail?.split('@')[0] || 'Guest';
    const resolvedAmount = `USD ${Number(totalAmount || 0).toLocaleString()}`;

    // Build FormData matching n8n's expected format
    const formData = new FormData();
    formData.append('bookingRef', bookingId || 'N/A');
    formData.append('guestName', resolvedName);
    formData.append('guestEmail', guestEmail || 'support@globevistahub.com');
    formData.append('propertyName', propertyTitle || 'Vista Property');

    // WhatsApp failure alert to admin
    const failureWhatsApp = [
      `⚠️ Vista Alert — Payment Interrupted`,
      `Guest: ${resolvedName}`,
      `Email: ${guestEmail || 'N/A'}`,
      `Property: ${propertyTitle || 'Vista Property'} (${propertyLocation || ''})`,
      `Amount: ${resolvedAmount}`,
      `Check-in: ${checkIn} → Check-out: ${checkOut}`,
      `Ref: ${bookingId || 'N/A'}`,
      ``,
      `Recovery initiated. Contact: ${whatsappLink || ''}`,
      `— The Vista Intelligence Suite`
    ].join('\n');

    formData.append('ownerPhone', adminPhone || '+201145551163');
    formData.append('ownerEmail', 'support@globevistahub.com');
    formData.append('whatsAppMessage', failureWhatsApp);
    formData.append('ownerNotification', failureWhatsApp);

    // Prevent n8n's email node from firing by not including a valid guestEmail destination
    // n8n will route to WhatsApp only
    formData.append('status', 'FAILED'); // NEW: Unified status flag
    formData.append('skipEmail', 'true');

    console.log('[RECOVERY API] Forwarding failure alert (WhatsApp only) to n8n:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    console.log('[RECOVERY API] n8n responded:', response.status, responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'n8n webhook failed', status: response.status, body: responseText },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, status: response.status });
  } catch (error: any) {
    console.error('[RECOVERY API] Fatal error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
