export default {
  theme: {
    extend: {
      screens: {
        // Mobile Portrait (default, no prefix needed)
        // Mobile Landscape
        "mobile-ls": "480px",

        // Tablet Portrait
        "tablet-pt": "768px",

        // Tablet Landscape / Small Laptops
        "tablet-ls": "1024px",

        // Desktop / Standard Laptops
        desktop: "1280px",

        // Large Desktop
        "desktop-lg": "1536px",
      },
      colors: {
        charcoal: "#1A1A1A", // background
        gold: "#D4AF37", // highlights
        cream: "#F5F1E8", // text
        amber: "#C47E2C", // accents
        deepgreen: "#1C2B22", // distillery banner
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        body: ["'Libre Baskerville'", "serif"],
      },
      letterSpacing: {
        widest: ".25em",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
