# Auto-Bath: Security, Database & Interface Protocol

To ensure we do not drift during development, this document defines the strict boundaries for database architecture, enterprise-grade security, and the required user interfaces. This is the structural foundation of the Auto-Bath application.

---

## 1. Security & Authentication Architecture

We are building a "Zero-Trust" architecture. WordPress sites get hacked because their database is exposed through thousands of plugins. Our Next.js application will be impenetrable.

### Authentication (Supabase Auth)
*   **Customer Auth:** Passwordless Magic Links or Google/Apple OAuth. Luxury clients hate remembering passwords. We reduce friction by sending a secure one-time link to their email or phone.
*   **Admin Auth:** Strict Multi-Factor Authentication (MFA). Only authorized staff can access the Admin Dashboard.
*   **Session Management:** JSON Web Tokens (JWT) stored in HTTP-only secure cookies. JavaScript on the frontend cannot access these tokens, making XSS (Cross-Site Scripting) attacks impossible.

### API & Data Security
*   **Row Level Security (RLS):** Enabled on every PostgreSQL table. A customer can *only* query the database for their own bookings. Even if a hacker breaches the frontend, the database mathematically refuses to return data belonging to other users.
*   **Stripe Webhooks:** All payment confirmations happen server-to-server. The Next.js backend verifies the cryptographic signature from Stripe before updating the database, preventing any spoofed payment requests.

---

## 2. Database Design Skeleton (Supabase / PostgreSQL)

We will maintain a strict, relational database structure. No random tables.

*   **Table: `users`** (Managed by Supabase Auth)
    *   `id` (UUID, Primary Key)
    *   `role` (Enum: 'customer', 'admin')
    *   `phone_number`
*   **Table: `services`** (The detailing packages)
    *   `id` (UUID)
    *   `name` (e.g., "Gold Ceramic Coat")
    *   `base_price` (Integer, stored in cents)
    *   `duration_minutes` (Integer)
*   **Table: `bookings`** (The core transactional table)
    *   `id` (UUID)
    *   `user_id` (Foreign Key -> users.id)
    *   `service_id` (Foreign Key -> services.id)
    *   `scheduled_time` (TimestampTZ)
    *   `status` (Enum: 'pending', 'confirmed', 'completed', 'cancelled')
    *   `stripe_payment_intent_id` (String - for deposit tracking)

---

## 3. The Main Interfaces & Panels

To prevent scope creep, we are locking in exactly two authenticated interfaces.

### A. The Customer Portal (Minimalist & Empowering)
*   **Upcoming Appointments:** A sleek card showing their scheduled detail, a countdown, and a button to reschedule (up to 48 hours prior).
*   **Service History & Vault:** A gallery of their past services with high-res photos of their car (uploaded by the admin), serving as a digital receipt and brag-book.

### B. The Admin Dashboard (Command Center)
*   **The Pipeline:** A Kanban-style board (Pending -> In Progress -> Ready for Pickup).
*   **Calendar Override:** The ability to block out dates (e.g., holidays, equipment maintenance).
*   **Revenue Metrics:** A real-time sync with Stripe showing monthly deposit volume and projected revenue.

---

## 4. Debugging & Logging Protocol

When building complex WebGL and payment flows, we cannot rely on "console.log" randomness. 
*   **Error Tracking (Sentry):** We will integrate Sentry. If the 3D model fails to load on a specific older iPhone, or if a Stripe payment drops, Sentry will instantly capture the exact line of code that broke and send a silent alert to the admin. 
*   **Performance Analytics (Vercel):** Core Web Vitals (First Contentful Paint, Cumulative Layout Shift) will be monitored in real-time to ensure the 3D graphics never slow down the site.
