/**
 * Cloudflare Pages Function — POST /api/create-checkout
 *
 * Creates a Stripe Checkout session and returns the redirect URL.
 *
 * Environment variables (set in Cloudflare Pages dashboard):
 *   STRIPE_SECRET_KEY   — sk_live_xxx or sk_test_xxx
 *   BASE_URL            — https://scramblefix.io
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin':  env.BASE_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { priceId, email } = await request.json();

    if (!priceId) {
      return Response.json({ error: 'priceId is required' }, { status: 400, headers: corsHeaders });
    }

    const baseUrl   = env.BASE_URL || 'https://scramblefix.io';
    const secretKey = env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500, headers: corsHeaders });
    }

    // Create checkout session via Stripe REST API
    const params = new URLSearchParams({
      'payment_method_types[]':         'card',
      'line_items[0][price]':           priceId,
      'line_items[0][quantity]':        '1',
      'mode':                           'subscription',
      'success_url':                    `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url':                     `${baseUrl}/pricing?cancelled=true`,
      'allow_promotion_codes':          'true',
      'billing_address_collection':     'auto',
    });

    if (email) params.set('customer_email', email);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return Response.json({ error: session.error?.message || 'Stripe error' }, { status: 400, headers: corsHeaders });
    }

    return Response.json({ url: session.url }, { headers: corsHeaders });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
