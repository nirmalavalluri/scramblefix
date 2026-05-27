import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState, useEffect } from 'react';

const BASE    = 'https://scramblefix.io';
const PUB_ID  = 'ca-pub-1223182832425564';
const SC_META = 'ylM8Cs_qScVCcHf_xd80cJeVOA3JTQLj6cSMRDX2tdY';
const OG_IMG  = `${BASE}/og-image.png`;

export default function Layout({ children, title, description, canonical, noFooter }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('sf_theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sf_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const pageTitle = title
    ? `${title} | ScrambleFix`
    : 'ScrambleFix – Free Word Unscrambler & 60 Text Tools';

  const pageDesc = description ||
    'ScrambleFix: free word unscrambler + 60 text tools — clean, extract, format, encode, generate and AI-process any text. No signup, no server, instant results.';

  const pageUrl = canonical || BASE;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description"           content={pageDesc} />
        <meta name="robots"                content="index, follow" />
        <meta name="google-site-verification" content={SC_META} />
        <link rel="canonical"              href={pageUrl} />
        <meta property="og:type"           content="website" />
        <meta property="og:url"            content={pageUrl} />
        <meta property="og:title"          content={pageTitle} />
        <meta property="og:description"    content={pageDesc} />
        <meta property="og:image"          content={OG_IMG} />
        <meta property="og:site_name"      content="ScrambleFix" />
        <meta name="twitter:card"          content="summary_large_image" />
        <meta name="twitter:title"         content={pageTitle} />
        <meta name="twitter:description"   content={pageDesc} />
        <meta name="twitter:image"         content={OG_IMG} />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap" rel="stylesheet" />
        {/* AdSense */}
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}`} crossOrigin="anonymous" />
      </Head>

      <div className="min-h-screen bg-[#0a0e17] text-[#f9fafb]" style={{ fontFamily:"'DM Sans', sans-serif" }}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main>{children}</main>
        {!noFooter && <Footer />}
      </div>
    </>
  );
}
