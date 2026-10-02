/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          obsidian: '#070709',
          surface: '#0d0d12',
          card: '#121218',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(255, 255, 255, 0.16)',
          accent: '#2997ff',
          indigo: '#5e5ce6',
          emerald: '#30d158',
          amber: '#ffd60a',
          rose: '#ff453a',
          text: '#f5f5f7',
          muted: '#86868b',
          dim: '#48484a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        widest: '0.18em',
      },
      boxShadow: {
        'apple-card': '0 0 0 1px rgba(255, 255, 255, 0.07), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'apple-glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 10px 30px -10px rgba(0, 0, 0, 0.8)',
        'apple-focus': '0 0 0 2px #2997ff, 0 0 0 4px rgba(0, 0, 0, 0.9)',
        'glow-cyan': '0 0 60px -15px rgba(41, 151, 255, 0.25)',
      },
    },
  },
  plugins: [],
};