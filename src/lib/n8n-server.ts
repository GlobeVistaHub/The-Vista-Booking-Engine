import { createClient } from '@supabase/supabase-js';

/**
 * PRODUCTION & LOCAL: Environment-aware browser launcher
 */
const getOptions = async () => {
  const chromium = (await import('@sparticuz/chromium')).default;
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  } else {
    return {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
    };
  }
};

/**
 * Trigger N8N for Successful Bookings (Dossier + Notification)
 */
export const triggerN8NDossier = async (booking: any, property: any) => {
  const puppeteer = await import('puppeteer-core');
  const FormData = (await import('form-data')).default;
  const fetch = (await import('node-fetch')).default;

  const url = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!url) return;

  const prop = Array.isArray(property) ? property[0] : property;
  const formattedRef = (booking.booking_reference || booking.id).toString();

  // SMART NAME RESOLVER
  let gName = booking.guest_name && booking.guest_name !== 'Guest' ? booking.guest_name : '';
  if (!gName && booking.guest_email) {
    const emailPrefix = booking.guest_email.split('@')[0];
    gName = emailPrefix.split(/[._-]/).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  if (!gName) gName = "Valued Guest";

  const propertyImg = prop?.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop';
  const propertyBrief = `${prop?.type || 'Luxury Estate'} in ${prop?.location || 'Premium Destination'}`;

  let browser: any = null;
  let pdfBuffer: Buffer | null = null;

  try {
    console.log(`[N8N] Starting Dossier Generation for ${formattedRef}...`);
    const options = await getOptions();
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    const htmlDossier = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; color: #1a1a1a; margin: 0; padding: 40px; background: #e5e7eb; }
          .dossier-card { background: white; max-width: 750px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
          .header { background: #0A1128; color: white; padding: 35px 20px; text-align: center; }
          .header h1 { font-family: 'Playfair Display', serif; margin: 0; font-size: 26px; letter-spacing: 3px; text-transform: uppercase; }
          .header p { color: #D4AF37; margin: 8px 0 0; font-size: 10px; letter-spacing: 4px; font-weight: 600; text-transform: uppercase; }
          .content { padding: 45px; }
          .section-title { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 35px; }
          .label { font-size: 9px; color: #9ca3af; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.5px; }
          .value { font-size: 14px; font-weight: 700; color: #111827; }
          .status-confirmed { color: #10B981; }
          .property-section { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
          .property-info { flex: 1; }
          .property-image { width: 220px; height: 130px; border-radius: 8px; object-fit: cover; }
          .location-box { border-left: 2px solid #D4AF37; padding-left: 10px; margin: 5px 0 20px; font-size: 11px; color: #6b7280; font-style: italic; }
          .footer { background: #f9f9f9; text-align: center; padding: 25px; font-size: 12px; color: #999; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="dossier-card">
          <div class="header">
            <h1>OFFICIAL GUEST DOSSIER</h1>
            <p>THE VISTA COLLECTION</p>
          </div>
          
          <div class="content">
            <div class="section-title">BOOKING CONFIRMATION</div>
            <div class="grid">
              <div>
                <div class="label">REFERENCE ID</div>
                <div class="value">${formattedRef}</div>
              </div>
              <div>
                <div class="label">STATUS</div>
                <div class="value status-confirmed">SECURE & CONFIRMED</div>
              </div>
              <div>
                <div class="label">TOTAL PAID</div>
                <div class="value">USD ${Number(booking.total_price || 0).toLocaleString()}</div>
              </div>
              <div>
                <div class="label">TRANSACTION ID</div>
                <div class="value">${booking.transaction_id || 'N/A'}</div>
              </div>
            </div>

            <div class="section-title">GUEST PROFILE</div>
            <div class="grid">
              <div>
                <div class="label">PRIMARY GUEST</div>
                <div class="value">${gName}</div>
              </div>
              <div>
                <div class="label">CONTACT EMAIL</div>
                <div class="value">${booking.guest_email || 'Secured'}</div>
              </div>
              <div>
                <div class="label">TRAVEL PARTY</div>
                <div class="value">${booking.adults || 2} Adults, ${booking.children || 0} Children</div>
              </div>
            </div>

            <div class="section-title">PROPERTY ACCESS</div>
            <div class="property-section">
              <div class="property-info">
                <div class="label">ESTATE NAME</div>
                <div class="value" style="font-size: 16px;">${prop?.title_en || prop?.title || "Vista Property"}</div>
                <div class="location-box">${prop?.location || "Private Location"}</div>
                <div class="grid" style="margin-top: 15px; grid-template-columns: 1fr 1fr;">
                  <div>
                    <div class="label">CHECK IN</div>
                    <div class="value">${booking.check_in}</div>
                  </div>
                  <div>
                    <div class="label">CHECK OUT</div>
                    <div class="value">${booking.check_out}</div>
                  </div>
                </div>
              </div>
              <img src="${propertyImg}" class="property-image" alt="Property">
            </div>
          </div>

          <div class="footer">
            Generated securely by The Vista Booking Engine for <strong>${gName}</strong>.
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlDossier, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    pdfBuffer = Buffer.from(pdf);
    console.log(`[N8N] PDF Generated Successfully (${pdfBuffer.length} bytes)`);
  } catch (err: any) {
    console.error("[N8N] PDF Failed:", err.message);
    console.log("[N8N] Proceeding with WhatsApp/Email only (No PDF).");
  } finally {
    if (browser) await browser.close();
  }

  const successMsg = `✅ BOOKING SECURED \n\nGuest: ${gName} \nProperty: ${prop?.title_en || prop?.title || "Vista Property"} \nAmount: USD ${Number(booking.total_price || 0).toLocaleString()} \nRef: ${formattedRef} \nDates: ${booking.check_in} - ${booking.check_out} \n\nDossier dispatched successfully.`;

  const form = new FormData();
  form.append('status', 'SUCCESS');
  form.append('ownerPhone', prop?.owner_phone || "201145551163");
  form.append('ownerNotification', successMsg);
  form.append('guestEmail', booking.guest_email || "");
  form.append('bookingRef', formattedRef);
  form.append('guestName', gName);
  form.append('propertyName', prop?.title_en || prop?.title || "Vista Property");
  form.append('ownerEmail', prop?.owner_email || "info@globevistahub.com");

  if (pdfBuffer) {
    form.append('dossier', pdfBuffer, { filename: `Vista_Dossier_${formattedRef}.pdf`, contentType: 'application/pdf' });
  }

  try {
    console.log(`[N8N] Sending Handshake to Webhook: ${url.slice(0, 30)}...`);
    const response = await fetch(url, { method: "POST", body: form, headers: form.getHeaders() });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[N8N] Webhook Error (${response.status}):`, errorText);
    } else {
      console.log("[N8N] Handshake Complete. Webhook accepted the dossier.");
    }
  } catch (e: any) {
    console.error("[N8N] Fetch Fatal Error:", e.message);
  }
};

/**
 * Recovery Trigger for Interrupted Payments
 */
export const triggerN8NRecovery = async (booking: any, property: any) => {
  const FormData = (await import('form-data')).default;
  const fetch = (await import('node-fetch')).default;
  const url = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!url) return;

  let gName = booking.guest_name && booking.guest_name !== 'Guest' ? booking.guest_name : '';
  if (!gName && booking.guest_email) {
    const emailPrefix = booking.guest_email.split('@')[0];
    gName = emailPrefix.split(/[._-]/).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  if (!gName) gName = "Guest";

  const failureMsg = `⚠️ Vista Alert — Payment Interrupted \nGuest: ${gName} \nEmail: ${booking.guest_email || 'N/A'} \nProperty: ${property?.title_en || property?.title || "Vista Property"} \nAmount: USD ${Number(booking.total_price || 0).toLocaleString()} \nCheck-in: ${booking.check_in} → Check-out: ${booking.check_out} \nRef: ${(booking.booking_reference || booking.id).toString()}`;

  const form = new FormData();
  form.append('status', 'FAILED');
  form.append('ownerPhone', property?.owner_phone || "201145551163");
  form.append('ownerNotification', failureMsg);

  try {
    await fetch(url, { method: "POST", body: form, headers: form.getHeaders() });
    console.log("[N8N] Recovery Sent.");
  } catch (e) { }
};
