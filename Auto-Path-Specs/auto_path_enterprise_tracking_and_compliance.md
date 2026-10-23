# Auto-Bath: Enterprise Tracking, Compliance & Advanced Logic

While UI, UX, and basic security are standard, this document outlines the "invisible" enterprise-grade systems that truly separate a $30,000 Next.js application from a generic local website. These systems protect the business legally, maximize advertising ROI, and introduce highly advanced revenue generation logic.

---

## 1. Marketing Attribution (Beating iOS Ad Blockers)

### The Threat
Apple’s iOS privacy updates and modern browser ad-blockers actively kill client-side tracking pixels (like the Facebook Pixel or Google Analytics tag). A business owner could spend $5,000 on Facebook ads, get 10 bookings, and the Facebook dashboard will show "0 Sales," breaking the advertising algorithm.

### The Auto-Bath Solution: Server-Side Tracking
*   **Implementation:** We implement the **Facebook Conversions API (CAPI)** and **Google Tag Manager (GTM) Server Container** directly into the Next.js API routes.
*   **The Result:** When a user pays a deposit, the Next.js server sends the conversion data *directly* to Facebook’s server, completely bypassing the user's ad-blocker. The business owner gets 100% accurate advertising ROI, allowing them to scale their ad budget with absolute mathematical certainty.

---

## 2. Legal & Data Compliance (Australia Market)

### The Threat
Collecting customer names, phone numbers, and processing $2,000+ payments makes the business a target for the **Australian Privacy Principles (APP)** under the Privacy Act 1988. Mishandling data can result in massive corporate fines.

### The Auto-Bath Solution: Privacy by Design
*   **Data Minimization:** We only store actionable data in Supabase. Credit card details are exclusively handled by Stripe's tokenized vaults; they never touch our database.
*   **Right to Erasure (Automated):** A user can click a single button in their Customer Portal to instantly purge their personal data (excluding legal tax receipts), ensuring immediate legal compliance.
*   **Booking Checkbox Protocol:** Hardcoded, mandatory consent checkboxes for SMS marketing (Twilio) prior to payment, protecting the owner from anti-spam (ACMA) violations.

---

## 3. SEO Protection: WCAG Accessibility for WebGL

### The Threat
3D elements (WebGL) are highly impressive but completely invisible to visually impaired users relying on screen readers. Google’s Lighthouse algorithm severely penalizes the SEO of websites that fail WCAG (Web Content Accessibility Guidelines). 

### The Auto-Bath Solution: Semantic Fallbacks
*   Behind the interactive React Three Fiber 3D canvas, we will inject a hidden layer of highly descriptive, semantic HTML (e.g., `aria-label="Interactive 3D model of a luxury sports car demonstrating our ceramic coating package"`). 
*   **The Result:** The site retains its jaw-dropping 3D visuals while scoring a flawless **100/100 on Google Accessibility**, protecting the site's #1 organic ranking.

---

## 4. Advanced Revenue Logic (Yield Management)

### The Threat
Most auto-detailers lose thousands of dollars during peak seasons because they have fixed pricing. 

### The Auto-Bath Solution: Dynamic Price Surging
*   We will program a "Surge Pricing" algorithm into the Next.js backend (similar to Uber or Airlines).
*   **How it Works:** If the Supabase database detects that the calendar is 85% fully booked for a given week, the API automatically raises the base prices of all services by 15% for any remaining slots.
*   **The Result:** The business automatically maximizes profit margins during high demand without the owner having to manually alter prices.

---

## 5. Competitor Sabotage Protection (WAF)

### The Threat
In highly competitive local markets, malicious competitors will use bots to "fake book" appointments, filling up the calendar and costing the business thousands of dollars in lost actual revenue.

### The Auto-Bath Solution: Edge Security
*   **Stripe Deposit Wall:** The primary defense is the mandatory $100 Stripe deposit. Bots do not hold credit cards.
*   **Vercel / Cloudflare WAF (Web Application Firewall):** We deploy Edge rate-limiting. If an IP address attempts to ping the booking calendar API more than 5 times in 60 seconds, they are permanently IP-banned at the Edge level before the request even reaches our database.

**Conclusion:** These 5 systems shift Auto-Bath from a standard booking platform into a legally secure, mathematically optimized, and impenetrable enterprise asset.
