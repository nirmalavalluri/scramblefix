import { useState, useCallback } from 'react';
import { getStoredKey, saveKey, AI_KEY_STORAGE } from '../utils/aiUtils';
import { copyToClipboard } from '../utils/textUtils';
import { CATEGORIES } from '../utils/toolConfig';
import AdBlock        from './monetization/AdBlock';
import AffiliateBox   from './monetization/AffiliateBox';
import ProFeatures    from './monetization/ProFeatures';
import UpgradeBanner, { getTodayUses, incrementAiUse, hasReachedLimit, FREE_LIMIT } from './monetization/UpgradeBanner';
import Paywall        from './monetization/Paywall';

/**
 * Set to true when Stripe + AdSense + API key are configured.
 * Controls UpgradeBanner, Paywall, ProFeatures, AdBlock visibility.
 */
const MONETIZATION_ENABLED = false;

// ── Shared styles ─────────────────────────────────────────────────
const card       = 'bg-[#111827] border border-[#1f2937] rounded-2xl p-4 sm:p-6';
const btnPrimary = 'px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed';
const textArea   = 'w-full bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 resize-y';

// ── Option renderer ───────────────────────────────────────────────
function OptionControl({ opt, value, onChange }) {
  if (opt.type === 'toggle') {
    return (
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div onClick={() => onChange(opt.id, !value)}
          className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${value ? 'bg-[#3b82f6]' : 'bg-[#1f2937]'}`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-4' : 'left-0.5'}`} />
        </div>
        <span className="text-xs text-[#9ca3af]">{opt.label}</span>
      </label>
    );
  }
  if (opt.type === 'select') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6b7280] whitespace-nowrap">{opt.label}:</span>
        <select value={value} onChange={e => onChange(opt.id, e.target.value)}
          className="bg-[#0a0e17] border border-[#1f2937] text-[#9ca3af] text-xs rounded-lg px-2.5 py-1.5 outline-none hover:border-[#3b82f6] transition-colors cursor-pointer">
          {opt.choices.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
    );
  }
  if (opt.type === 'number') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6b7280]">{opt.label}:</span>
        <input type="number" value={value} onChange={e => onChange(opt.id, e.target.value)}
          className="w-20 bg-[#0a0e17] border border-[#1f2937] text-[#9ca3af] text-xs rounded-lg px-2 py-1.5 outline-none hover:border-[#3b82f6] transition-colors" />
      </div>
    );
  }
  return null;
}

