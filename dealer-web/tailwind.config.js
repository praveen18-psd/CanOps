/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e8f4fd',
          100: '#c6e3f9',
          200: '#9fd0f5',
          300: '#70b8ef',
          400: '#46a3ea',
          500: '#1a8fe0',
          600: '#1478bf',
          700: '#0e5f9e',
          800: '#094880',
          900: '#053365',
        },
      },
    },
  },
  plugins: [],
}

