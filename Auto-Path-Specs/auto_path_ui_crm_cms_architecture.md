# Auto-Bath: UI/UX, CMS, CRM & Panel Architecture

This document finalizes the operational ecosystem of the Auto-Bath application. It strictly defines how the user interfaces (UI/UX), the Content Management System (CMS), and the Customer Relationship Management (CRM) automations blend together without compromising the Headless Next.js security model.

---

## 1. Unified Interface Hierarchy (UI/UX)

The user experience is mathematically designed to eliminate friction and drive the user toward the Stripe payment gateway.

### The Design Token System (Strict Enforcement)
To maintain the "Cyber-Luxury" aesthetic, these exact tokens are locked in across all panels:
| Element | Token Value | Purpose |
| :--- | :--- | :--- |
| **Primary Background** | `#050505` (Vantablack) | Creates infinite depth and contrast for 3D elements. |
| **Primary Action** | `#FF6600` (Cyber Orange) | Used *only* for the primary "Book Now" buttons, checkout logic, and aggressive calls to action. |
| **Secondary Tech** | `#00C2D4` (Electric Cyan) | Used for the dynamic scroll line, subtle 3D Mapbox pulses, and interactive "water" hover effects. |
| **Premium Accent** | `#FFD700` (Luxury Gold) | Used to highlight top-tier services (e.g., Ceramic Coating). |
| **Typography: Headings**| `Syncopate` (Google Font) | Wide, aggressive, futuristic font for massive authority. |
| **Typography: Body** | `Inter` (Google Font) | Hyper-legible Apple-standard font for booking forms. |
| **Surface Cards** | `backdrop-filter: blur(24px)` | Frosted glassmorphism for all pricing and service cards. |

### The 5 WebGL / Interactive Experiences
This application is defined by 5 distinct interactive layers that differentiate it from flat CMS websites:
1. **The 3D Hero Car (`react-three-fiber`):** A hyper-realistic, spinning 3D sports car. Users can physically interact with it to preview detailing packages (e.g., clicking the hood to see the ceramic coating reflection).
2. **The 3D Mapbox Environment:** A custom, dark-mode 3D rendering of the Melbourne local area with a glowing Cyber Orange pulse radiating from the shop's service radius, replacing the standard Google Map iframe.
3. **The Hydrophobic Liquid Hover (WebGL):** When hovering over the Before & After gallery photos, a WebGL distortion shader ripples the image like water, psychologically mimicking the hydrophobic effect of a $2,000 Ceramic Coating.
4. **The Glowing "Auto-Bath":** A dynamic, neon cyan line that physically draws itself down the center of the screen as the user scrolls, mathematically guiding their eye toward the Stripe checkout button.
5. **Floating Glassmorphism:** Pricing tiers and booking menus are not solid boxes; they are frosted glass panels that float above the 3D background with subtle parallax movement.

### The Navigation Hierarchy
1. **The Hero (Priority 1):** Interactive 3D WebGL Car + "Book Now" CTA.
2. **The Services (Priority 2):** Transparent Pricing Grid.
3. **The Vault (Priority 3):** Before/After Gallery (Social Proof).
4. **The Footprint (Priority 4):** Mapbox 3D Location + Trust/FAQ.

---

## 2. The Custom CMS (The Vault Manager)

Because we are utilizing a highly secure Headless architecture, we explicitly reject bloated third-party CMS platforms like WordPress or Contentful. The business owner controls the site directly through the **Admin Command Center**.

### How the Owner Updates the Website (Zero Code Required)
| Action | The Owner's Workflow | The Technical Execution (Backend) |
| :--- | :--- | :--- |
| **Uploading New Photos** | Owner opens the Admin Panel on their phone and clicks "Upload to Vault." | Next.js securely pushes the image to **Supabase Storage** and triggers an Edge Cache revalidation. The live site updates instantly. |
| **Updating Prices** | Owner changes a price in the Admin Dashboard. | The PostgreSQL `services` table is updated. The frontend instantly reflects the new pricing dynamically. |

---

## 3. The Panels Structure

There are exactly two authenticated panels built into the application.

### A. The Customer Portal (Minimalist)
*   **Access:** Passwordless Magic Link (via SMS or Email).
*   **Capabilities:** 
    *   View upcoming appointments (and dynamic countdown timer).
    *   Reschedule logic (disabled if within 48 hours of the appointment).
    *   View digital receipts and a personalized gallery of their own vehicle.

### B. The Admin Command Center (God-Mode)
*   **Access:** Multi-Factor Authentication (MFA) restricted.
*   **Capabilities:**
    *   **The Pipeline:** Kanban board showing all Stripe-cleared appointments.
    *   **The CMS Manager:** Upload to The Vault gallery.
    *   **Financials:** Live sync with the Stripe API showing monthly revenue.

---

## 4. The CRM & Automation Ecosystem

This is the automated nervous system of the business. It operates entirely in the background via Next.js Serverless API routes, ensuring the business owner never has to manually text or email a client.

| Trigger Event | Automated Action (Resend / Twilio) | Strategic Business Purpose |
| :--- | :--- | :--- |
| **T-0: Booking Confirmed** | SMS Confirmation + Email PDF Dossier ("How to prepare your car"). | Eliminates buyer's remorse and establishes immediate elite professionalism. |
| **T-24 Hours Prior** | SMS Reminder with Mapbox location link. | Mathematically reduces no-shows to near 0%. |
| **T+24 Hours Post-Job** | SMS Thank You + Direct Google Review Link. | Forces Google My Business local SEO domination. |
| **T+6 Months Post-Job** | SMS Upsell: "Time for your 6-Month Ceramic Maintenance Wash." | Generates automated recurring revenue (LTV) without manual sales effort. |

**Conclusion:** By blending the 3D Cyber-Luxury UI with a custom Supabase CMS and a serverless CRM, Auto-Bath operates not just as a website, but as a fully autonomous digital employee.
