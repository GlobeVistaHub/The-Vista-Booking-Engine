# GoodBrains.pro: Client Handover & Infrastructure Protocol

*This document outlines the standard operating procedure for transferring digital infrastructure, code ownership, and billing responsibilities to the end-client. This protocol is designed to ensure zero downtime, absolute security, and a seamless transition of ownership.*

---

## 1. The Development Phase (Zero Client Cost)
During the construction phase of the booking engine, the client is **never** billed for infrastructure. 
Our engineering team builds and tests the entire architecture (Frontend, Supabase Database, Stripe Checkout) using isolated Development Accounts. 

**Security Protocol:** All API keys and sensitive credentials are stored locally on our development machines in a secure `.env.local` file. This file is **strictly blocked** from being uploaded to GitHub, ensuring that development keys are never exposed to the public.

---

## 2. The Final Handover Checklist
When the project is 100% complete and approved for public launch, the client is required to complete a simple 15-minute onboarding checklist to establish their own financial and data infrastructure.

The client must create accounts with the following providers using their own **Company Email, Business Number (e.g., ABN), and Corporate Credit Card**:
1. **Stripe** (For payment processing)
2. **Supabase** (For database and CRM hosting)
3. **Vercel** (For global edge network hosting)
4. *(Optional)* **Mapbox / Twilio** (For specific API integrations like maps or SMS)

Once created, the client will securely send the generated **"API Keys"** back to our engineering team.

---

## 3. The Infrastructure Switch (Going Live)
We do not need to rewrite any code to hand over the project. 

Our team will take the client's new API keys and inject them directly into the **Production Environment Variables** within their Vercel Hosting Dashboard. 

**The Result:** 
Instantly, the live web application disconnects from our development environment and connects entirely to the client's infrastructure. 
- All booking revenue routes directly to the client's Stripe bank account.
- All database hosting costs are billed directly to the client's Supabase account.
- Our agency is completely detached from the client's financial liability.

---

## 4. Source Code Ownership (GitHub)
The client does not just receive a website; they receive the raw architectural blueprints. 
Vercel handles the "Hosting", but **GitHub** houses the actual Source Code.

To legally and securely transfer ownership of the code:
1. The client creates a free GitHub account.
2. Our engineering team clicks **"Transfer Ownership"** on the master GitHub repository, pointing it to the client's username.
3. The codebase instantly transfers to the client's account. **The client is now the sole legal owner of the intellectual property.**

---

## 5. Ongoing Maintenance & Collaboration
We understand that clients will need future updates, bug fixes, and feature expansions. We manage this without ever asking for the client's passwords.

**The Collaboration Protocol:**
1. Now that the client owns the GitHub repository, they navigate to their GitHub settings and click **"Add Collaborator"**.
2. They input our GoodBrains.pro engineering username.
3. Our team receives an invitation granting us "Write Access."

**Why this is the industry standard:**
Our engineers can continue to push code updates, deploy new features to Vercel, and maintain the system using *our own* logins. We never see the client's passwords, we never own their code, but we retain the exact level of access needed to support their business indefinitely.
