/**
 * ProFeatures.js — Locked Pro features teaser
 * Shows 3 locked features relevant to the tool category.
 * Clicking "Unlock" scrolls to the Pro teaser or opens a waitlist.
 */

const FEATURES = {
  cleaning: [
    { icon: '⚡', label: 'Batch clean 10,000+ lines', desc: 'Process entire files in one click' },
    { icon: '📄', label: 'Export to CSV / PDF', desc: 'Download cleaned text in any format' },
    { icon: '🔁', label: 'Scheduled auto-clean', desc: 'Set up recurring cleaning jobs via API' },
  ],
  extraction: [
    { icon: '🌐', label: 'Extract from 50+ URLs at once', desc: 'Bulk URL scraping and extraction' },
    { icon: '📊', label: 'Export to spreadsheet', desc: 'One-click Google Sheets / Excel export' },
    { icon: '🔧', label: 'Custom regex patterns', desc: 'Build your own extraction rules' },
  ],
  formatting: [
    { icon: '📁', label: 'Process entire documents', desc: 'Format .txt, .docx, .md files in bulk' },
    { icon: '🎨', label: 'Custom formatting templates', desc: 'Save and reuse your preferred format' },
    { icon: '🔌', label: 'API access', desc: 'Automate formatting in your workflow' },
  ],
  encoding: [
    { icon: '🗂️', label: 'Encode entire codebases', desc: 'Batch encode files and directories' },
    { icon: '🔒', label: 'Custom cipher support', desc: 'AES, RSA and custom algorithms' },
    { icon: '⚙️', label: 'CLI tool access', desc: 'Use ScrambleFix from the terminal' },
  ],
  generators: [
    { icon: '🏭', label: 'Generate 10,000+ in bulk', desc: 'Mass generation with one click' },
    { icon: '🌱', label: 'Seed-based generation', desc: 'Reproducible results with custom seeds' },
    { icon: '📋', label: 'Custom word lists', desc: 'Upload your own dictionaries and patterns' },
  ],
  ai: [
    { icon: '♾️', label: 'Unlimited AI operations', desc: 'No daily limits, no throttling' },
    { icon: '🎭', label: 'Custom AI personas', desc: 'Build your own writing styles and tones' },
    { icon: '🔌', label: 'API access', desc: 'Call ScrambleFix AI from your app' },
  ],
};

export default function ProFeatures({ category }) {
  const features = FEATURES[category] || FEATURES.formatting;

  return (
    <div className="mt-5 rounded-xl border border-[#1f2937] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0d1117] border-b border-[#1f2937] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔒</span>
          <p className="text-xs font-semibold text-[#f9fafb]">Pro features</p>
        </div>
        <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
          style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', color:'#fff' }}>
          PRO
        </span>
      </div>

      {/* Locked features */}
      <div className="bg-[#0a0e17] divide-y divide-[#1f2937]">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 opacity-60">
            <span className="text-base shrink-0">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#f9fafb] leading-tight">{f.label}</p>
              <p className="text-[0.68rem] text-[#6b7280] mt-0.5">{f.desc}</p>
            </div>
            <span className="text-[#4b5563] shrink-0">🔒</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 py-3 bg-[#0d1117] border-t border-[#1f2937]">
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="w-full py-2 rounded-lg text-xs font-semibold text-[#c4b5fd] border border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all duration-200">
          Unlock with ScrambleFix Pro →
        </button>
      </div>
    </div>
  );
}
