/**
 * stripeConfig.js — Stripe plan definitions
 *
 * After creating products in your Stripe dashboard:
 * 1. Go to Stripe Dashboard → Products → Add product
 * 2. Create "ScrambleFix Pro Monthly" at $9/month (recurring)
 * 3. Create "ScrambleFix Pro Yearly" at $79/year (recurring)
 * 4. Copy the Price IDs (price_xxx) and paste below
 * 5. Add STRIPE_PUBLISHABLE_KEY to your .env.local
 */

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY';

export const PLANS = {
  free: {
    id:       'free',
    name:     'Free',
    price:    0,
    period:   'forever',
    priceId:  null,
    features: [
      { label: 'All 54 text tools',            included: true },
      { label: '270,000-word unscrambler',      included: true },
      { label: '3 AI operations per day',       included: true },
      { label: 'No signup required',            included: true },
      { label: 'Ad-free experience',            included: false },
      { label: 'Unlimited AI operations',       included: false },
      { label: 'Batch processing',              included: false },
      { label: 'API access',                    included: false },
      { label: 'Priority support',              included: false },
    ],
  },

  monthly: {
    id:               'monthly',
    name:             'Pro',
    price:            9,
    period:           'month',
    billingLabel:     '$9 / month',
    effectiveMonthly: 9,
    priceId:          'YOUR_STRIPE_MONTHLY_PRICE_ID', // ← paste here
    badge:            null,
    savings:          null,
    features: [
      { label: 'Everything in Free',            included: true },
      { label: 'Ad-free across all 60 tools',   included: true },
      { label: 'Unlimited AI operations',       included: true },
      { label: 'AI Grammar Fix',                included: true },
      { label: 'AI Rewrite & Paraphrase',       included: true },
      { label: 'AI Tone Change (6 tones)',      included: true },
      { label: 'Batch processing (soon)',        included: true },
      { label: 'API access (soon)',              included: true },
      { label: 'Priority support',              included: true },
    ],
  },

  yearly: {
    id:               'yearly',
    name:             'Pro',
    price:            79,
    period:           'year',
    billingLabel:     '$79 / year',
    effectiveMonthly: 6.58,
    priceId:          'YOUR_STRIPE_YEARLY_PRICE_ID', // ← paste here
    badge:            'Best value',
    savings:          'Save $29 · 2 months free',
    features: [
      { label: 'Everything in Free',            included: true },
      { label: 'Ad-free across all 60 tools',   included: true },
      { label: 'Unlimited AI operations',       included: true },
      { label: 'AI Grammar Fix',                included: true },
      { label: 'AI Rewrite & Paraphrase',       included: true },
      { label: 'AI Tone Change (6 tones)',      included: true },
      { label: 'Batch processing (soon)',        included: true },
      { label: 'API access (soon)',              included: true },
      { label: 'Priority support',              included: true },
    ],
  },
};

export const PRO_FEATURES_SUMMARY = [
  { icon: '♾️', title: 'Unlimited AI',        desc: 'No daily limits on any AI tool' },
  { icon: '🚫', title: 'Zero ads',            desc: 'Clean, distraction-free experience' },
  { icon: '⚡', title: 'Batch processing',    desc: 'Process thousands of lines at once' },
  { icon: '🔌', title: 'API access',          desc: 'Call ScrambleFix from your own apps' },
  { icon: '🎯', title: 'Priority support',    desc: 'Get help within 24 hours' },
  { icon: '🔒', title: 'Cancel anytime',      desc: 'No contracts, no lock-in' },
];
