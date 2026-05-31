// ============================================================
// FILE: pages/index.jsx
// ACTION: Add this <Head> block inside your existing component.
// Import Head at the top if not already imported:
//   import Head from 'next/head';
// ============================================================

// Paste this <Head> block at the top of your return(), before your main content:

<Head>
  {/* ── TITLE & META ── */}
  <title>Word Unscrambler — Free Online Unscrambler | ScrambleFix</title>
  <meta name="description" content="Unscramble any word instantly with ScrambleFix. Free word unscrambler for Scrabble, Wordle, Words With Friends and more. Plus 60+ free text tools. No login required." />
  <link rel="canonical" href="https://scramblefix.io/" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="ScrambleFix" />

  {/* ── OPEN GRAPH ── */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="ScrambleFix — Free Word Unscrambler & 60 Text Tools" />
  <meta property="og:description" content="Instantly unscramble words and letters. Free tools for Scrabble, Wordle, text conversion, and more. No login required." />
  <meta property="og:url" content="https://scramblefix.io/" />
  <meta property="og:image" content="https://scramblefix.io/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="ScrambleFix" />

  {/* ── TWITTER CARD ── */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ScrambleFix — Free Word Unscrambler & 60 Text Tools" />
  <meta name="twitter:description" content="Instantly unscramble words and letters. Free tools for Scrabble, Wordle, text conversion, and more." />
  <meta name="twitter:image" content="https://scramblefix.io/og-image.png" />

  {/* ── SCHEMA: WebSite (enables Google Sitelinks Search Box) ── */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ScrambleFix",
    "url": "https://scramblefix.io",
    "description": "Free word unscrambler and 60 text tools for word games and text processing.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://scramblefix.io/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  })}} />

  {/* ── SCHEMA: Organization ── */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ScrambleFix",
    "url": "https://scramblefix.io",
    "logo": "https://scramblefix.io/logo.png"
  })}} />

  {/* ── SCHEMA: SoftwareApplication (for the unscrambler tool itself) ── */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Word Unscrambler",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": "Free word unscrambler. Enter scrambled letters and instantly find all valid words for Scrabble, Wordle, Words With Friends, and more.",
    "url": "https://scramblefix.io/"
  })}} />

  {/* ── SCHEMA: FAQPage ── */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the word unscrambler work?",
        "acceptedAnswer": { "@type": "Answer", "text": "Enter your scrambled letters into the box and ScrambleFix instantly finds all valid words that can be made from those letters, sorted by length and Scrabble score." }
      },
      {
        "@type": "Question",
        "name": "Can I use ScrambleFix for Scrabble and Wordle?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. ScrambleFix works with Scrabble (TWL & SOWPODS dictionaries), Wordle, Words With Friends, Boggle, Spelling Bee, and all major word games." }
      },
      {
        "@type": "Question",
        "name": "Is ScrambleFix free to use?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No login, no account, no limits. All 60+ tools on ScrambleFix are free to use directly in your browser." }
      },
      {
        "@type": "Question",
        "name": "Can I use wildcards or blank tiles?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Use ? or * to represent a blank tile. For example, entering 'scr?mble' will find words that fit that pattern." }
      }
    ]
  })}} />
</Head>
