/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — generates /out directory
  // Required for Cloudflare Pages deployment
  output: 'export',

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Trailing slash — cleaner URLs on Cloudflare Pages
  trailingSlash: false,

  // Keep .html extension pages accessible from /public
  // These are your reference pages, game helpers etc.
};

module.exports = nextConfig;
