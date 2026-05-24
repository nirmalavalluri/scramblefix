import { useState } from 'react';
import Layout from '../components/Layout';
import { copyToClipboard } from '../utils/textUtils';

const BASE = 'https://scramblefix.io';

const SNIPPETS = [
  {
    id: 'script',
    label: 'Option 1 — Inline widget (recommended)',
    desc: 'Drop 2 lines into any HTML page. A compact unscrambler appears inline, powered by ScrambleFix.',
    code: `<!-- ScrambleFix Widget -->
<div id="scramblefix-widget"></div>
<script src="${BASE}/embed.js"></script>`,
  },
  {
    id: 'iframe',
    label: 'Option 2 — iFrame embed',
    desc: 'Works on any platform — Squarespace, Wix, WordPress, Webflow.',
    code: `<iframe
  src="${BASE}/widget.html"
  width="100%"
  height="500"
  style="border:none;border-radius:12px"
  title="ScrambleFix Word Unscrambler">
</iframe>`,
  },
  {
    id: 'link',
    label: 'Option 3 — Link button',
    desc: 'Zero JavaScript. A styled link that opens ScrambleFix in a new tab.',
    code: `<a href="${BASE}" target="_blank"
   style="display:inline-block;padding:10px 20px;
          background:#3b82f6;color:#fff;
          border-radius:8px;text-decoration:none;
          font-weight:600">
  🔤 Unscramble Words — ScrambleFix
</a>`,
  },
];

function CodeBlock({ code, id }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyToClipboard(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <pre className="bg-[#0a0e17] border border-[#1f2937] rounded-xl p-4 text-xs text-[#9ca3af] overflow-x-auto leading-relaxed font-mono whitespace-pre">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
          copied
            ? 'border-[#10b981] text-[#10b981] bg-[#0a1f0a]'
            : 'border-[#1f2937] text-[#9ca3af] bg-[#0a0e17] hover:border-[#3b82f6] hover:text-[#3b82f6]'
        }`}>
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Layout
      title="Embed ScrambleFix — Add a Word Unscrambler to Your Site"
      description="Add a free word unscrambler widget to any website in 2 lines of code. No API key, no backend, no cost."
      canonical={`${BASE}/embed`}>

      <div className="max-w-3xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#f9fafb] tracking-tight"
            style={{ fontFamily:"'Syne',sans-serif", letterSpacing:'-1.5px' }}>
            Embed <em className="not-italic text-[#3b82f6]">ScrambleFix</em>
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-md mx-auto leading-relaxed">
            Add a free word unscrambler widget to any website in 2 lines of code.
            No API key, no backend, no cost.
          </p>
        </div>

        {/* Code snippets */}
        <div className="space-y-6">
          {SNIPPETS.map(s => (
            <div key={s.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#3b82f6] mb-1">
                {s.label}
              </p>
              <p className="text-xs text-[#9ca3af] mb-4 leading-relaxed">{s.desc}</p>
              <CodeBlock code={s.code} id={s.id} />
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-4">
            Live preview
          </p>
          <iframe
            src="/widget.html"
            width="100%"
            height="480"
            style={{ border:'1px solid #1f2937', borderRadius:'12px', background:'#0a0e17' }}
            title="ScrambleFix Widget Preview"
          />
        </div>

        {/* Attribution note */}
        <div className="bg-[#0a0e17] border border-[#1f2937] rounded-2xl p-5 mt-6 mb-16">
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            <span className="text-[#f9fafb] font-semibold">Attribution</span> — The widget is
            free to use. We just ask that you include a visible link back to{' '}
            <a href={BASE} className="text-[#3b82f6] hover:underline">scramblefix.io</a>{' '}
            near the widget. No registration required.
          </p>
        </div>

      </div>
    </Layout>
  );
}