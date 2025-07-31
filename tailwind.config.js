/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          turquoise: "#00C4B3",
          purple: "#8453E3",
          coral: "#FF6C5C",
          gold: "#FFD166",
          blue: "#60a5fa",
          pink: "#f472b6"
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
      },
      animation: {
        wiggle: "wiggle 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};