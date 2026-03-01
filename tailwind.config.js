export default {
  theme: {
    extend: {
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
