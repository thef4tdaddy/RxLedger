/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Dark mode color palette
      colors: {
        dark: {
          bg: '#0f172a',      // slate-900
          surface: '#1e293b',  // slate-800
          card: '#334155',     // slate-700
          border: '#475569',   // slate-600
          text: '#f1f5f9',     // slate-100
          'text-secondary': '#cbd5e1', // slate-300
          accent: '#3b82f6',   // blue-500
        }
      }
    },
  },
  plugins: [],
};
