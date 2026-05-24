/**
 * AdBlock.js — Google AdSense unit
 * Replace YOUR_AD_SLOT with your real slot ID from AdSense dashboard.
 * Shows a house ad fallback while awaiting AdSense approval.
 */
import { useEffect, useRef } from 'react';

const PUB_ID  = 'ca-pub-1223182832425564';
const AD_SLOT = 'YOUR_AD_SLOT'; // ← swap this when you have a real slot ID

export default function AdBlock({ variant = 'horizontal' }) {
  const adRef = useRef(null);

  useEffect(() => {
    // Only push if AdSense script is loaded
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch {}
    }
  }, []);

  const isReal = AD_SLOT !== 'YOUR_AD_SLOT';

  if (!isReal) {
    // House ad — shown until real slot ID is added
    return (
      <div className="w-full my-5 rounded-xl border border-dashed border-[#1f2937] bg-[#0d1117] flex items-center justify-center"
        style={{ minHeight: variant === 'square' ? '250px' : '90px' }}>
        <div className="text-center px-4 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#374151] mb-1">Advertisement</p>
          <p className="text-xs text-[#4b5563]">
            Ad slot ready —{' '}
            <a href="https://www.google.com/adsense" target="_blank" rel="noreferrer"
              className="text-[#3b82f6] hover:underline">
              add your slot ID
            </a>{' '}
            to start earning.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-5 text-center overflow-hidden">
      <p className="text-[0.6rem] text-[#374151] uppercase tracking-widest mb-1">Advertisement</p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUB_ID}
        data-ad-slot={AD_SLOT}
        data-ad-format={variant === 'square' ? 'rectangle' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
