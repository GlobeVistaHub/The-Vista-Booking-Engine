import { Booking } from "@/data/api";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// PRODUCTION CLUSTER: Environment-aware browser launcher
const getOptions = async () => {
  const isVercel = !!process.env.VERCEL;
  
  if (isVercel) {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  } else {
    // Local Windows/Desktop Path
    return {
      args: [],
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
    };
  }
};

/**
 * Fires the N8N Webhook with the actual PDF binary and metadata.
 */
export const triggerN8NDossier = async (booking: any, property: any) => {
  const url = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!url) {
    console.error("[N8N ERROR] N8N webhook URL is not defined in environment.");
    return;
  }

  let browser: any;
  let finalUrl = url;

  // Ensure we have a single property object even if Supabase returns an array
  const prop = Array.isArray(property) ? property[0] : property;
  
  const formattedRef = (booking.booking_reference || booking.id).toString();
  const propertyImg = prop?.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop';
  const propertyBrief = `${prop?.type || 'Luxury Estate'} in ${prop?.location || 'Premium Destination'}`;

  const formData = new FormData();
  let pdfBlob: any = null;

  // --- STEP 1: Try PDF generation ---
  try {
    const htmlDossier = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', 'Tajawal', Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #111827; margin: 0; padding: 40px; }
          .dossier-card { background: #FFFFFF; max-width: 800px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background-color: #0A1128; color: #FFFFFF; padding: 40px; text-align: center; }
          .header h1 { font-family: 'Playfair Display', 'Cairo', serif; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
          .header p { font-family: 'Inter', 'Tajawal', sans-serif; color: #D4AF37; margin-top: 10px; font-size: 14px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; }
          .content { padding: 40px; }
          .section { margin-bottom: 30px; position: relative; }
          .section-title { font-family: 'Playfair Display', 'Cairo', serif; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px; margin-bottom: 15px; }
          .grid { display: flex; justify-content: space-between; flex-wrap: wrap; }
          .col { width: 48%; margin-bottom: 20px; }
          .label { font-size: 10px; color: #9CA3AF; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
          .value { font-size: 16px; font-weight: 600; color: #0A1128; margin-top: 4px; }
          .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; }
          .logo-placeholder { margin: 0 auto 20px; width: 60px; height: 60px; background: #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0A1128; font-weight: bold; font-size: 24px; }
          .property-card-small { display: flex; gap: 20px; align-items: flex-start; }
          .property-img-wrap { width: 220px; height: 140px; border-radius: 8px; overflow: hidden; flex-shrink: 0; border: 1px solid #E5E7EB; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
          .property-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
          .property-info { flex: 1; }
          .brief { font-size: 13px; color: #4B5563; font-style: italic; margin-top: 8px; line-height: 1.4; border-left: 2px solid #D4AF37; padding-left: 10px; }
        </style>
      </head>
      <body>
        <div class="dossier-card">
          <div class="header">
            <div class="logo-placeholder">V</div>
            <h1>Official Guest Dossier</h1>
            <p>The Vista Collection</p>
          </div>
          <div class="content">
            <div class="section">
              <h2 class="section-title">Booking Confirmation</h2>
              <div class="grid">
                <div class="col"><div class="label">Reference ID</div><div class="value" style="letter-spacing: 1px;">${formattedRef}</div></div>
                <div class="col"><div class="label">Status</div><div class="value" style="color: #10B981;">SECURE & CONFIRMED</div></div>
                <div class="col"><div class="label">Total Paid</div><div class="value">USD ${Number(booking.total_price).toLocaleString()}</div></div>
                <div class="col"><div class="label">Transaction ID</div><div class="value">${booking.paymob_transaction_id || "N/A"}</div></div>
              </div>
            </div>
            <div class="section">
              <h2 class="section-title">Property Access</h2>
              <div class="property-card-small">
                <div class="property-info">
                  <div class="label">Estate Name</div>
                  <div class="value" style="font-size: 20px; color: #0A1128;">${property?.title_en || property?.title || "Vista Signature Property"}</div>
                  <div class="brief">${propertyBrief}</div>
                  <div class="grid" style="margin-top: 20px;">
                    <div class="col" style="width: 50%;"><div class="label">Check In</div><div class="value">${new Date(booking.check_in).toLocaleDateString()}</div></div>
                    <div class="col" style="width: 50%;"><div class="label">Check Out</div><div class="value">${new Date(booking.check_out).toLocaleDateString()}</div></div>
                  </div>
                </div>
                <div class="property-img-wrap">
                  <img src="${propertyImg}" alt="Property view">
                </div>
              </div>
            </div>
            <div class="section">
              <h2 class="section-title">Guest Profile</h2>
              <div class="grid">
                <div class="col"><div class="label">Primary Guest</div><div class="value">${booking.guest_name}</div></div>
                <div class="col"><div class="label">Encrypted Contact</div><div class="value">${booking.guest_email}</div></div>
                <div class="col"><div class="label">Travel Party</div><div class="value">${booking.adults} Adults, ${booking.children} Children</div></div>
              </div>
            </div>
          </div>
          <div class="footer">
            This dossier was securely generated by The Vista Booking Engine.<br/>
            Your reference ID: <strong>${formattedRef}</strong>
          </div>
        </div>
      </body>
      </html>
    `;

    const options = await getOptions();
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setContent(htmlDossier, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const pdfBlob = new Blob([Buffer.from(pdfBuffer)], { type: 'application/pdf' });
    formData.append('dossier', pdfBlob, `Vista_Dossier_${formattedRef}.pdf`);
    console.log('[N8N DOSSIER] PDF generated successfully.');
  } catch (pdfError: any) {
    console.warn('[N8N DOSSIER] PDF generation failed (non-blocking):', pdfError.message);
    if (browser) { try { await browser.close(); } catch (_) {} }
  }

    // --- STEP 2: Fire the n8n notification (email + WhatsApp) ---
  console.log("[N8N] Transmitting production handshake...");
  try {
    formData.append('status', 'SUCCESS'); // <-- THIS WAS MISSING
    
    const rawName = booking.guest_name || "";
    const lowerName = rawName.trim().toLowerCase();
    const isAwkwardName = !lowerName || lowerName === "user" || lowerName === "guest" || lowerName.includes("user:user");
    const gName = isAwkwardName ? (booking.guest_email?.split('@')[0] || "Vista Guest") : rawName;
    
    formData.append('guestName', gName);
    formData.append('guestEmail', booking.guest_email);
    
    // 1. CLEAN PHONES: UltraMsg requires country code but NO '+' sign
    const cleanPhone = (p: string) => {
      if (!p) return "";
      return p.toString().replace(/\D/g, '');
    };

    const gPhone = cleanPhone(booking.guest_phone || "");
    const oPhone = cleanPhone(prop?.owner_phone || "201145551163");

    formData.append('guestPhone', gPhone);
    formData.append('phone', gPhone); 
    formData.append('phoneNumber', gPhone);
    formData.append('propertyName', prop?.title_en || prop?.title || "Vista Property");
    
    const formattedAmount = `USD ${Number(booking.total_price).toLocaleString()}`;
    formData.append('amount', formattedAmount);

    const waMsg = `Welcome to The Vista, ${gName}! 🥂 Your luxury dossier for ${prop?.title_en || 'your property'} (Ref: ${formattedRef}) has just landed in your inbox. We look forward to your arrival.`;
    
    // 2. REDUNDANT KEYS: Match the n8n JSON body mapping exactly
    formData.append('waMsg', waMsg); 
    formData.append('whatsAppMessage', waMsg);

    // UltraMsg safe-string: Matching the exact structure of the Failure message that successfully delivered
    const ownerNote = `✅ BOOKING SECURED\n\nGuest: ${gName}\nProperty: ${prop?.title_en || 'Vista Property'}\nAmount: ${formattedAmount}\nRef: ${formattedRef}\n\nDossier dispatched successfully.`;
    
    formData.append('ownerNotification', ownerNote);
    formData.append('ownerPhone', oPhone);
    formData.append('ownerEmail', prop?.owner_email || "sherif.seif@globevistahub.com");

    const response = await fetch(finalUrl, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const respText = await response.text();
      console.log("✅ [N8N DEBUG] HANDSHAKE SUCCESS:", respText);
    } else {
      console.error("❌ [N8N DEBUG] HANDSHAKE REJECTED by n8n. Status:", response.status);
      const errText = await response.text();
      console.error("📄 [N8N DEBUG] REJECTION REASON:", errText);
    }
  } catch (error: any) {
    console.error("[N8N FATAL ERROR] Handshake failed to reach network:", error.message);
  }
};

/**
 * Fires the N8N Webhook for Failed/Interrupted payments.
 * Matches the "PAYMENT INTERRUPTED" format requested.
 */
export const triggerN8NRecovery = async (booking: any, property: any) => {
  const url = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!url) return;

  const prop = Array.isArray(property) ? property[0] : property;
  const formattedRef = (booking.booking_reference || booking.id).toString();
  const rawName = booking.guest_name || "";
  const lowerName = rawName.trim().toLowerCase();
  const isAwkwardName = !lowerName || lowerName === "user" || lowerName === "guest" || lowerName.includes("user:user");
  const gName = isAwkwardName ? (booking.guest_email?.split('@')[0] || "Vista Guest") : rawName;

  const cleanPhone = (p: string) => (p ? p.toString().replace(/\D/g, '') : "");
  const oPhone = cleanPhone(prop?.owner_phone || "201145551163");

  const formData = new FormData();
  formData.append('status', 'FAILURE');
  formData.append('bookingRef', formattedRef);
  formData.append('guestName', gName);
  formData.append('guestEmail', booking.guest_email);
  formData.append('propertyName', prop?.title_en || prop?.title || "Vista Property");
  formData.append('amount', `USD ${Number(booking.total_price).toLocaleString()}`);
  formData.append('checkIn', new Date(booking.check_in).toLocaleDateString());
  formData.append('checkOut', new Date(booking.check_out).toLocaleDateString());

  const recoveryNote = `⚠️ PAYMENT INTERRUPTED

[Owner Alert Details]
Guest: ${gName}
Email: ${booking.guest_email}
Property: ${prop?.title_en || prop?.title}
Amount: USD ${Number(booking.total_price).toLocaleString()}
Ref: ${formattedRef}

----------------
[Guest Follow-up Draft]
Hi ${gName},

We noticed you had an issue completing your booking for ${prop?.title_en || 'the property'}. 

Please let our Concierge know if we can assist you with finalizing your reservation.`;

  formData.append('ownerNotification', recoveryNote);
  formData.append('waMsg', recoveryNote);
  formData.append('ownerPhone', oPhone);
  formData.append('ownerEmail', "support@globevistahub.com");

  let finalUrl = url;

  try {
    const response = await fetch(finalUrl, { method: "POST", body: formData });
    if (response.ok) {
      console.log("✅ [N8N RECOVERY DEBUG] ALERT SUCCESS");
    } else {
      console.error("❌ [N8N RECOVERY DEBUG] ALERT REJECTED. Status:", response.status);
    }
  } catch (e: any) {
    console.error("❌ [N8N RECOVERY DEBUG] FATAL:", e.message);
  }
};
