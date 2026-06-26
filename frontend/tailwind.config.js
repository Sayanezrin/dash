/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        line: "#D7DEE8",
        paper: "#F7F9FB",
        brand: "#1F766E",
        accent: "#D97706"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};
