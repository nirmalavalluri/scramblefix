import { useState } from 'react';
import Layout from '../components/Layout';

const SORT_OPTIONS = [
  { id: 'az',       label: 'A → Z',         fn: a => [...a].sort((x, y) => x.localeCompare(y)) },
  { id: 'za',       label: 'Z → A',         fn: a => [...a].sort((x, y) => y.localeCompare(x)) },
  { id: 'shortest', label: 'Shortest first', fn: a => [...a].sort((x, y) => x.length - y.length) },
  { id: 'longest',  label: 'Longest first',  fn: a => [...a].sort((x, y) => y.length - x.length) },
  { id: 'random',   label: 'Random',         fn: a => [...a].sort(() => Math.random() - 0.5) },
  { id: 'reverse',  label: 'Reverse order',  fn: a => [...a].reverse() },
];

function parseWords(text) {
  return text.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
}

export default function WordSorter() {
  const [input,      setInput]      = useState('');
  const [output,     setOutput]     = useState('');
  const [activeSort, setActiveSort] = useState('');
  const [separator,  setSeparator]  = useState('newline');
  const [copied,     setCopied]     = useState(false);

  function sort(id) {
    if (!input.trim()) return;
    const option = SORT_OPTIONS.find(o => o.id === id);
    const words  = parseWords(input);
    const sorted = option.fn(words);
    setOutput(sorted.join(separator === 'comma' ? ', ' : '\n'));
    setActiveSort(id);
    setCopied(false);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    });
  }

  function clear() { setInput(''); setOutput(''); setActiveSort(''); setCopied(false); }

  const wordCount = input.trim() ? parseWords(input).length : 0;

  return (
    <Layout
      title="Word Sorter — Sort Words Alphabetically Online"
      description="Free online word sorter. Instantly sort any list of words alphabetically, by length, or randomly. Paste your list and get sorted results in one click. No login."
      canonical="https://scramblefix.io/word-sorter"
    >
      <div className="max-w-5xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-4 text-center">
          <h1
            className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-2px' }}>
            Word <em className="not-italic text-[#3b82f6]">Sorter</em>
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-sm mx-auto">
            Sort any list of words alphabetically, by length, or randomly — instantly.
          </p>
        </div>

        {/* Tool card */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">

          {/* Input */}
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280]">Your Words</label>
            {wordCount > 0 && <span className="text-[0.65rem] text-[#6b7280]">{wordCount} words</span>}
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(''); setActiveSort(''); }}
            placeholder="Paste words here — one per line or comma-separated…"
            rows={5}
            className="w-full bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-sm text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 resize-y mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Sort buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SORT_OPTIONS.map(o => (
              <button key={o.id} onClick={() => sort(o.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  activeSort === o.id
                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                    : 'border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'
                }`}>
                {o.label}
              </button>
            ))}
          </div>

          {/* Separator toggle */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280]">Output:</span>
            {[['newline', 'New line'], ['comma', 'Comma']].map(([val, lbl]) => (
              <button key={val} onClick={() => { setSeparator(val); if (activeSort) sort(activeSort); }}
                className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all duration-150 ${
                  separator === val
                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                    : 'border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'
                }`}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Output */}
          {output && (
            <>
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-1.5">Sorted Output</label>
              <textarea
                value={output}
                readOnly
                rows={5}
                className="w-full bg-[#0a0e17] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-[#10b981] outline-none resize-y mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <div className="flex gap-3">
                <button onClick={copyOutput}
                  className={`flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    copied ? 'bg-[#10b981] text-white' : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
                  }`}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button onClick={clear}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all duration-150">
                  Clear
                </button>
              </div>
            </>
          )}
        </div>

        {/* SEO content */}
        <div className="mt-16 mb-16 space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
              What is a Word Sorter?
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              A word sorter arranges a list of words in a chosen order — alphabetically, by word length, in reverse, or randomly. Useful for organizing vocabulary lists, cleaning data, preparing Scrabble word lists by score potential, or finding patterns in text.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Use Cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Sorting vocabulary lists for study', 'Organizing Scrabble words by length', 'Alphabetizing names or tags', 'Randomizing lists for quizzes or games', 'Reversing the order of a sequence', 'Cleaning up CSV or spreadsheet data'].map(u => (
                <div key={u} className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 text-xs text-[#9ca3af]">
                  → {u}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[['/', 'Word Unscrambler'], ['/case-converter', 'Case Converter'], ['/duplicate-remover', 'Duplicate Remover'], ['/sentence-shuffler', 'Sentence Shuffler']].map(([href, label]) => (
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