// ── Stat cards ────────────────────────────────────────────────────
function StatCards({ data }) {
  const LABELS = { words:'Words', chars:'Characters', noSpaces:'No spaces', sentences:'Sentences', paragraphs:'Paragraphs', lines:'Lines', readTime:'Read time (min)', letters:'Letters', breakdown:null };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(data).filter(([k]) => LABELS[k] !== null && LABELS[k] !== undefined).map(([k, v]) => (
          <div key={k} className="bg-[#0a0e17] border border-[#1f2937] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#3b82f6]" style={{ fontFamily:"'Syne', sans-serif" }}>{v}</p>
            <p className="text-[0.68rem] text-[#6b7280] mt-0.5 uppercase tracking-wide">{LABELS[k]}</p>
          </div>
        ))}
      </div>
      {data.breakdown && (
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-2">Top characters</p>
          <div className="flex flex-wrap gap-1.5">
            {data.breakdown.slice(0, 15).map(([ch, cnt]) => (
              <span key={ch} className="px-2.5 py-1 bg-[#0a0e17] border border-[#1f2937] rounded-lg text-xs font-mono text-[#9ca3af]">
                {ch === ' ' ? '·space·' : ch}: {cnt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Copy button ───────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const handleCopy = () => {
    copyToClipboard(typeof text === 'object' ? JSON.stringify(text, null, 2) : String(text))
      .then(() => { setDone(true); setTimeout(() => setDone(false), 2000); });
  };
  return (
    <button onClick={handleCopy}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
        done ? 'border-[#10b981] text-[#10b981]' : 'border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'
      }`}>
      {done ? '✓ Copied!' : 'Copy'}
    </button>
  );
}

// ── AI Key panel ──────────────────────────────────────────────────
function AiKeyPanel({ onKey }) {
  const [val,   setVal]   = useState('');
  const [saved, setSaved] = useState(false);
  const stored = typeof window !== 'undefined' ? getStoredKey() : '';

  if (stored) {
    return (
      <div className="flex items-center gap-3 p-3 bg-[#0a1f0a] border border-[#10b981] rounded-xl text-xs">
        <span className="text-[#10b981] font-semibold">✓ API key stored</span>
        <button onClick={() => { localStorage.removeItem(AI_KEY_STORAGE); window.location.reload(); }}
          className="text-[#6b7280] hover:text-[#ef4444] underline">Remove</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#0a0e17] border border-[#1f2937] rounded-xl space-y-3">
      <p className="text-xs text-[#9ca3af] leading-relaxed">
        <span className="text-[#f9fafb] font-semibold">Add your Anthropic API key</span> to enable AI tools.
        Stored in your browser only — never sent to our servers.{' '}
        <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-[#3b82f6] hover:underline">Get a key →</a>
      </p>
      <div className="flex gap-2">
        <input type="password" value={val} onChange={e => setVal(e.target.value)}
          placeholder="sk-ant-api..." className="flex-1 bg-[#111827] border border-[#1f2937] rounded-lg px-3 py-2 text-xs text-[#f9fafb] outline-none focus:border-[#3b82f6]" />
        <button onClick={() => { saveKey(val); setSaved(true); onKey(val); }}
          disabled={!val.startsWith('sk-')}
          className="px-4 py-2 bg-[#3b82f6] text-white text-xs font-semibold rounded-lg disabled:opacity-40">
          {saved ? 'Saved ✓' : 'Save key'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN ToolShell
// ═══════════════════════════════════════════════════════════════════
export default function ToolShell({ tool }) {
  const [input,      setInput]      = useState('');
  const [output,     setOutput]     = useState(null);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [apiKey,     setApiKey]     = useState('');
  const [aiUses,     setAiUses]     = useState(0);
  const [paywalled,  setPaywalled]  = useState(false);
  const [opts, setOpts] = useState(
    Object.fromEntries((tool.options || []).map(o => [o.id, o.default ?? '']))
  );

  const cat      = { cleaning:'#3b82f6', extraction:'#10b981', formatting:'#8b5cf6', encoding:'#f59e0b', generators:'#ef4444', ai:'#ec4899' }[tool.category] || '#3b82f6';
  const setOpt   = (id, val) => setOpts(o => ({ ...o, [id]: val }));

  const isGenerate = tool.type === 'generate';
  const isExtract  = tool.type === 'extract';
  const isAnalyze  = tool.type === 'analyze';
  const isAi       = tool.type === 'ai';

  const run = useCallback(async () => {
    // AI use limit check
    if (isAi) {
      const uses = getTodayUses();
      if (uses >= FREE_LIMIT) {
        setPaywalled(true);
        setAiUses(uses);
        return;
      }
    }

    setError(''); setOutput(null); setLoading(true);
    try {
      const key    = apiKey || (typeof window !== 'undefined' ? getStoredKey() : '');
      const result = await Promise.resolve(tool.fn(input, opts, key));
      setOutput(result);

      // Increment AI usage after successful run
      if (isAi) {
        const newCount = incrementAiUse();
        setAiUses(newCount);
        if (newCount >= FREE_LIMIT) setPaywalled(true);
      }
    } catch (e) {
      if (e.message === 'NO_KEY') {
        setError('No API key found. Add your Anthropic API key above to use AI tools.');
      } else {
        setError(e.message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }, [input, opts, apiKey, tool, isAi]);

  const outputText = Array.isArray(output)
    ? output.join('\n')
    : (typeof output === 'object' && output !== null ? null : String(output || ''));

  // Output content (used inside Paywall)
  const OutputContent = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280]">
          {tool.outputLabel || 'Result'}
        </label>
        <div className="flex gap-2 items-center">
          {isExtract && Array.isArray(output) && (
            <span className="text-xs text-[#6b7280]">{output.length} found</span>
          )}
          {outputText && <CopyBtn text={outputText} />}
          {!outputText && typeof output === 'object' && <CopyBtn text={output} />}
        </div>
      </div>

      {/* Extract → chips */}
      {isExtract && Array.isArray(output) && (
        output.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {output.map((item, i) => (
              <button key={i} onClick={() => copyToClipboard(item)}
                className="px-3 py-1.5 bg-[#0a0e17] border border-[#1f2937] rounded-lg text-xs font-medium text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all duration-150 font-mono">
                {item}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6b7280] py-4 text-center">Nothing found.</p>
        )
      )}

      {/* Analyze → stat cards */}
      {isAnalyze && typeof output === 'object' && <StatCards data={output} />}

      {/* Transform → textarea */}
      {!isExtract && !isAnalyze && outputText && (
        <textarea readOnly value={outputText}
          rows={Math.min(20, Math.max(4, (outputText.match(/\n/g) || []).length + 2))}
          className={`${textArea} cursor-default border-[#10b981]`}
          style={{ fontFamily: tool.category === 'encoding' ? 'monospace' : "'DM Sans', sans-serif" }}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 pb-16">

      {/* Header */}
      <div className="pt-6 pb-4 sm:pt-10 sm:pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl sm:text-2xl">{tool.icon}</span>
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border"
            style={{ color: cat, borderColor: cat, background: `${cat}15` }}>
            {CATEGORIES.find(c => c.id === tool.category)?.label}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f9fafb] tracking-tight"
          style={{ fontFamily:"'Syne', sans-serif", letterSpacing:'-1px' }}>
          {tool.title}
        </h1>
        <p className="mt-2 text-[#9ca3af] text-sm max-w-xl leading-relaxed">{tool.description}</p>
      </div>

      {/* ── MONETIZATION: UpgradeBanner (AI tools only) ── */}
      {MONETIZATION_ENABLED && isAi && <UpgradeBanner />}

      {/* AI key panel */}
      {isAi && <div className="mb-4"><AiKeyPanel onKey={setApiKey} /></div>}

      {/* Options */}
      {tool.options && tool.options.length > 0 && (
        <div className={`${card} mb-4`}>
          <div className="flex flex-wrap gap-4 items-center">
            {tool.options.map(opt => (
              <OptionControl key={opt.id} opt={opt} value={opts[opt.id]} onChange={setOpt} />
            ))}
          </div>
        </div>
      )}

      {/* Input + Run */}
      <div className={`${card} space-y-4`}>
        {!isGenerate && (
          <div>
            <label className="block text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-2">
              {tool.inputLabel || 'Input'}
            </label>
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') run(); }}
              placeholder={tool.placeholder || 'Paste your text here...'}
              rows={6} className={textArea}
              style={{ fontFamily:"'DM Sans', sans-serif" }}
            />
          </div>
        )}

        <button onClick={run}
          disabled={loading || (!isGenerate && !input.trim()) || (isAi && hasReachedLimit())}
          className={`w-full py-3 text-base sm:text-sm ${btnPrimary}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity=".3"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
              {isAi ? 'AI is thinking…' : 'Processing…'}
            </span>
          ) : isAi && hasReachedLimit()
            ? '🔒 Limit reached — Upgrade to Pro'
            : isGenerate ? `Generate ${tool.title}`
            : isAi ? `✨ Run AI: ${tool.title}`
            : 'Run'}
        </button>

        {error && (
          <div className="p-3 bg-[#1e0a0a] border border-[#ef4444] rounded-xl text-sm text-[#ef4444]">
            {error}
          </div>
        )}

        {/* ── MONETIZATION: AdBlock (after every run) ── */}
        {MONETIZATION_ENABLED && output !== null && !error && <AdBlock />}

        {/* Output — wrapped in Paywall for AI tools */}
        {output !== null && !error && (
          MONETIZATION_ENABLED && isAi ? (
            <Paywall uses={aiUses} onDismiss={() => setPaywalled(false)}>
              <OutputContent />
            </Paywall>
          ) : (
            <OutputContent />
          )
        )}
      </div>

      {!isGenerate && !isAi && (
        <p className="text-center text-[0.68rem] text-[#374151] mt-3">Ctrl + Enter to run</p>
      )}

      {/* ── MONETIZATION: AffiliateBox ── */}
      {MONETIZATION_ENABLED && <AffiliateBox category={tool.category} />}

      {/* ── MONETIZATION: ProFeatures (non-AI tools) ── */}
      {MONETIZATION_ENABLED && !isAi && <ProFeatures category={tool.category} />}

    </div>
  );
}
