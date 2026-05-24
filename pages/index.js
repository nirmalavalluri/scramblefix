import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { loadDictionary, unscramble } from '../utils/textUtils';
import { TOOLS, CATEGORIES } from '../utils/toolConfig';

const CAT_COLORS = {
  cleaning:'#3b82f6', extraction:'#10b981', formatting:'#8b5cf6',
  encoding:'#f59e0b', generators:'#ef4444', ai:'#ec4899',
};

export default function Home() {

  // ── Unscrambler ───────────────────────────────────────────────
  const [dict,    setDict]    = useState(null);
  const [input,   setInput]   = useState('');
  const [grouped, setGrouped] = useState({});
  const [status,  setStatus]  = useState('idle');  // idle|loading|done|empty|error
  const [elapsed, setElapsed] = useState(0);
  const [filter,  setFilter]  = useState('all');

  // Pre-load dictionary on mount
  useEffect(() => {
    loadDictionary()
      .then(d => setDict(d))
      .catch(() => setStatus('error'));
  }, []);

  const solve = useCallback(() => {
    const letters = input.replace(/[^a-zA-Z]/g, '');
    if (!dict || letters.length < 2) return;
    setStatus('loading'); setGrouped({}); setFilter('all');
    const t0 = performance.now();
    // defer so React renders "loading" before heavy work
    setTimeout(() => {
      try {
        const result = unscramble(letters, dict);
        setGrouped(result);
        setElapsed(Math.round(performance.now() - t0));
        setStatus(Object.keys(result).length ? 'done' : 'empty');
      } catch {
        setStatus('empty');
      }
    }, 10);
  }, [input, dict]);

  const tiles = input.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const LENS  = ['all','2','3','4','5','6','7'];

  const displayKeys = Object.keys(grouped)
    .map(Number)
    .filter(n => filter === 'all' || (filter === '7' ? n >= 7 : n === Number(filter)))
    .sort((a, b) => b - a);

  const totalWords = Object.values(grouped).reduce((s, a) => s + a.length, 0);

  // ── Tool directory ────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('all');
  const visibleTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory);

  const dictLoading = !dict && status !== 'error';

  return (
    <Layout canonical="https://scramblefix.io/">
      <div className="max-w-5xl mx-auto px-5">

        {/* ── HERO ──────────────────────────────────────────── */}
        <div className="pt-12 pb-4 text-center">
          <h1
            className="text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily:"'Syne',sans-serif", letterSpacing:'-2px' }}>
            Unscramble <em className="not-italic text-[#3b82f6]">any</em> word,<br />
            in milliseconds.
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-sm mx-auto">
            270,000-word dictionary. No server. Works offline.
          </p>
          <p className="mt-2 text-[#6b7280] text-xs max-w-md mx-auto">
            Plus 60+ smart tools to clean, extract, format, and enhance any text — free, instant, no signup.
          </p>
        </div>

        {/* ── TOOL CARD ─────────────────────────────────────── */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">

          {/* Letter tiles preview */}
          {tiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5 justify-center">
              {tiles.map((ch, i) => (
                <div key={i}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center justify-center font-extrabold text-sm sm:text-base text-[#f9fafb]"
                  style={{ fontFamily:"'Syne',sans-serif" }}>
                  {ch}
                </div>
              ))}
            </div>
          )}

          {/* Input row — stacks on mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={e => {
                setInput(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 15));
                setStatus('idle'); setGrouped({});
              }}
              onKeyDown={e => e.key === 'Enter' && solve()}
              placeholder={dictLoading ? 'Loading dictionary…' : 'Enter letters…'}
              maxLength={15}
              autoComplete="off"
              disabled={dictLoading}
              className="flex-1 bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-lg font-bold tracking-widest uppercase text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 disabled:opacity-50"
              style={{ fontFamily:"'Syne',sans-serif" }}
            />
            <button
              onClick={solve}
              disabled={dictLoading || input.replace(/[^a-zA-Z]/g,'').length < 2 || status === 'loading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap">
              {status === 'loading' ? 'Searching…' : 'Find Words'}
            </button>
          </div>

          {/* Dictionary loading indicator */}
          {dictLoading && (
            <p className="text-center text-xs text-[#6b7280] mt-3 flex items-center justify-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity=".2"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
              Loading dictionary…
            </p>
          )}

          {/* Length filters */}
          <div className="flex gap-2 flex-wrap mt-4 items-center">
            <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280]">Length:</span>
            {LENS.map(l => (
              <button key={l} onClick={() => setFilter(l)}
                className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all duration-150 ${
                  filter === l
                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                    : 'border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'
                }`}>
                {l === 'all' ? 'All' : l === '7' ? '7+' : l}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULTS ───────────────────────────────────────── */}
        {status === 'loading' && (
          <p className="text-center py-8 text-[#6b7280] text-sm">Searching 270,000 words…</p>
        )}

        {status === 'done' && (
          <p className="text-xs text-[#6b7280] mt-3 mb-1 px-1">
            <span className="text-[#f9fafb] font-bold">{totalWords}</span> words found · {elapsed}ms
          </p>
        )}

        {status === 'done' && displayKeys.map(len => (
          <div key={len} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 mt-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-3">
              {len} letters · {grouped[String(len)].length} words
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped[String(len)].map(w => <WordChip key={w} word={w} />)}
            </div>
          </div>
        ))}

        {status === 'empty' && (
          <p className="text-center py-8 text-[#6b7280] text-sm">
            No words found for those letters. Try a different combination.
          </p>
        )}

        {status === 'error' && (
          <p className="text-center py-8 text-[#ef4444] text-sm">
            Failed to load dictionary. Check that <code className="font-mono">public/words.js</code> exists.
          </p>
        )}

        {/* ── 60 TOOLS SECTION ──────────────────────────────── */}
        <div className="mt-16 mb-8 text-center">
          <h2
            className="text-2xl font-extrabold text-[#f9fafb] tracking-tight"
            style={{ fontFamily:"'Syne',sans-serif", letterSpacing:'-1px' }}>
            60 Free Text <em className="not-italic text-[#3b82f6]">Tools</em>
          </h2>
          <p className="mt-1.5 text-[#9ca3af] text-sm">
            Clean · Extract · Format · Encode · Generate · AI
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          <button onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === 'all'
                ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                : 'border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'
            }`}>
            All 60
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat.id ? 'text-white border-transparent' : 'border-[#1f2937] text-[#9ca3af]'
              }`}
              style={activeCategory === cat.id ? { background: CAT_COLORS[cat.id], borderColor: CAT_COLORS[cat.id] } : {}}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {visibleTools.map(tool => {
            const color = CAT_COLORS[tool.category];
            const isAi  = tool.category === 'ai';
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className={`group relative flex items-start gap-2.5 p-3.5 rounded-xl transition-all duration-200 ${
                  isAi
                    ? 'bg-[#130820] border border-[#3d1a5e]'
                    : 'bg-[#111827] border border-[#1f2937]'
                }`}
                style={isAi ? { boxShadow:'0 0 0 1px #7c3aed22, inset 0 0 20px #7c3aed0a' } : {}}
                onMouseEnter={e => e.currentTarget.style.borderColor = color}
                onMouseLeave={e => e.currentTarget.style.borderColor = isAi ? '#3d1a5e' : ''}>

                {/* AI badge */}
                {isAi && (
                  <span className="absolute top-2.5 right-2.5 text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', color:'#fff', letterSpacing:'0.5px' }}>
                    AI
                  </span>
                )}

                <span className="text-lg shrink-0 mt-0.5">{tool.icon}</span>
                <div className="min-w-0 pr-4">
                  <p className={`text-xs font-semibold leading-tight transition-colors ${
                    isAi ? 'text-[#e9d5ff] group-hover:text-[#ec4899]' : 'text-[#f9fafb] group-hover:text-[#3b82f6]'
                  }`}>
                    {tool.title}
                  </p>
                  <p className="text-[0.65rem] text-[#6b7280] mt-1 leading-snug line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all tools link */}
        <div className="text-center mb-10">
          <Link href="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1f2937] text-sm text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all duration-200">
            View all 60 tools
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Pro teaser */}
        <div className="mb-16 rounded-2xl border border-[#3d1a5e] p-6 text-center relative overflow-hidden"
          style={{ background:'linear-gradient(135deg, #0d0a1a 0%, #130820 50%, #0d0a1a 100%)' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 0%, #7c3aed 0%, transparent 70%)' }} />
          <div className="relative">
            <span className="inline-block text-[0.65rem] font-bold px-2.5 py-1 rounded-full mb-3 tracking-widest uppercase"
              style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', color:'#fff' }}>
              Coming Soon
            </span>
            <h3 className="text-lg font-extrabold text-[#f9fafb] mb-1.5" style={{ fontFamily:"'Syne',sans-serif" }}>
              ScrambleFix{' '}
              <em className="not-italic" style={{ background:'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Pro
              </em>
            </h3>
            <p className="text-[#9ca3af] text-sm max-w-sm mx-auto leading-relaxed">
              Unlimited AI rewrites, grammar fixes, tone changes and summaries.
              Bulk processing, API access, and priority support.
            </p>
            <button disabled
              className="mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-[#c4b5fd] border border-[#7c3aed] opacity-70 cursor-not-allowed">
              Notify me when it launches →
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

function WordChip({ word }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(word).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1200);
      })}
      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150 ${
        copied
          ? 'bg-[#10b981] border-[#10b981] text-white'
          : 'bg-[#0a0e17] border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'
      }`}
      style={{ fontFamily:"'Syne',sans-serif", letterSpacing:'0.5px' }}>
      {copied ? '✓' : word}
    </button>
  );
}
