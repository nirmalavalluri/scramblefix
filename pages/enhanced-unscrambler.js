import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { loadDictionary, unscramble } from '../utils/textUtils';

export default function EnhancedUnscrambler() {
  const [dict,       setDict]       = useState(null);
  const [input,      setInput]      = useState('');
  const [startsWith, setStartsWith] = useState('');
  const [endsWith,   setEndsWith]   = useState('');
  const [minLen,     setMinLen]     = useState('');
  const [maxLen,     setMaxLen]     = useState('');
  const [grouped,    setGrouped]    = useState({});
  const [status,     setStatus]     = useState('idle'); // idle|loading|done|empty|error
  const [elapsed,    setElapsed]    = useState(0);
  const [filter,     setFilter]     = useState('all');

  useEffect(() => {
    loadDictionary()
      .then(d => setDict(d))
      .catch(() => setStatus('error'));
  }, []);

  const solve = useCallback(() => {
    const letters = input.replace(/[^a-zA-Z?]/g, '');
    if (!dict || letters.replace(/\?/g, '').length < 1) return;
    setStatus('loading'); setGrouped({}); setFilter('all');
    const t0 = performance.now();
    setTimeout(() => {
      try {
        let result = unscramble(letters, dict);
        // Apply filters
        const filtered = {};
        Object.entries(result).forEach(([len, words]) => {
          const n = Number(len);
          if (minLen && n < Number(minLen)) return;
          if (maxLen && n > Number(maxLen)) return;
          const kept = words.filter(w => {
            if (startsWith && !w.startsWith(startsWith.toLowerCase())) return false;
            if (endsWith   && !w.endsWith(endsWith.toLowerCase()))     return false;
            return true;
          });
          if (kept.length) filtered[len] = kept;
        });
        setGrouped(filtered);
        setElapsed(Math.round(performance.now() - t0));
        setStatus(Object.keys(filtered).length ? 'done' : 'empty');
      } catch {
        setStatus('empty');
      }
    }, 10);
  }, [input, dict, startsWith, endsWith, minLen, maxLen]);

  const tiles = input.toUpperCase().replace(/[^A-Z?]/g, '').split('');
  const LENS  = ['all', '2', '3', '4', '5', '6', '7'];
  const dictLoading = !dict && status !== 'error';

  const displayKeys = Object.keys(grouped)
    .map(Number)
    .filter(n => filter === 'all' || (filter === '7' ? n >= 7 : n === Number(filter)))
    .sort((a, b) => b - a);

  const totalWords = Object.values(grouped).reduce((s, a) => s + a.length, 0);

  return (
    <Layout
      title="Enhanced Word Unscrambler — Advanced Letter Solver"
      description="Advanced word unscrambler with filters. Find words by length, starting letter, or ending letter. Supports wildcards and blank tiles. Free, no login required."
      canonical="https://scramblefix.io/enhanced-unscrambler"
    >
      <div className="max-w-5xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-4 text-center">
          <h1
            className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-2px' }}>
            Enhanced <em className="not-italic text-[#3b82f6]">Unscrambler</em>
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-md mx-auto">
            Filter by length, starting letter, ending letter. Use <code className="text-[#3b82f6] font-mono">?</code> for blank tiles.
          </p>
        </div>

        {/* Tool card */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">

          {/* Letter tiles */}
          {tiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5 justify-center">
              {tiles.map((ch, i) => (
                <div key={i}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center justify-center font-extrabold text-sm sm:text-base text-[#f9fafb]"
                  style={{ fontFamily: "'Syne',sans-serif" }}>
                  {ch}
                </div>
              ))}
            </div>
          )}

          {/* Main input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={input}
              onChange={e => {
                setInput(e.target.value.replace(/[^a-zA-Z?]/g, '').slice(0, 15));
                setStatus('idle'); setGrouped({});
              }}
              onKeyDown={e => e.key === 'Enter' && solve()}
              placeholder={dictLoading ? 'Loading dictionary…' : 'Enter letters… (? = blank tile)'}
              maxLength={15}
              autoComplete="off"
              disabled={dictLoading}
              className="flex-1 bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-lg font-bold tracking-widest uppercase text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 disabled:opacity-50"
              style={{ fontFamily: "'Syne',sans-serif" }}
            />
            <button
              onClick={solve}
              disabled={dictLoading || input.replace(/[^a-zA-Z]/g, '').length < 1 || status === 'loading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap">
              {status === 'loading' ? 'Searching…' : 'Find Words'}
            </button>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Starts with', value: startsWith, set: setStartsWith, placeholder: 'e.g. sc' },
              { label: 'Ends with',   value: endsWith,   set: setEndsWith,   placeholder: 'e.g. le' },
              { label: 'Min length',  value: minLen,     set: setMinLen,     placeholder: '2',      type: 'number' },
              { label: 'Max length',  value: maxLen,     set: setMaxLen,     placeholder: '8',      type: 'number' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  maxLength={f.type ? undefined : 4}
                  min={f.type ? 1 : undefined}
                  max={f.type ? 15 : undefined}
                  className="w-full bg-[#0a0e17] border border-[#1f2937] focus:border-[#3b82f6] rounded-lg px-3 py-2 text-sm text-[#f9fafb] placeholder-[#4b5563] outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Length filter pills */}
          <div className="flex gap-2 flex-wrap items-center">
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

        {/* Results */}
        {status === 'loading' && (
          <p className="text-center py-8 text-[#6b7280] text-sm">Searching dictionary…</p>
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
          <p className="text-center py-8 text-[#6b7280] text-sm">No words found. Try adjusting your filters or letters.</p>
        )}

        {/* SEO content */}
        <div className="mt-16 mb-16 space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
              What is the Enhanced Unscrambler?
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              The Enhanced Unscrambler goes beyond a basic letter solver. Filter results by word length, require specific starting or ending letters, and use <code className="text-[#3b82f6] font-mono">?</code> as a wildcard for blank tiles — making it the ideal tool for Scrabble, Words With Friends, Boggle, and Wordle.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[['/', 'Word Unscrambler'], ['/scrabble-word-finder', 'Scrabble Finder'], ['/wordle-helper', 'Wordle Helper'], ['/word-sorter', 'Word Sorter']].map(([href, label]) => (
                <a key={href} href={href}
                  className="px-4 py-2 rounded-xl border border-[#1f2937] text-sm text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all duration-200">
                  {label}
                </a>
              ))}
            </div>
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
      style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '0.5px' }}>
      {copied ? '✓' : word}
    </button>
  );
}
