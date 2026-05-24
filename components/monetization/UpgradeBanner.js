/**
 * UpgradeBanner.js — Sticky top banner for AI tools
 * Tracks free AI uses in localStorage (3/day).
 * Shows remaining uses and a Pro upgrade prompt.
 */
import { useState, useEffect } from 'react';

export const FREE_LIMIT   = 3;
export const USES_KEY     = 'sf_ai_uses';

export function getAiUsage() {
  if (typeof window === 'undefined') return { count: 0, date: '' };
  try {
    return JSON.parse(localStorage.getItem(USES_KEY) || '{"count":0,"date":""}');
  } catch { return { count: 0, date: '' }; }
}

export function getTodayUses() {
  const { count, date } = getAiUsage();
  return date === new Date().toDateString() ? count : 0;
}

export function incrementAiUse() {
  const today = new Date().toDateString();
  const uses  = getTodayUses() + 1;
  localStorage.setItem(USES_KEY, JSON.stringify({ count: uses, date: today }));
  return uses;
}

export function hasReachedLimit() {
  return getTodayUses() >= FREE_LIMIT;
}

export default function UpgradeBanner() {
  const [uses,    setUses]    = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setUses(getTodayUses());
  }, []);

  if (!visible) return null;

  const remaining = Math.max(0, FREE_LIMIT - uses);
  const isExhausted = remaining === 0;

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 flex items-center justify-between gap-3 flex-wrap ${
      isExhausted
        ? 'bg-[#130820] border-[#7c3aed]'
        : 'bg-[#0d1117] border-[#1f2937]'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{isExhausted ? '🔒' : '⚡'}</span>
        <div>
          {isExhausted ? (
            <>
              <p className="text-xs font-semibold text-[#c4b5fd]">Daily AI limit reached</p>
              <p className="text-[0.7rem] text-[#9ca3af]">Upgrade to Pro for unlimited AI operations.</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-[#f9fafb]">
                {remaining} free AI {remaining === 1 ? 'use' : 'uses'} remaining today
              </p>
              <p className="text-[0.7rem] text-[#6b7280]">Upgrade to Pro for unlimited access.</p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Usage pills */}
        <div className="flex gap-1">
          {Array.from({ length: FREE_LIMIT }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < uses ? 'bg-[#7c3aed]' : 'bg-[#1f2937]'}`} />
          ))}
        </div>

        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
          style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', color:'#fff' }}>
          Upgrade →
        </button>

        {!isExhausted && (
          <button onClick={() => setVisible(false)}
            className="text-[#4b5563] hover:text-[#9ca3af] text-sm leading-none"
            aria-label="Dismiss">✕</button>
        )}
      </div>
    </div>
  );
}
