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
  private static apiKey = process.env.PAYMOB_API_KEY!;
  private static hmacSecret = process.env.PAYMOB_HMAC_SECRET!;
  private static integrationId = process.env.PAYMOB_INTEGRATION_ID!;

  /**
   * Step 1: Authentication
   * @returns auth_token
   */
  static async authenticate(): Promise<string> {
    const res = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: this.apiKey }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Paymob Auth Failed");
    return data.token;
  }

  /**
   * Step 2: Order Registration
   */
  static async createOrder(authToken: string, amountCents: number, items: PaymobOrderItems[], merchantOrderId?: string | number): Promise<number> {
    const res = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountCents,
        currency: "EGP",
        items: items,
        merchant_order_id: merchantOrderId
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Paymob Order Creation Failed");
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
        integration_id: this.integrationId,
        lock_order_when_paid: "true",
        redirection_url: redirectionUrl,
        success_url: redirectionUrl,
        failure_url: redirectionUrl.replace("success=true", "success=false")
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Paymob Payment Key Failed");
    return data.token;
  }

  /**
   * HMAC Verification for webhook security
   */
  static verifyHmac(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac("sha512", this.hmacSecret);
    const hash = hmac.update(payload).digest("hex");
    return hash === signature;
  }

  /**
   * Convenience method to create a full session
   */
  static async createSession(amountCents: number, guestEmail: string, guestName: string, redirectionUrl: string, merchantOrderId?: string | number): Promise<string> {
    const token = await this.authenticate();
    const orderId = await this.createOrder(token, amountCents, [
      { name: "Luxury Villa Booking", amount_cents: amountCents, description: "Booking at The Vista", quantity: 1 }
    ], merchantOrderId);

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
