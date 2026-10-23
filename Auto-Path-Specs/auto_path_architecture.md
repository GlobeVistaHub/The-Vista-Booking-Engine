# Auto-Bath: Technical & Strategic Architecture

To dominate the Melbourne luxury auto detailing market, we cannot build randomly. Every page, integration, and automation must serve a specific business purpose: maximizing trust and minimizing booking friction.

Here is the concrete skeleton and backbone of the Auto-Bath ecosystem.

## 1. The Sitemap (Core Pages)
A streamlined, high-converting structure. We do not need 20 confusing pages; we need 5 highly targeted funnels.
1. **Home (The Hook):** The 3D interactive car, immediate value proposition, and primary "Book Now" CTA.
2. **Services & Pricing:** Transparent, tiered packages (e.g., Bronze, Silver, Gold). Solves the "what am I paying for?" problem.
3. **The Booking Engine (App Flow):** A step-by-step, app-like booking flow (Select Service -> Select Date -> Pay Deposit). Not a generic contact form.
4. **The Vault (Portfolio):** High-resolution Before & After sliders proving the quality of work.
5. **Trust & Policies (FAQ/Contact):** Clear guarantees, insurance info, and contact details to eliminate customer anxiety.

## 2. The Technical Backbone (Skeleton)
*   **Frontend:** **Next.js (React)**. This guarantees lightning-fast load times, flawless SEO, and app-like routing. 
*   **Styling & Animation:** **TailwindCSS** + **Framer Motion** (for the glassmorphism and smooth liquid transitions).
*   **3D Engine:** **React Three Fiber**. This connects the 3D models directly to our React interface.
*   **Database / Backend:** **Supabase (PostgreSQL)**. To securely store customer data, booking histories, and lead information.

## 3. End-to-End Integrations
*   **Payment Gateway:** **Stripe**. Customers can seamlessly pay a $100 deposit to secure their time slot, drastically reducing no-shows.
*   **Scheduling:** **Google Calendar API** (or Cal.com). Real-time availability sync so double-bookings are mathematically impossible.
*   **Communications:** **Resend** (Emails) & **Twilio** (SMS text messages).

## 4. The Automation Ecosystem (Dossiers)
We will build triggers into the database so that manual admin work is eliminated:
*   **Trigger 1 (Booking Confirmed):** Automated SMS and beautifully formatted PDF Dossier sent via email: *"Preparing for your Auto-Bath Detail"* (explaining where to park, how long it takes, what to expect).
*   **Trigger 2 (24 Hours Before):** Automated SMS reminder.
*   **Trigger 3 (Post-Service):** Automated email asking for a Google Review while the customer is still excited about their shiny car.
*   **Trigger 4 (6-Month Retention):** Automated email/SMS sent exactly 6 months later reminding them to book a Ceramic Coating maintenance wash.

## 5. The Scalable AI Chatbot
We will build a custom internal API route connected to an LLM (like OpenAI/Claude). 
*   **Phase 1 (Text):** We train the bot *only* on Auto-Bath's pricing, policies, and calendar availability. It sits in the corner of the site and answers questions like *"How much for a Porsche 911 ceramic coat?"* and guides them to the booking page.
*   **Phase 2 (Voice):** Because the AI logic is hosted on our backend, we can easily plug that exact same "brain" into a voice agent API (like Vapi.ai) later. This means the bot can eventually answer live phone calls, speak to the customer, and book appointments directly into the calendar.

## 6. Sourcing the 3D Interactive Models
We **do not** model the cars from scratch (that takes months and costs thousands). 
*   **The Source:** We purchase hyper-realistic, game-optimized `.gltf` or `.glb` models from professional 3D marketplaces like **Sketchfab**, **TurboSquid**, or **CGTrader** (usually between $30 to $80).
*   **The Implementation:** We run the model through a compression script (`gltf-pipeline`) to reduce the file size from 50MB down to 3MB so the website loads instantly. We then strip the brand badges (to avoid copyright issues) and apply our own custom reflective digital shaders (Cyan and Gold) inside React to make it look like a futuristic hologram or a luxury showroom.
