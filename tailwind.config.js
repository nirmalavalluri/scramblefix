/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sf-bg':      '#0a0e17',
        'sf-surface': '#111827',
        'sf-border':  '#1f2937',
        'sf-accent':  '#3b82f6',
        'sf-green':   '#10b981',
        'sf-muted':   '#6b7280',
        'sf-soft':    '#9ca3af',
        'sf-tile':    '#1e293b',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
