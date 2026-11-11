/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          600: '#1e3a8a',
          700: '#1e3a8a',
          800: '#1e2d5a',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}

