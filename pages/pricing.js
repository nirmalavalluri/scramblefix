import { useState } from 'react';
import Layout from '../components/Layout';
import { PLANS, PRO_FEATURES_SUMMARY } from '../utils/stripeConfig';
import { startCheckout, isPro, getProStatus, openCustomerPortal } from '../utils/proUtils';

const BASE = 'https://scramblefix.io';

const CHECK  = ({ ok }) => ok
  ? <span className="text-[#10b981] text-sm">✓</span>
  : <span className="text-[#374151] text-sm">–</span>;

function PlanCard({ plan, billing, isHighlighted, onSelect, loading }) {
  const monthlyPrice = billing === 'yearly' && plan.id === 'yearly'
    ? plan.effectiveMonthly.toFixed(2)
    : plan.price;

  const isYearlyPro = plan.id === 'yearly';
  const isMonthlyPro = plan.id === 'monthly';
  const isPro = isYearlyPro || isMonthlyPro;

  return (
    <div className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 ${
      isHighlighted
        ? 'border-[#7c3aed] bg-[#130820]'
        : 'border-[#1f2937] bg-[#111827]'
    }`}
      style={isHighlighted ? { boxShadow: '0 0 0 1px #7c3aed44, 0 20px 60px #7c3aed15' } : {}}>

      {/* Best value badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[0.65rem] font-bold px-3 py-1 rounded-full whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff' }}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name + price */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-1">{plan.name}</p>
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-extrabold text-[#f9fafb]"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            {plan.price === 0 ? 'Free' : `$${isPro && billing === 'yearly' && isYearlyPro ? monthlyPrice : plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-[#6b7280] text-sm mb-1">
              {billing === 'yearly' && isYearlyPro ? '/mo' : `/${plan.period}`}
            </span>
          )}
        </div>
        {plan.savings && billing === 'yearly' && isYearlyPro && (
          <p className="text-xs text-[#10b981] mt-1 font-semibold">{plan.savings}</p>
        )}
        {isYearlyPro && billing === 'yearly' && (
          <p className="text-xs text-[#6b7280] mt-0.5">Billed ${plan.price}/year</p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        disabled={loading || plan.price === 0}
        className={`w-full py-3 rounded-xl font-semibold text-sm mb-6 transition-all duration-200 ${
          plan.price === 0
            ? 'border border-[#1f2937] text-[#6b7280] cursor-default'
            : isHighlighted
            ? 'text-white hover:opacity-90'
            : 'bg-[#1f2937] text-[#f9fafb] hover:bg-[#2d3748]'
        }`}
        style={isPro && isHighlighted ? { background: 'linear-gradient(135deg,#7c3aed,#ec4899)' } : {}}>
        {loading ? 'Redirecting…' : plan.price === 0 ? 'Current plan' : `Get Pro ${billing === 'yearly' && isYearlyPro ? '(Yearly)' : '(Monthly)'}`}
      </button>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <CHECK ok={f.included} />
            <span className={`text-xs ${f.included ? 'text-[#d1d5db]' : 'text-[#4b5563]'}`}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState('yearly'); // 'monthly' | 'yearly'
  const [loading, setLoading] = useState(false);
  const [email,   setEmail]   = useState('');

  const proStatus   = typeof window !== 'undefined' ? getProStatus() : null;
  const userIsPro   = !!proStatus;

  const handleSelect = async (plan) => {
    if (!plan.priceId || plan.priceId.startsWith('YOUR_')) {
      alert('Stripe Price ID not configured yet. Add it to utils/stripeConfig.js');
      return;
    }
    setLoading(true);
    await startCheckout(plan.priceId, email);
    setLoading(false);
  };

  const activePlan = billing === 'yearly' ? PLANS.yearly : PLANS.monthly;

  return (
    <Layout
      title="ScrambleFix Pro — Pricing"
      description="Upgrade to ScrambleFix Pro for unlimited AI operations, zero ads and API access. $9/month or $79/year."
      canonical={`${BASE}/pricing`}>

      <div className="max-w-5xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-8 text-center">
          <span className="inline-block text-[0.65rem] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff' }}>
            ScrambleFix Pro
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f9fafb] tracking-tight"
            style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-2px' }}>
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-md mx-auto leading-relaxed">
            Unlock unlimited AI tools, remove all ads, and get API access.
            Cancel anytime — no contracts.
          </p>
        </div>

        {/* Already Pro */}
        {userIsPro && (
          <div className="mb-8 p-4 rounded-xl bg-[#0a1f0a] border border-[#10b981] text-center">
            <p className="text-sm font-semibold text-[#10b981]">✓ You're on ScrambleFix Pro</p>
            <p className="text-xs text-[#6b7280] mt-1">
              Subscribed as {proStatus.email} ·{' '}
              <button onClick={() => openCustomerPortal(proStatus.customerId)}
                className="text-[#3b82f6] hover:underline">
                Manage subscription →
              </button>
            </p>
          </div>
        )}

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-semibold ${billing === 'monthly' ? 'text-[#f9fafb]' : 'text-[#6b7280]'}`}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${billing === 'yearly' ? 'bg-[#7c3aed]' : 'bg-[#1f2937]'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${billing === 'yearly' ? 'left-6' : 'left-0.5'}`} />
          </button>
          <span className={`text-sm font-semibold ${billing === 'yearly' ? 'text-[#f9fafb]' : 'text-[#6b7280]'}`}>
            Yearly
            <span className="ml-1.5 text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full bg-[#10b981] text-white">Save 27%</span>
          </span>
        </div>

        {/* Email prefill (optional) */}
        <div className="max-w-sm mx-auto mb-8">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            className="w-full bg-[#111827] border border-[#1f2937] focus:border-[#7c3aed] rounded-xl px-4 py-2.5 text-sm text-[#f9fafb] placeholder-[#4b5563] outline-none transition-colors text-center" />
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          <PlanCard plan={PLANS.free}         billing={billing} isHighlighted={false} onSelect={handleSelect} loading={loading} />
          <PlanCard plan={activePlan}         billing={billing} isHighlighted={true}  onSelect={handleSelect} loading={loading} />
          {/* Enterprise placeholder */}
          <div className="rounded-2xl border border-dashed border-[#1f2937] bg-[#0d1117] p-6 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-3xl">🏢</span>
            <p className="text-sm font-bold text-[#f9fafb]" style={{ fontFamily:"'Syne',sans-serif" }}>Enterprise</p>
            <p className="text-xs text-[#6b7280] leading-relaxed">Team seats, custom AI, dedicated support, SLA.</p>
            <a href="mailto:hello@scramblefix.io"
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all">
              Contact us →
            </a>
          </div>
        </div>

        {/* Pro features grid */}
        <div className="mb-14">
          <h2 className="text-xl font-extrabold text-[#f9fafb] text-center mb-6"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            Everything in Pro
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRO_FEATURES_SUMMARY.map((f, i) => (
              <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                <span className="text-2xl">{f.icon}</span>
                <p className="text-sm font-semibold text-[#f9fafb] mt-2">{f.title}</p>
                <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14 text-center">
          {[
            { icon: '🔒', title: '100% secure', desc: 'Payments processed by Stripe. We never see your card.' },
            { icon: '↩️', title: '7-day refund',  desc: 'Not happy? Email us within 7 days for a full refund.' },
            { icon: '✕',  title: 'Cancel anytime', desc: 'No contracts. Cancel in one click from your dashboard.' },
          ].map((t, i) => (
            <div key={i} className="bg-[#0d1117] border border-[#1f2937] rounded-xl p-5">
              <span className="text-2xl">{t.icon}</span>
              <p className="text-sm font-semibold text-[#f9fafb] mt-2">{t.title}</p>
              <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-extrabold text-[#f9fafb] text-center mb-6"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {[
              { q: 'What AI tools are included in Pro?', a: 'All 6 AI tools: Rewrite, Grammar Fix, Clarity Improve, Tone Change, Summarizer, and Paraphraser. Unlimited uses per day.' },
              { q: 'What happens to my free tools if I don\'t upgrade?', a: 'Nothing changes. All 54 non-AI tools remain completely free, forever. You only hit limits on the 6 AI tools.' },
              { q: 'Can I switch between monthly and yearly?', a: 'Yes — log into the customer portal from your account dashboard and upgrade or downgrade at any time.' },
              { q: 'Do I need to create an account?', a: 'No account needed for free tools. For Pro, Stripe handles your subscription — just your email and payment details.' },
              { q: 'When does API access launch?', a: 'We\'re building the API now. Pro subscribers get early access and will be notified by email when it\'s ready.' },
            ].map((item, i) => (
              <details key={i} className="group bg-[#111827] border border-[#1f2937] rounded-xl">
                <summary className="px-5 py-4 text-sm font-semibold text-[#f9fafb] cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-[#6b7280] group-open:rotate-180 transition-transform duration-200 text-lg leading-none">›</span>
                </summary>
                <p className="px-5 pb-4 text-xs text-[#9ca3af] leading-relaxed border-t border-[#1f2937] pt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
