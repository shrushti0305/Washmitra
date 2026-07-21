// Real Razorpay Checkout integration. Requires the server to have
// RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET set (see .env.example), and the
// client needs VITE_RAZORPAY_KEY_ID (public key, safe to expose).

declare global {
  interface Window {
    Razorpay: any;
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script.'));
    document.body.appendChild(script);
  });
  return scriptLoadPromise;
}

export interface RazorpayPaymentResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface OpenCheckoutArgs {
  amount: number; // in rupees
  purpose: string; // e.g. 'PLATFORM_FEE', 'TRAINING_ENROLLMENT', 'BOOKING_INVOICE'
  name: string;
  email?: string;
  contact?: string;
  onSuccess: (result: RazorpayPaymentResult) => void;
  onFailure: (reason: string) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout({
  amount,
  purpose,
  name,
  email,
  contact,
  onSuccess,
  onFailure,
  onDismiss,
}: OpenCheckoutArgs) {
  try {
    await loadRazorpayScript();

    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, purpose }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}));
      onFailure(err.error || 'Could not start payment. Please try again.');
      return;
    }

    const order = await orderRes.json();
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!keyId) {
      onFailure('Payment gateway is not configured (missing VITE_RAZORPAY_KEY_ID).');
      return;
    }

    const rzp = new window.Razorpay({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'WASH Mitra',
      description: purpose,
      prefill: { name, email, contact },
      theme: { color: '#F16622' },
      handler: async (response: RazorpayPaymentResult) => {
        try {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            onSuccess(response);
          } else {
            onFailure('Payment could not be verified. If money was deducted, contact support.');
          }
        } catch (err) {
          onFailure('Payment verification request failed. If money was deducted, contact support.');
        }
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
        },
      },
    });

    rzp.on('payment.failed', (response: any) => {
      onFailure(response.error?.description || 'Payment failed.');
    });

    rzp.open();
  } catch (err: any) {
    onFailure(err.message || 'Could not start payment. Please try again.');
  }
}
