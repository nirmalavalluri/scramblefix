/**
 * Cloudflare Pages Function — POST /api/customer-portal
 *
 * Creates a Stripe Customer Portal session so users can
 * manage their subscription, update payment method, or cancel.
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY — sk_live_xxx
 *   BASE_URL          — https://scramblefix.io
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' };

  try {
    const { customerId } = await request.json();
    if (!customerId) {
      return Response.json({ error: 'customerId is required' }, { status: 400, headers: corsHeaders });
    }

    const secretKey = env.STRIPE_SECRET_KEY;
    const baseUrl   = env.BASE_URL || 'https://scramblefix.io';

    const stripeRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer:    customerId,
        return_url:  `${baseUrl}/`,
      }).toString(),
    });

    const portal = await stripeRes.json();

    if (!stripeRes.ok) {
      return Response.json({ error: portal.error?.message || 'Portal error' }, { status: 400, headers: corsHeaders });
    }

    return Response.json({ url: portal.url }, { headers: corsHeaders });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
