import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { TOOLS, CATEGORIES } from '../../utils/toolConfig';

export default function ToolsDirectory() {
  const router  = useRouter();
  const initCat = router.query.category || 'all';
  const [active,  setActive]  = useState(initCat);
  const [search,  setSearch]  = useState('');

  const filtered = TOOLS.filter(t => {
    const matchCat  = active === 'all' || t.category === active;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const CAT_COLORS = { cleaning:'#3b82f6', extraction:'#10b981', formatting:'#8b5cf6', encoding:'#f59e0b', generators:'#ef4444', ai:'#ec4899' };

  return (
    <Layout title="All 60 Text Tools" description="Browse all 60 ScrambleFix text tools — clean, extract, format, encode, generate, and AI-process any text. Free, instant, no signup.">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="pt-10 pb-6 text-center">
          <h1 className="text-4xl font-extrabold text-[#f9fafb] tracking-tight" style={{ fontFamily:"'Syne',sans-serif", letterSpacing:'-1.5px' }}>
            All <em className="not-italic text-[#3b82f6]">60 Tools</em>
          </h1>
          <p className="mt-2 text-[#9ca3af] text-sm max-w-lg mx-auto">
            Clean, extract, format, encode, generate and AI-process any text. Click any tool to start — no signup, no limits.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools…"
            className="flex-1 bg-[#111827] border border-[#1f2937] focus:border-[#3b82f6] rounded-xl px-4 py-2.5 text-sm text-[#f9fafb] placeholder-[#6b7280] outline-none transition-colors" />
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setActive('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active==='all'?'bg-[#3b82f6] border-[#3b82f6] text-white':'border-[#1f2937] text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6]'}`}>
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActive(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active===cat.id?'text-white border-transparent':' text-[#9ca3af] border-[#1f2937] hover:border-opacity-60'}`}
                style={active===cat.id?{background:CAT_COLORS[cat.id], borderColor:CAT_COLORS[cat.id]}:{}}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {search && (
          <p className="text-xs text-[#6b7280] mb-4">{filtered.length} tool{filtered.length!==1?'s':''} match "{search}"</p>
        )}

        {/* Tools grid */}
        {active === 'all' && !search ? (
          // Grouped by category
          CATEGORIES.map(cat => (
            <div key={cat.id} className="mb-10">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-lg">{cat.icon}</span>
                <h2 className="text-sm font-bold text-[#f9fafb] uppercase tracking-widest" style={{ fontFamily:"'Syne',sans-serif" }}>{cat.label}</h2>
                <span className="text-xs text-[#6b7280]">({TOOLS.filter(t=>t.category===cat.id).length})</span>
                <div className="flex-1 h-px bg-[#1f2937]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TOOLS.filter(t => t.category === cat.id).map(tool => (
                  <ToolCard key={tool.slug} tool={tool} color={CAT_COLORS[tool.category]} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat filtered grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {filtered.map(tool => <ToolCard key={tool.slug} tool={tool} color={CAT_COLORS[tool.category]} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ToolCard({ tool, color }) {
  return (
    <Link href={`/tools/${tool.slug}`}
      className="group block bg-[#111827] border border-[#1f2937] rounded-xl p-4 hover:border-opacity-80 transition-all duration-200 hover:-translate-y-0.5"
      style={{ '--hover-color': color }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">{tool.icon}</span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#f9fafb] group-hover:text-[#3b82f6] transition-colors leading-tight" style={{ color: undefined }}>
            {tool.title}
          </h3>
          <p className="text-xs text-[#6b7280] mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}
