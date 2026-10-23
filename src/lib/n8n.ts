/**
 * Universal n8n Library (Client & Server Compatible)
 * This file MUST NOT import 'puppeteer' or '@sparticuz/chromium'.
 * Server-only Dossier logic is moved to n8n-server.ts.
 */

/**
 * Triggers the n8n "Cart Recovery" flow when a payment fail is detected or simulated.
 * Routes through /api/trigger-recovery (server-side) to bypass CORS restrictions.
 */
export const triggerN8NFailRecovery = async (booking: any, property: any) => {
  try {
    const payload = {
      type: 'PAYMENT_INTERRUPTED',
      bookingId: booking.booking_reference || booking.id,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      guestPhone: booking.guest_phone || "",
      supportEmail: "support@globevistahub.com",
      adminPhone: "+201145551163",
      propertyTitle: property?.title_en || property?.title || "Vista Property",
      propertyLocation: property?.location || "",
      totalAmount: booking.total_price,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      whatsappLink: `https://wa.me/+201145551163?text=Hi, I had an issue booking ${property?.title || 'a property'}. Can the Concierge help?`
    };

    console.log("[N8N] Sending recovery signal via server proxy...");

    const response = await fetch('/api/trigger-recovery', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("[N8N SUCCESS] Recovery signal transmitted successfully.");
    } else {
      const err = await response.json().catch(() => ({}));
      console.error("[N8N ERROR] Proxy responded with:", response.status, err);
    }
  } catch (error: any) {
    console.error("[N8N FATAL ERROR] Recovery flow failed:", error.message);
  }
};
