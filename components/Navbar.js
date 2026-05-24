import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CATEGORIES } from '../utils/toolConfig';

const NAV_LINKS = [
  { label: 'Unscrambler', href: '/' },
  { label: 'All Tools',   href: '/tools' },
  // { label: '⚡ Pro', href: '/pricing' }, // ← unhide when Stripe is ready
];

export default function Navbar() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117] border-b border-[#1f2937]" style={{ backdropFilter:'blur(12px)', background:'rgba(13,17,23,0.95)' }}>
      <div className="max-w-6xl mx-auto px-5">
        {/* Top row */}
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="font-extrabold text-xl tracking-tight text-[#f9fafb] shrink-0"
            style={{ fontFamily:"'Syne', sans-serif", letterSpacing:'-1px' }}>
            Scramble<span className="text-[#3b82f6]">Fix</span>
          </Link>

          {/* Main nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                    active ? 'bg-[#3b82f6] text-white' : 'text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#1f2937]'
                  }`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(o => !o)}
            className="sm:hidden p-2 text-[#9ca3af] hover:text-[#f9fafb]" aria-label="Menu">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>

        {/* Category pills row */}
        <div className="hidden sm:flex gap-1.5 pb-2.5 flex-wrap">
          {CATEGORIES.map(cat => {
            const active = pathname.startsWith(`/tools`) && typeof window !== 'undefined' && window.location.search.includes(cat.id);
            return (
              <Link key={cat.id} href={`/tools?category=${cat.id}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1f2937] text-[0.7rem] font-semibold text-[#9ca3af] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all duration-150 whitespace-nowrap">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden pb-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[#9ca3af] hover:text-[#f9fafb] hover:bg-[#1f2937]">
                {label}
              </Link>
            ))}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <Link key={cat.id} href={`/tools?category=${cat.id}`} onClick={() => setOpen(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#1f2937] text-[0.68rem] font-semibold text-[#9ca3af]">
                  {cat.icon} {cat.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
