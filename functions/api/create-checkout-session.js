export async function onRequestPost(context) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
      "Access-Control-Max-Age": "86400",
    };
  
    try {
      let body;
      try {
        body = await context.request.json();
      } catch {
        return new Response(JSON.stringify({ error: "Corps de la requête invalide" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
  
      const { items } = body;
  
      if (!items || items.length === 0) {
        return new Response(JSON.stringify({ error: "Le panier est vide" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
  
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name || item.title || "Produit sans nom",
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round((item.price || 0) * 100),
        },
        quantity: item.quantity || 1,
      }));
  
      const formData = new URLSearchParams();
      formData.append("mode", "payment");
  
      const origin = context.request.headers.get("Origin") || "https://nexora-752.pages.dev";
      formData.append("success_url", `${origin}/success`);
      formData.append("cancel_url", `${origin}/panier`);
  
      lineItems.forEach((item, index) => {
        formData.append(`line_items[${index}][price_data][currency]`, item.price_data.currency);
        formData.append(`line_items[${index}][price_data][product_data][name]`, item.price_data.product_data.name);
        if (item.price_data.product_data.images.length > 0) {
          formData.append(`line_items[${index}][price_data][product_data][images][0]`, item.price_data.product_data.images[0]);
        }
        formData.append(`line_items[${index}][price_data][unit_amount]`, item.price_data.unit_amount.toString());
        formData.append(`line_items[${index}][quantity]`, item.quantity.toString());
      });
  
      if (!context.env.STRIPE_SECRET_KEY) {
        return new Response(JSON.stringify({ error: "La clé STRIPE_SECRET_KEY est manquante dans Cloudflare Pages" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
  
      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${context.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
  
      const session = await response.json();
  
      if (session.error) {
        return new Response(JSON.stringify({ error: session.error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify({ url: session.url }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
  
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Erreur interne du serveur" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
  
  export async function onRequestOptions() {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
        "Access-Control-Max-Age": "86400",
      },
    });
  }