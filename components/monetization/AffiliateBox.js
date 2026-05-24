/**
 * AffiliateBox.js — Category-aware affiliate recommendations
 * Replace YOUR_AFFILIATE_LINK with real affiliate URLs.
 * Each category shows 2 relevant tools/products.
 */

const AFFILIATES = {
  cleaning: [
    { name: 'Grammarly', desc: 'AI grammar & spelling checker used by 30M+ writers.', badge: 'Most Popular', url: 'YOUR_AFFILIATE_LINK', icon: '✍️' },
    { name: 'ProWritingAid', desc: 'In-depth writing reports, style suggestions, and readability scores.', badge: 'Editor\'s Pick', url: 'YOUR_AFFILIATE_LINK', icon: '📝' },
  ],
  extraction: [
    { name: 'Ahrefs', desc: 'SEO toolset — keyword research, backlink analysis, rank tracking.', badge: 'SEO #1', url: 'YOUR_AFFILIATE_LINK', icon: '📊' },
    { name: 'Hunter.io', desc: 'Find and verify professional email addresses in seconds.', badge: 'Lead Gen', url: 'YOUR_AFFILIATE_LINK', icon: '🔍' },
  ],
  formatting: [
    { name: 'Notion', desc: 'All-in-one workspace for notes, docs, and project management.', badge: 'Productivity', url: 'YOUR_AFFILIATE_LINK', icon: '📋' },
    { name: 'Typefully', desc: 'Write, schedule and publish Twitter threads and posts.', badge: 'Content', url: 'YOUR_AFFILIATE_LINK', icon: '🐦' },
  ],
  encoding: [
    { name: 'DevUtils', desc: 'Developer utilities app — JSON, Base64, JWT, regex and more.', badge: 'Dev Tool', url: 'YOUR_AFFILIATE_LINK', icon: '⚙️' },
    { name: 'Postman', desc: 'API platform for building, testing and documenting APIs.', badge: 'API', url: 'YOUR_AFFILIATE_LINK', icon: '🚀' },
  ],
  generators: [
    { name: 'Copy.ai', desc: 'AI-powered copywriting — ads, emails, blogs in seconds.', badge: 'AI Writing', url: 'YOUR_AFFILIATE_LINK', icon: '🤖' },
    { name: 'Namelix', desc: 'AI business name generator — brandable names with logos.', badge: 'Branding', url: 'YOUR_AFFILIATE_LINK', icon: '💡' },
  ],
  ai: [
    { name: 'Claude Pro', desc: 'Anthropic\'s most capable AI — longer context, priority access.', badge: 'Recommended', url: 'https://claude.ai/upgrade', icon: '✨' },
    { name: 'Jasper', desc: 'AI writing assistant for marketing teams and content creators.', badge: 'Marketing', url: 'YOUR_AFFILIATE_LINK', icon: '📣' },
  ],
};

export default function AffiliateBox({ category }) {
  const items = AFFILIATES[category];
  if (!items) return null;

  return (
    <div className="mt-5 rounded-xl border border-[#1f2937] bg-[#0d1117] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[#1f2937] flex items-center justify-between">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#4b5563]">
          Sponsored tools
        </p>
        <p className="text-[0.6rem] text-[#374151]">Affiliate links</p>
      </div>

      {/* Items */}
      <div className="divide-y divide-[#1f2937]">
        {items.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 px-4 py-3 hover:bg-[#111827] transition-colors group">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-[#f9fafb] group-hover:text-[#3b82f6] transition-colors">
                  {item.name}
                </span>
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-[#1f2937] text-[#6b7280]">
                  {item.badge}
                </span>
              </div>
              <p className="text-[0.7rem] text-[#6b7280] leading-snug line-clamp-1">{item.desc}</p>
            </div>
            <span className="text-[#3b82f6] text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
