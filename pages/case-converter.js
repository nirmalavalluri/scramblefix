import { useState } from 'react';
import Layout from '../components/Layout';

const CASES = [
  { id: 'upper',    label: 'UPPERCASE',     fn: t => t.toUpperCase() },
  { id: 'lower',    label: 'lowercase',     fn: t => t.toLowerCase() },
  { id: 'title',    label: 'Title Case',    fn: t => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id: 'sentence', label: 'Sentence case', fn: t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { id: 'camel',    label: 'camelCase',     fn: t => t.trim().split(/\s+/).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
  { id: 'pascal',   label: 'PascalCase',    fn: t => t.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
  { id: 'snake',    label: 'snake_case',    fn: t => t.trim().toLowerCase().replace(/\s+/g, '_') },
  { id: 'kebab',    label: 'kebab-case',    fn: t => t.trim().toLowerCase().replace(/\s+/g, '-') },
  { id: 'constant', label: 'CONSTANT_CASE', fn: t => t.trim().toUpperCase().replace(/\s+/g, '_') },
  { id: 'alt',      label: 'aLtErNaTiNg',  fn: t => t.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
];

export default function CaseConverter() {
  const [input,      setInput]      = useState('');
  const [output,     setOutput]     = useState('');
  const [activeCase, setActiveCase] = useState('');
  const [copied,     setCopied]     = useState(false);

  function convert(id) {
    if (!input.trim()) return;
    const c = CASES.find(c => c.id === id);
    setOutput(c.fn(input));
    setActiveCase(id);
    setCopied(false);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    });
  }

  function clear() { setInput(''); setOutput(''); setActiveCase(''); setCopied(false); }

  return (
    <Layout
      title="Case Converter — Convert Text to Any Case"
      description="Free online case converter. Instantly convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more. No login required."
      canonical="https://scramblefix.io/case-converter"
    >
      <div className="max-w-5xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-4 text-center">
          <h1
            className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-2px' }}>
            Case <em className="not-italic text-[#8b5cf6]">Converter</em>
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-sm mx-auto">
            UPPERCASE · lowercase · Title Case · camelCase · snake_case · and more.
          </p>
        </div>

        {/* Tool card */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">

          {/* Input */}
          <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-1.5">Input Text</label>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(''); setActiveCase(''); }}
            placeholder="Type or paste your text here…"
            rows={4}
            className="w-full bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#8b5cf6] rounded-xl px-4 py-3 text-sm text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 resize-y mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Case buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            {CASES.map(c => (
              <button key={c.id} onClick={() => convert(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  activeCase === c.id
                    ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white'
                    : 'border-[#1f2937] text-[#9ca3af] hover:border-[#8b5cf6] hover:text-[#8b5cf6]'
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Output */}
          {output && (
            <>
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-1.5">Output</label>
              <textarea
                value={output}
                readOnly
                rows={4}
                className="w-full bg-[#0a0e17] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-[#10b981] outline-none resize-y mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <div className="flex gap-3">
                <button onClick={copyOutput}
                  className={`flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    copied ? 'bg-[#10b981] text-white' : 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'
                  }`}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button onClick={clear}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#1f2937] text-[#9ca3af] hover:border-[#8b5cf6] hover:text-[#8b5cf6] transition-all duration-150">
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
              What is a Case Converter?
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              A case converter changes the capitalization style of any text instantly. Whether you need UPPERCASE for headings, camelCase for JavaScript variables, snake_case for Python, or kebab-case for CSS — this tool handles all formats with one click, no manual editing needed.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
              All Supported Cases
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['UPPERCASE', 'ALL LETTERS CAPITALIZED'],
                ['lowercase', 'all letters in lowercase'],
                ['Title Case', 'First Letter Of Every Word'],
                ['Sentence case', 'Only the first letter'],
                ['camelCase', 'firstWordLower, RestCapitalized'],
                ['PascalCase', 'AllWordsCapitalized'],
                ['snake_case', 'words_separated_by_underscores'],
                ['kebab-case', 'words-separated-by-hyphens'],
                ['CONSTANT_CASE', 'UPPERCASE_WITH_UNDERSCORES'],
                ['aLtErNaTiNg', 'aLtErNaTiNg LeTtErS'],
              ].map(([name, ex]) => (
                <div key={name} className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-[#8b5cf6]">{name}</span>
                  <span className="text-[#6b7280] text-xs ml-2">— {ex}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[['/', 'Word Unscrambler'], ['/word-sorter', 'Word Sorter'], ['/duplicate-remover', 'Duplicate Remover'], ['/sentence-shuffler', 'Sentence Shuffler']].map(([href, label]) => (
                <a key={href} href={href}
                  className="px-4 py-2 rounded-xl border border-[#1f2937] text-sm text-[#9ca3af] hover:border-[#8b5cf6] hover:text-[#8b5cf6] transition-all duration-200">
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
