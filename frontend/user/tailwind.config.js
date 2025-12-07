/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Luxury Color Palette
        luxury: {
          black: "#0A0A0A",
          "black-light": "#1A1A1A",
          "black-lighter": "#2A2A2A",
          white: "#FFFFFF",
          "white-dark": "#F8F8F8",
          gold: "#D4AF37",
          "gold-dark": "#B8941F",
          platinum: "#C0C0C0",
          "platinum-light": "#E3E3E3",
          brown: "#4E3B31",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "Helvetica Neue", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        160: "40rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        zoom: "zoom 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        zoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
