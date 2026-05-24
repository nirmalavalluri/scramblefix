/**
 * Paywall.js — Locks AI output after FREE_LIMIT daily uses
 * Shows upgrade wall with blurred output preview behind it.
 */
import { FREE_LIMIT } from './UpgradeBanner';

export default function Paywall({ children, uses, onDismiss }) {
  const isLocked = uses > FREE_LIMIT;
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative mt-4 rounded-2xl overflow-hidden">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none" style={{ filter:'blur(6px)', opacity:0.4 }}>
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
        style={{ background:'linear-gradient(to bottom, transparent 0%, rgba(10,14,23,0.95) 30%, #0a0e17 60%)' }}>

        <div className="max-w-xs">
          {/* Lock icon */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background:'linear-gradient(135deg,#7c3aed22,#ec489922)', border:'1px solid #7c3aed44' }}>
            🔒
          </div>

          <h3 className="text-base font-bold text-[#f9fafb] mb-1.5"
            style={{ fontFamily:"'Syne',sans-serif" }}>
            Daily AI limit reached
          </h3>
          <p className="text-xs text-[#9ca3af] leading-relaxed mb-5">
            You've used all {FREE_LIMIT} free AI operations for today.
            Upgrade to Pro for unlimited rewrites, grammar fixes, and more.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
              Upgrade to Pro →
            </button>
            <button
              onClick={onDismiss}
              className="w-full py-2 rounded-xl text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors">
              Come back tomorrow for 3 more free uses
            </button>
          </div>

          {/* Social proof */}
          <p className="mt-4 text-[0.65rem] text-[#4b5563]">
            Join 10,000+ writers already using ScrambleFix Pro
          </p>
        </div>
      </div>
    </div>
  );
}
