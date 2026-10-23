# Auto-Bath: Technical Specs, Design Tokens & Commercial Valuation

To justify premium pricing and absolute market dominance, we must document exactly *why* this build is technologically superior to every competitor in Melbourne. This document serves as our strict engineering guideline and your commercial valuation sheet.

---

## 1. Design System & Tokens (Zero Randomness)
We are implementing a strict "Cyber-Luxury" design system. No stray colors, no generic paddings.

*   **Typography Tokens:**
    *   `font-heading`: `'Syncopate', sans-serif` (Wide, luxurious, used for massive H1/H2).
    *   `font-body`: `'Inter', sans-serif` (Hyper-legible, Apple-standard UI font).
*   **Color Tokens:**
    *   `color-bg-base`: `#050505` (Vantablack / True Dark).
    *   `color-bg-surface`: `#111216` (Elevated dark cards).
    *   `color-accent-primary`: `#FF6600` (Cyber Orange - used for primary \"Book Now\" buttons and aggressive calls to action).
    *   `color-accent-secondary`: `#00C2D4` (Electric Cyan - used for subtle technological hover states, the dynamic scroll line, and \"water\" motifs).
    *   `color-accent-secondary`: `#FFD700` (Luxury Gold - used for premium package highlights).
    *   `color-text-primary`: `#FFFFFF`
    *   `color-text-muted`: `#8A8F98` (Liquid Silver).
*   **UI Components:**
    *   `glass-panel`: `backdrop-filter: blur(24px); background: rgba(17, 18, 22, 0.6); border: 1px solid rgba(255, 255, 255, 0.05);`

---

## 2. Advanced Integrations (Map & Payments)

### Interactive 3D Map (Mapbox GL JS)
*   **Placement:** Placed at the bottom of the Home Page and explicitly on the Contact/Booking page.
*   **Technical Implementation:** Instead of embedding a generic, ugly Google Maps `<iframe>` (which looks cheap), we use **Mapbox GL JS**. We will inject a custom, dark-mode 3D map styled to match our exact Cyber-Luxury color tokens. It will feature a glowing cyan pulse radiating from the Melbourne workshop location (or service radius). 

### Payment Gateway Architecture (Stripe)
*   **Implementation:** We integrate `Stripe Elements` directly into the Next.js booking flow. 
*   **Security:** Fully PCI-compliant. Customer credit card data never touches our server; it is tokenized by Stripe.
*   **Business Logic:** When a user books a $1,500 ceramic coat, Stripe holds a **$100 non-refundable deposit** immediately via Apple Pay / Google Pay / Card. This guarantees the calendar slot and eliminates time-wasting no-shows.

---

## 3. Technical Valuation: Auto-Bath vs. The Market

Why is this build worth 5x more than what a local Melbourne agency provides?

| Feature | The Competitors (WordPress) | Auto-Bath (Next.js / React) | Commercial Impact |
| :--- | :--- | :--- | :--- |
| **Architecture** | PHP / Monolithic. Relies on heavy SQL queries for every page load. | React / Headless. Server-Side Rendered (SSR) and Edge-cached. | **Instant Load Times.** Pages load in milliseconds, drastically reducing bounce rates and capturing impatient luxury clients. |
| **Visual Tech** | Heavy, compressed JPGs and basic CSS hover effects. | WebGL (`react-three-fiber`), Framer Motion liquid transitions. | **Trust & Authority.** The user physically interacts with a 3D car to select packages, proving immediate technical superiority. |
| **Security** | High risk. Relies on 15+ third-party plugins (WooCommerce, Bookly) prone to hacks. | Zero-trust. No plugins. Secure serverless functions handling the Stripe and Supabase APIs. | **Enterprise-grade safety.** Luxury clients' data is never compromised. |
| **Maintenance** | Constant updates required; plugins break each other frequently. | Immutable build. Code is locked in and highly stable. | **Zero Downtime.** The site never "breaks" because an author updated a plugin. |

### Melbourne Market Valuation

*   **Standard Local Agency WP Build:** $2,500 - $5,000 AUD. (Generic template, clunky booking, slow load times).
*   **The Auto-Bath Custom Application:** **$15,000 - $25,000+ AUD**. 
    *   *Why?* It is not a "website." It is a bespoke web application with a proprietary 3D product configurator, an automated CRM dossier system, and enterprise-grade security. It acts as a 24/7 digital sales team that actively converts $2,000+ detailing packages through interactive trust-building.
