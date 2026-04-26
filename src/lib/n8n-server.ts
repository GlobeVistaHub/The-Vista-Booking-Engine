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
    const options = await getOptions();
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    const htmlDossier = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #FAFAFA; color: #111827; margin: 0; padding: 40px; }
          .dossier-card { background: #FFFFFF; max-width: 800px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
          .header { background-color: #0A1128; color: #FFFFFF; padding: 40px; text-align: center; }
          .header h1 { font-family: 'Playfair Display', serif; margin: 0; font-size: 32px; text-transform: uppercase; }
          .header p { color: #D4AF37; margin-top: 10px; font-size: 14px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; }
          .content { padding: 40px; }
          .section { margin-bottom: 30px; }
          .section-title { font-family: 'Playfair Display', serif; font-size: 14px; color: #6B7280; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px; margin-bottom: 15px; }
          .grid { display: flex; justify-content: space-between; flex-wrap: wrap; }
          .col { width: 48%; margin-bottom: 20px; }
          .label { font-size: 10px; color: #9CA3AF; text-transform: uppercase; font-weight: bold; }
          .value { font-size: 16px; font-weight: 600; color: #0A1128; margin-top: 4px; }
          .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="dossier-card">
          <div class="header"><h1>Official Guest Dossier</h1><p>The Vista Collection</p></div>
          <div class="content">
            <div class="section"><h2 class="section-title">Booking Confirmation</h2>
              <div class="grid">
                <div class="col"><div class="label">Reference ID</div><div class="value">${formattedRef}</div></div>
                <div class="col"><div class="label">Status</div><div class="value" style="color: #10B981;">SECURE & CONFIRMED</div></div>
                <div class="col"><div class="label">Total Paid</div><div class="value">USD ${Number(booking.total_price || 0).toLocaleString()}</div></div>
              </div>
            </div>
            <div class="section"><h2 class="section-title">Guest Profile</h2>
              <div class="grid">
                <div class="col"><div class="label">Primary Guest</div><div class="value">${gName}</div></div>
                <div class="col"><div class="label">Contact Email</div><div class="value">${booking.guest_email || 'Secured'}</div></div>
              </div>
            </div>
            <div class="section"><h2 class="section-title">Property Access</h2>
              <div class="value" style="font-size: 20px;">${prop?.title_en || prop?.title || "Vista Property"}</div>
              <div style="margin-top: 10px;">${booking.check_in} - ${booking.check_out}</div>
            </div>
          </div>
          <div class="footer">Generated for <strong>${gName}</strong>.</div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlDossier, { waitUntil: 'load' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    pdfBuffer = Buffer.from(pdf);
  } catch (err: any) {
    console.error("[N8N] PDF Failed, proceeding with WhatsApp only.");
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
  // Fields required by n8n email template
  form.append('guestName', gName);
  form.append('propertyName', prop?.title_en || prop?.title || "Vista Property");
  form.append('ownerEmail', prop?.owner_email || "info@globevistahub.com");

  if (pdfBuffer) {
    form.append('dossier', pdfBuffer, { filename: `Vista_Dossier_${formattedRef}.pdf`, contentType: 'application/pdf' });
  }

  try {
    await fetch(url, { method: "POST", body: form, headers: form.getHeaders() });
    console.log("[N8N] Handshake Complete.");
  } catch (e: any) { }
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
