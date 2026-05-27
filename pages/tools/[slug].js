import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ToolShell from '../../components/ToolShell';
import { TOOLS, TOOL_BY_SLUG, TOOLS_BY_CATEGORY, CATEGORIES } from '../../utils/toolConfig';

const BASE = 'https://scramblefix.io';

export default function ToolPage({ slug }) {
  const tool = TOOL_BY_SLUG[slug];
  if (!tool) return <Layout><p className="p-10 text-center text-[#6b7280]">Tool not found.</p></Layout>;

  const cat      = CATEGORIES.find(c => c.id === tool.category);
  const related  = (TOOLS_BY_CATEGORY[tool.category] || []).filter(t => t.slug !== slug).slice(0, 4);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url: `${BASE}/tools/${slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    publisher: { '@type': 'Organization', name: 'ScrambleFix', url: BASE },
  };

  return (
    <Layout
      title={tool.title}
      description={tool.description}
      canonical={`${BASE}/tools/${slug}`}>

      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-5 pt-4">
        <nav className="flex items-center gap-1.5 text-xs text-[#6b7280]">
          <Link href="/" className="hover:text-[#9ca3af]">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#9ca3af]">Tools</Link>
          <span>/</span>
          <Link href={`/tools?category=${tool.category}`} className="hover:text-[#9ca3af]">{cat?.label}</Link>
          <span>/</span>
          <span className="text-[#9ca3af]">{tool.title}</span>
        </nav>
      </div>

      {/* Tool UI */}
      <ToolShell tool={tool} />

      {/* Related tools */}
      {related.length > 0 && (
        <div className="max-w-4xl mx-auto px-5 mb-16">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#6b7280] mb-3">
            More {cat?.id === 'ai' ? 'AI' : cat?.label} tools
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}
                className="flex items-center gap-2 p-3 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-[#9ca3af] hover:text-[#f9fafb] hover:border-[#3b82f6] transition-all duration-150">
                <span className="text-base shrink-0">{t.icon}</span>
                <span className="font-medium leading-tight">{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: TOOLS.map(t => ({ params: { slug: t.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
