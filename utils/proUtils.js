/**
 * proUtils.js — Pro subscription status management
 * Status is stored in localStorage after payment verification.
 * All functions are safe to call server-side (check for window first).
 */

const PRO_KEY = 'sf_pro_status';

/**
 * Get current Pro status from localStorage.
 * Returns null if not Pro or if subscription has expired.
 */
export function getProStatus() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRO_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Check expiry
    if (data.expires && new Date(data.expires) < new Date()) {
      localStorage.removeItem(PRO_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/** Returns true if the user has an active Pro subscription */
export function isPro() {
  return !!getProStatus();
}

/**
 * Store Pro status after successful payment verification.
 * @param {object} data — { email, customerId, subscriptionId, plan, expires }
 */
export function setProStatus(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRO_KEY, JSON.stringify({
    ...data,
    activatedAt: new Date().toISOString(),
  }));
}

/** Clear Pro status (on logout or manual reset) */
export function clearProStatus() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PRO_KEY);
}

/**
 * Verify a Stripe checkout session and store Pro status.
 * Called from the /success page after Stripe redirect.
 * @param {string} sessionId — from ?session_id= query param
 * @returns {Promise<{ok: boolean, email?: string, error?: string}>}
 */
export async function verifyAndActivatePro(sessionId) {
  try {
    const res  = await fetch(`/api/verify-session?session_id=${sessionId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Verification failed');
    setProStatus(data);
    return { ok: true, email: data.email };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Initiate a Stripe Checkout session for the selected plan.
 * @param {string} priceId — Stripe Price ID
 * @param {string} email   — optional prefill
 * @returns {Promise<void>} — redirects to Stripe
 */
export async function startCheckout(priceId, email = '') {
  try {
    const res  = await fetch('/api/create-checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ priceId, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Checkout failed');
    window.location.href = data.url;
  } catch (e) {
    alert(`Checkout error: ${e.message}`);
  }
}

/**
 * Open the Stripe Customer Portal for subscription management.
 * @param {string} customerId — from stored Pro status
 */
export async function openCustomerPortal(customerId) {
  try {
    const res  = await fetch('/api/customer-portal', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ customerId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    window.location.href = data.url;
  } catch (e) {
    alert(`Portal error: ${e.message}`);
  }
}
