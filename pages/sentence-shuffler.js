import { useState } from 'react';
import Layout from '../components/Layout';

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SentenceShuffler() {
  const [input,        setInput]        = useState('');
  const [output,       setOutput]       = useState('');
  const [keepEmpty,    setKeepEmpty]    = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [copied,       setCopied]       = useState(false);

  function shuffle() {
    if (!input.trim()) return;
    const lines = input.split('\n');
    const pool  = keepEmpty ? lines : lines.filter(l => l.trim() !== '');
    setOutput(fisherYates(pool).join('\n'));
    setShuffleCount(c => c + 1);
    setCopied(false);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    });
  }

  function clear() { setInput(''); setOutput(''); setShuffleCount(0); setCopied(false); }

  const lineCount = input.trim() ? input.split('\n').filter(l => l.trim()).length : 0;

  return (
    <Layout
      title="Sentence Shuffler — Randomize & Shuffle Sentences Online"
      description="Free online sentence shuffler. Instantly randomize the order of sentences or lines in any text. Perfect for mixing quiz questions, study cards, or lists. No login."
      canonical="https://scramblefix.io/sentence-shuffler"
    >
      <div className="max-w-5xl mx-auto px-5">

        {/* Hero */}
        <div className="pt-12 pb-4 text-center">
          <h1
            className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Syne',sans-serif", letterSpacing: '-2px' }}>
            Sentence <em className="not-italic text-[#f59e0b]">Shuffler</em>
          </h1>
          <p className="mt-3 text-[#9ca3af] text-sm max-w-sm mx-auto">
            Randomize the order of any sentences or lines instantly. Shuffle as many times as you like.
          </p>
        </div>

        {/* Tool card */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-6">

          {/* Input */}
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280]">Your Sentences / Lines</label>
            {lineCount > 0 && <span className="text-[0.65rem] text-[#6b7280]">{lineCount} lines</span>}
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(''); setShuffleCount(0); }}
            placeholder="Paste your sentences or lines here — one per line…"
            rows={6}
            className="w-full bg-[#0a0e17] border-2 border-[#1f2937] focus:border-[#f59e0b] rounded-xl px-4 py-3 text-sm text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors duration-200 resize-y mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Options */}
          <div className="flex flex-wrap gap-5 mb-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setKeepEmpty(!keepEmpty)}
                className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${keepEmpty ? 'bg-[#f59e0b]' : 'bg-[#374151]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${keepEmpty ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-[#9ca3af]">Keep empty lines</span>
            </label>
          </div>

          {/* Shuffle button */}
          <button onClick={shuffle}
            className="w-full py-3 rounded-xl font-semibold bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0e17] transition-colors duration-200">
            🔀 Shuffle{shuffleCount > 0 ? ` (${shuffleCount})` : ''}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mt-3">
            <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-1.5">Shuffled Output</label>
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
                  copied ? 'bg-[#10b981] text-white' : 'bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0e17]'
                }`}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <button onClick={shuffle}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#1f2937] text-[#9ca3af] hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all duration-150">
                Shuffle Again
              </button>
              <button onClick={clear}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#1f2937] text-[#9ca3af] hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all duration-150">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* SEO content */}
        <div className="mt-16 mb-16 space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
              What is a Sentence Shuffler?
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              A sentence shuffler takes a list of sentences or lines and rearranges them in a random order using a fair Fisher-Yates algorithm. Every line gets an equal chance of appearing in any position, so the result is truly random. Click Shuffle again for a different arrangement.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Use Cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Shuffling quiz questions to prevent pattern memorization', 'Mixing flashcard prompts for spaced repetition study', 'Randomizing survey question order', 'Creating varied practice exercises from a fixed list', 'Generating random playlist or activity rosters'].map(u => (
                <div key={u} className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 text-xs text-[#9ca3af]">
                  → {u}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#f9fafb] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[['/', 'Word Unscrambler'], ['/word-sorter', 'Word Sorter'], ['/duplicate-remover', 'Duplicate Remover'], ['/case-converter', 'Case Converter']].map(([href, label]) => (
                <a key={href} href={href}
                  className="px-4 py-2 rounded-xl border border-[#1f2937] text-sm text-[#9ca3af] hover:border-[#f59e0b] hover:text-[#f59e0b] transition-all duration-200">
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
