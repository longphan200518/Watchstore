/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        secondary: '#F59E0B',
        accent: '#EF4444',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
