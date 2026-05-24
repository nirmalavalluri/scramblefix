# ScrambleFix — Cloudflare Pages Deployment

## Project structure

```
scramblefix-nextjs/
├── components/       ← Shared Layout, Navbar, Footer
├── pages/            ← Next.js routes (homepage + 5 tool pages)
├── utils/            ← textUtils.js (shared logic)
├── public/           ← words.js, engine.js, all static HTML pages
├── styles/           ← globals.css (Tailwind + fonts)
├── next.config.js    ← output: 'export' for static build
├── tailwind.config.js
├── wrangler.toml     ← Cloudflare config
└── .nvmrc            ← Node 18
```

## Next.js pages (React)
| Route | File |
|---|---|
| `/` | pages/index.jsx |
| `/word-sorter` | pages/word-sorter.jsx |
| `/sentence-shuffler` | pages/sentence-shuffler.jsx |
| `/duplicate-remover` | pages/duplicate-remover.jsx |
| `/case-converter` | pages/case-converter.jsx |
| `/enhanced-unscrambler` | pages/enhanced-unscrambler.jsx |

## Static HTML pages (served from /public)
All reference pages and game helpers live in public/ and are served directly:
- /scrabble-word-finder.html
- /wordle-helper.html
- /wordle-solver.html
- /wordle-unlimited.html
- /spelling-bee-helper.html
- /boggle-solver.html
- /3-letter-words.html … etc.

---

## Option A — Deploy via GitHub (recommended)

1. Push this folder to a GitHub repo:
   ```
   git init
   git add .
   git commit -m "Initial ScrambleFix build"
   git remote add origin https://github.com/YOUR_USERNAME/scramblefix.git
   git push -u origin main
   ```

2. Go to https://pages.cloudflare.com
3. Click **Create a project → Connect to Git**
4. Select your GitHub repo
5. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node.js version:** `18` (set in Environment variables: NODE_VERSION = 18)
6. Click **Save and Deploy**
7. Add your custom domain: scramblefix.io

---

## Option B — Direct Upload (no GitHub needed)

1. Install dependencies and build locally:
   ```
   npm install
   npm run build
   ```
   This creates an `/out` folder.

2. Go to https://pages.cloudflare.com
3. Click **Create a project → Direct Upload**
4. Upload the `/out` folder
5. Add custom domain: scramblefix.io

---

## Custom domain setup

After deploying, in Cloudflare Pages dashboard:
1. Go to your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `scramblefix.io`
4. If your domain is already on Cloudflare DNS — it auto-configures
5. If not — update your domain's nameservers to Cloudflare's

---

## AdSense slot IDs

When you get real slot IDs, search all files for `YOUR_AD_SLOT` and replace:
```
grep -r "YOUR_AD_SLOT" public/
```
Then redeploy.

---

## GA4

Add your G-XXXXXXXX tracking ID to `components/Layout.jsx`:
```jsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" strategy="afterInteractive" />
<Script id="gtag-init" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
`}</Script>
```
