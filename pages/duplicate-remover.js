import { useState } from 'react';
import Layout from '../components/Layout';

export default function DuplicateRemover() {
  const [input,         setInput]         = useState('');
  const [output,        setOutput]        = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines,     setTrimLines]     = useState(true);
  const [removed,       setRemoved]       = useState(null);
  const [copied,        setCopied]        = useState(false);

  function removeDuplicates() {
    if (!input.trim()) return;
    const lines  = input.split('\n').map(l => trimLines ? l.trim() : l).filter(l => l !== '');
    const seen   = new Set();
    const unique = [];
    lines.forEach(line => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) { seen.add(key); unique.push(line); }
    });
    setOutput(unique.join('\n'));
    setRemoved(lines.length - unique.length);
    setCopied(false);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    });
  }

  function clear() { setInput(''); setOutput(''); setRemoved(null); setCopied(false); }

  const lineCount = input.trim() ? input.split('\n').filter(l => l.trim()).length : 0;

  return (
    <Layout
      title="Duplicate Line Remover — Remove Duplicate Words & Lines"
      description="Free online duplicate remover. Instantly remove duplicate words, lines, or entries from any text list. Case-sensitive option included. No login required."
      canonical="https://scramblefix.io/duplicate-remover"
    >
      <div className="max-w-5xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-4 text-center">
          <h1
            className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-2px' }}>
            Duplicate <em className="not-italic text-[#10b981]">Remover</em>
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-sm mx-auto">
            Paste any list and instantly remove all duplicate lines or entries.
          </p>
        </div>

        {/* Tool card */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">

          {/* Input */}
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280]">Input Text</label>
            {lineCount > 0 && <span className="text-[0.65rem] text-[#6b7280]">{lineCount} lines</span>}
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(''); setRemoved(null); }}
            placeholder="Paste your list here — one item per line…"
            rows={6}
            className="w-full bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#10b981] rounded-xl px-4 py-3 text-sm text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 resize-y mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Options */}
          <div className="flex flex-wrap gap-5 mb-5">
            {[
              { label: 'Case-sensitive', val: caseSensitive, set: setCaseSensitive },
              { label: 'Trim whitespace', val: trimLines,    set: setTrimLines },
            ].map(opt => (
              <label key={opt.label} className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => opt.set(!opt.val)}
                  className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${opt.val ? 'bg-[#10b981]' : 'bg-[#374151]'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${opt.val ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-[#9ca3af]">{opt.label}</span>
              </label>
            ))}
          </div>

          <button onClick={removeDuplicates}
            className="w-full py-3 rounded-xl font-semibold bg-[#10b981] hover:bg-[#059669] text-white transition-colors duration-200 mb-4">
            Remove Duplicates
          </button>

          {/* Output */}
          {removed !== null && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280]">Unique Lines</label>
                <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${removed > 0 ? 'bg-[#064e3b] text-[#34d399]' : 'bg-[#1f2937] text-[#6b7280]'}`}>
                  {removed > 0 ? `${removed} duplicate${removed > 1 ? 's' : ''} removed` : 'No duplicates found'}
                </span>
              </div>
              <textarea
                value={output}
                readOnly
                rows={6}
                className="w-full bg-[#0a0e17] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-[#10b981] outline-none resize-y mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <div className="flex gap-3">
                <button onClick={copyOutput}
                  className={`flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    copied ? 'bg-[#10b981] text-white' : 'bg-[#10b981] hover:bg-[#059669] text-white'
                  }`}>
                  {copied ? '✓ Copied!' : 'Copy Clean List'}
                </button>
                <button onClick={clear}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#1f2937] text-[#9ca3af] hover:border-[#10b981] hover:text-[#10b981] transition-all duration-150">
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEO content */}
        <div className="mt-16 mb-16 space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
              What is a Duplicate Remover?
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              A duplicate remover scans a list of words, lines, or entries and removes any that appear more than once, keeping only the first occurrence. Essential for cleaning data exports, deduplicating email lists, consolidating vocabulary lists, or processing any text with repeated entries.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Use Cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Cleaning CSV or spreadsheet data', 'Deduplicating email or mailing lists', 'Removing repeated words from vocabulary lists', 'Combining multiple word lists without repeats'].map(u => (
                <div key={u} className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 text-xs text-[#9ca3af]">
                  → {u}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[['/', 'Word Unscrambler'], ['/word-sorter', 'Word Sorter'], ['/case-converter', 'Case Converter'], ['/sentence-shuffler', 'Sentence Shuffler']].map(([href, label]) => (
                <a key={href} href={href}
                  className="px-4 py-2 rounded-xl border border-[#1f2937] text-sm text-[#9ca3af] hover:border-[#10b981] hover:text-[#10b981] transition-all duration-200">
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
