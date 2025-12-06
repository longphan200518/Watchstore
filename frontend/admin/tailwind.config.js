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
        secondary: '#3B82F6',
        accent: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
