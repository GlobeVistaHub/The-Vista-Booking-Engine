import crypto from "crypto";

const PAYMOB_BASE_URL = "https://accept.paymob.com/api";

export interface PaymobOrderItems {
  name: string;
  amount_cents: number;
  description: string;
  quantity: number;
}

export interface BillingData {
  apartment: string;
  email: string;
  floor: string;
  first_name: string;
  street: string;
  building: string;
  phone_number: string;
  shipping_method: string;
  postal_code: string;
  city: string;
  country: string;
  last_name: string;
  state: string;
}

export class PaymobService {
  /**
   * Step 1: Authentication
   * @returns auth_token
   */
  static async authenticate(): Promise<string> {
    const apiKey = process.env.PAYMOB_API_KEY;
    if (!apiKey) throw new Error("PAYMOB_API_KEY is completely missing from the server environment.");

    const res = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Paymob Auth Rejection:", data);
      throw new Error(`Paymob Auth Failed: ${data.message || data.detail || JSON.stringify(data)}`);
    }
    return data.token;
  }

  /**
   * Step 2: Order Registration
   */
  static async createOrder(authToken: string, amountCents: number, items: PaymobOrderItems[]): Promise<number> {
    const res = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountCents,
        currency: "EGP",
        items: items,
      }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Paymob Order Rejection:", data);
      throw new Error(`Paymob Order Creation Failed: ${data.message || data.detail || JSON.stringify(data)}`);
    }
    return data.id;
  }

  /**
   * Step 3: Payment Key Generation
   */
  static async getPaymentKey(
    authToken: string, 
    orderId: number, 
    amountCents: number, 
    billingData: BillingData,
    redirectionUrl: string
  ): Promise<string> {
    const integrationId = process.env.PAYMOB_INTEGRATION_ID;
    if (!integrationId) throw new Error("PAYMOB_INTEGRATION_ID is missing from the server environment.");

    const res = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: billingData,
        currency: "EGP",
        integration_id: integrationId,
        lock_order_when_paid: "true",
        redirection_url: redirectionUrl,
        success_url: redirectionUrl,
        failure_url: redirectionUrl.replace("success=true", "success=false")
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Paymob Payment Key Rejection:", data);
      throw new Error(`Paymob Payment Key Failed: ${data.message || data.detail || JSON.stringify(data)}`);
    }
    return data.token;
  }

  /**
   * HMAC Verification for webhook security
   */
  static verifyHmac(payload: string, signature: string): boolean {
    const secret = process.env.PAYMOB_HMAC_SECRET || "";
    const hmac = crypto.createHmac("sha512", secret);
    const hash = hmac.update(payload).digest("hex");
    return hash === signature;
  }

  /**
   * Convenience method to create a full session
   */
  static async createSession(amountCents: number, guestEmail: string, guestName: string, redirectionUrl: string): Promise<string> {
    const token = await this.authenticate();
    const orderId = await this.createOrder(token, amountCents, [
      { name: "Luxury Villa Booking", amount_cents: amountCents, description: "Booking at The Vista", quantity: 1 }
    ]);

    // Mock billing data (Paymob requires specific fields)
    const billingData: BillingData = {
      apartment: "NA",
      email: guestEmail,
      floor: "NA",
      first_name: guestName.split(" ")[0] || "Guest",
      street: "NA",
      building: "NA",
      phone_number: "+201000000000",
      shipping_method: "PKG",
      postal_code: "NA",
      city: "Cairo",
      country: "EG",
      last_name: guestName.split(" ")[1] || "Visitor",
      state: "Cairo"
    };

    return await this.getPaymentKey(token, orderId, amountCents, billingData, redirectionUrl);
  }
}
