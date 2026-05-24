import Link from 'next/link';
import { CATEGORIES } from '../utils/toolConfig';

export default function Footer() {
  return (
    <footer className="border-t border-[#1f2937] bg-[#0d1117] mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {CATEGORIES.map(cat => (
            <div key={cat.id}>
              <Link href={`/tools?category=${cat.id}`}
                className="text-xs font-semibold text-[#f9fafb] hover:text-[#3b82f6] transition-colors flex items-center gap-1.5 mb-2">
                <span>{cat.icon}</span>{cat.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1f2937] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-[#6b7280]">
            {/* <Link href="/pricing" className="hover:text-[#9ca3af] transition-colors font-semibold text-[#a78bfa]">Pro ⚡</Link> */}
            <Link href="/about.html"   className="hover:text-[#9ca3af] transition-colors">About</Link>
            <Link href="/privacy.html" className="hover:text-[#9ca3af] transition-colors">Privacy</Link>
            <Link href="/terms.html"   className="hover:text-[#9ca3af] transition-colors">Terms</Link>
            <Link href="/contact.html" className="hover:text-[#9ca3af] transition-colors">Contact</Link>
            <Link href="/embed"        className="hover:text-[#9ca3af] transition-colors">Embed</Link>
          </div>
          <p className="text-[0.7rem] text-[#6b7280] text-center sm:text-right">
            © {new Date().getFullYear()} ScrambleFix · Not affiliated with Scrabble®, Wordle®, or Words With Friends®
          </p>
        </div>
      </div>
    </footer>
  );
}
