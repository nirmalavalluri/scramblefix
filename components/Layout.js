// ============================================================
// FILE: components/Layout.jsx
// ACTION: Replace your existing Layout.jsx with this version.
// Replace G-XXXXXXXX with your real GA4 Measurement ID.
// ============================================================

import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';

export default function Layout({ children, title, description, canonical }) {
  return (
    <>
      <Head>
        {/* ── SHARED DEFAULTS (overridden per-page via individual <Head> blocks) ── */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Default fallback title/description (each page overrides these) */}
        <title>{title || 'ScrambleFix — Free Word Unscrambler & 60 Text Tools'}</title>
        <meta name="description" content={description || 'Free word unscrambler and 60 text tools. Unscramble words for Scrabble, Wordle, Words With Friends and more. No login required.'} />
        {canonical && <link rel="canonical" href={canonical} />}

        {/* Default OG image shared across all pages */}
        <meta property="og:image" content="https://scramblefix.io/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ScrambleFix" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://scramblefix.io/og-image.png" />

        {/* Revisit */}
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="ScrambleFix" />
      </Head>

      {/* ── GA4 — replace G-XXXXXXXX with your real Measurement ID ── */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXX');
      `}</Script>

      {/* ── NAVBAR ── */}
      <header style={{ background: '#1e1b4b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', textDecoration: 'none' }}>
          🔤 ScrambleFix
        </Link>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link href="/" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: '0.9rem' }}>Unscrambler</Link>
          <Link href="/enhanced-unscrambler/" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: '0.9rem' }}>Enhanced</Link>
          <Link href="/scrabble-word-finder" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: '0.9rem' }}>Scrabble</Link>
          <Link href="/wordle-helper" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: '0.9rem' }}>Wordle</Link>
          <Link href="/case-converter/" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: '0.9rem' }}>Text Tools</Link>
        </nav>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main>{children}</main>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f0e2a', color: '#a5b4fc', padding: '40px 24px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>

          <div>
            <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700 }}>🎮 Word Game Tools</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Word Unscrambler</a></li>
              <li><a href="/enhanced-unscrambler/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Enhanced Unscrambler</a></li>
              <li><a href="/scrabble-word-finder" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Scrabble Word Finder</a></li>
              <li><a href="/wordle-helper" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Wordle Helper</a></li>
              <li><a href="/wordle-solver" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Wordle Solver</a></li>
              <li><a href="/spelling-bee-helper" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Spelling Bee Helper</a></li>
              <li><a href="/boggle-solver" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Boggle Solver</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700 }}>✍️ Text Tools</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="/case-converter/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Case Converter</a></li>
              <li><a href="/word-sorter/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Word Sorter</a></li>
              <li><a href="/duplicate-remover/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Duplicate Remover</a></li>
              <li><a href="/sentence-shuffler/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Sentence Shuffler</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700 }}>📖 Reference</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="/3-letter-words" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>3-Letter Words</a></li>
              <li><a href="/wordle-unlimited" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.875rem' }}>Wordle Unlimited</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 700 }}>ScrambleFix</h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.6' }}>
              Free word unscrambler and 60+ text tools for word games and everyday text tasks.
              No login required.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '12px' }}>
              © {new Date().getFullYear()} ScrambleFix. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
