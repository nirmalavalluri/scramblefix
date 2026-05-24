/**
 * Cloudflare Pages Function — GET /api/verify-session?session_id=xxx
 *
 * Verifies a Stripe checkout session and returns Pro status data.
 * Called from /success page after Stripe redirects back.
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY — sk_live_xxx
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  const url       = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

  if (!sessionId) {
    return Response.json({ error: 'session_id is required' }, { status: 400, headers: corsHeaders });
  }

  try {
    const secretKey = env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500, headers: corsHeaders });
    }

    // Fetch session from Stripe
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=subscription&expand[]=customer`,
      {
        headers: { 'Authorization': `Bearer ${secretKey}` },
      }
    );

    const session = await stripeRes.json();

    if (!stripeRes.ok || session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400, headers: corsHeaders });
    }

    // Calculate expiry from subscription
    const sub     = session.subscription;
    const expires = sub?.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // fallback: 30 days

    const responseData = {
      pro:            true,
      email:          session.customer_details?.email || session.customer?.email || '',
      customerId:     session.customer?.id || session.customer,
      subscriptionId: sub?.id || null,
      plan:           sub?.items?.data?.[0]?.price?.recurring?.interval || 'month',
      expires,
      sessionId,
    };

    return Response.json(responseData, { headers: corsHeaders });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
