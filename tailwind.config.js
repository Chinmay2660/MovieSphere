/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030C06',
        text: '#EFF4F0',
        primary: '#5B3FD2',
        secondary: '#72757E',
        accent: '#2CB67D',
      },
    },
  },
  plugins: [],
}