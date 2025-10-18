import Razorpay from 'razorpay';
import crypto from 'crypto';

// Check if Razorpay credentials are available
const hasRazorpayCredentials = () => {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

// Initialize Razorpay instance only if credentials are available
let razorpay: Razorpay | null = null;

if (hasRazorpayCredentials()) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
} else {
  console.warn('Razorpay credentials not found. Payment functionality will be disabled.');
}

export interface CreateOrderOptions {
  amount: number; // Amount in paise (INR)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationOptions {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export class RazorpayService {
  /**
   * Create a new order for payment
   */
  static async createOrder(options: CreateOrderOptions) {
    if (!hasRazorpayCredentials() || !razorpay) {
      return {
        success: false,
        error: 'Razorpay credentials not configured. Please contact support.',
      };
    }

    try {
      const order = await razorpay.orders.create({
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: options.notes || {},
      });

      return {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
        },
      };
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }

  /**
   * Verify payment signature
   */
  static verifyPayment(options: PaymentVerificationOptions): boolean {
    if (!hasRazorpayCredentials()) {
      console.error('Razorpay credentials not configured for payment verification');
      return false;
    }

    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = options;
      
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpay_signature;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  /**
   * Fetch payment details
   */
  static async getPaymentDetails(paymentId: string) {
    if (!hasRazorpayCredentials() || !razorpay) {
      return {
        success: false,
        error: 'Razorpay credentials not configured. Please contact support.',
      };
    }

    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          created_at: payment.created_at,
        },
      };
    } catch (error) {
      console.error('Fetch payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment',
      };
    }
  }

  /**
   * Create order for membership card purchase
   */
  static async createMembershipOrder(cardTypeId: string, userId: string, amount: number) {
    return this.createOrder({
      amount: amount * 100, // Convert to paise
      receipt: `membership_${cardTypeId}_${userId}_${Date.now()}`,
      notes: {
        card_type_id: cardTypeId,
        user_id: userId,
        type: 'membership_card',
      },
    });
  }

  /**
   * Create order for cash lending subscription
   */
  static async createSubscriptionOrder(planId: string, userId: string, amount: number) {
    return this.createOrder({
      amount: amount * 100, // Convert to paise
      receipt: `subscription_${planId}_${userId}_${Date.now()}`,
      notes: {
        plan_id: planId,
        user_id: userId,
        type: 'cash_lending_subscription',
      },
    });
  }
}

export default razorpay;
