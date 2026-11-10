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
        dark: {
          950: '#06080F',
          900: '#0E1424',
          850: '#141D33',
          800: '#1E293B',
          700: '#334155',
        },
        brand: {
          purple: '#8B5CF6',
          violet: '#A78BFA',
          cyan: '#38BDF8',
          blue: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
