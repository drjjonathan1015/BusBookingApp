/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'selector', // For Tailwind v4, use 'selector' instead of 'class'
  theme: {
    extend: {},
  },
  plugins: [],
}