/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'header-left-offset': '4rem',
        'header-top-offset': '3.5rem'
      },
    },
  },
  plugins: [],
}