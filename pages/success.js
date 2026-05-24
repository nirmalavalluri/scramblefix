import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { verifyAndActivatePro } from '../utils/proUtils';

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [email,  setEmail]  = useState('');
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (!session_id) return;

    verifyAndActivatePro(session_id).then(result => {
      if (result.ok) {
        setEmail(result.email || '');
        setStatus('success');
      } else {
        setError(result.error || 'Verification failed. Please contact support.');
        setStatus('error');
      }
    });
  }, [session_id]);

  return (
    <Layout title="Welcome to Pro — ScrambleFix" noFooter>
      <div className="min-h-[80vh] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">

          {/* Verifying */}
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed22,#ec489922)', border: '1px solid #7c3aed44' }}>
                <svg className="animate-spin w-7 h-7 text-[#7c3aed]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".2"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-[#9ca3af] text-sm">Activating your Pro subscription…</p>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="space-y-6">
              {/* Confetti icon */}
              <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                🎉
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-[#f9fafb] mb-2"
                  style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-1px' }}>
                  Welcome to Pro!
                </h1>
                {email && (
                  <p className="text-xs text-[#6b7280]">Subscription confirmed for <span className="text-[#9ca3af]">{email}</span></p>
                )}
              </div>

              {/* What's unlocked */}
              <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 text-left space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-3">Now unlocked</p>
                {[
                  '♾️ Unlimited AI operations',
                  '🚫 Ad-free across all 60 tools',
                  '✨ AI Rewrite, Grammar Fix, Summarizer & more',
                  '🎯 Priority support',
                  '🔌 API access (coming soon)',
                ].map((item, i) => (
                  <p key={i} className="text-sm text-[#d1d5db] flex items-center gap-2.5">
                    <span className="text-[#10b981] text-xs font-bold shrink-0">✓</span>
                    {item}
                  </p>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <Link href="/tools/ai-rewrite"
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white text-center"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                  Try AI Rewrite now →
                </Link>
                <Link href="/" className="text-sm text-[#6b7280] hover:text-[#9ca3af] transition-colors">
                  Back to homepage
                </Link>
              </div>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl bg-[#1e0a0a] border border-[#ef4444]">
                ⚠️
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#f9fafb] mb-2"
                  style={{ fontFamily: "'Syne',sans-serif" }}>
                  Verification issue
                </h1>
                <p className="text-sm text-[#9ca3af] leading-relaxed">{error}</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="mailto:hello@scramblefix.io?subject=Pro activation issue"
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-[#3b82f6] text-white text-center hover:bg-[#2563eb]">
                  Contact support →
                </a>
                <Link href="/pricing" className="text-sm text-[#6b7280] hover:text-[#9ca3af]">
                  Back to pricing
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
