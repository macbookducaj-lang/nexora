import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = publishableKey 
  ? loadStripe(publishableKey) 
  : null;

export async function openStripeCheckout(items: any[]) {
  try {
    // On appelle notre fonction Cloudflare locale toute propre
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (data.url) {
      // Si la fonction nous renvoie l'URL Stripe, on redirige l'utilisateur dessus
      window.location.href = data.url;
    } else {
      alert("Erreur lors de la création de la session : " + (data.error || "Inconnue"));
    }
  } catch (error) {
    console.error("Erreur Stripe:", error);
    alert("Impossible de joindre le serveur de paiement.");
  }
}
