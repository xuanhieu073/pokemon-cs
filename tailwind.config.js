module.exports = {
  // mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.{ts,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
