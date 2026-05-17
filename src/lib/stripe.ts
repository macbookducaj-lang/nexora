import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
export const stripePaymentLink =
  import.meta.env.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test';

export const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : null;

export function openStripeCheckout() {
  window.open(stripePaymentLink, '_blank');
}
