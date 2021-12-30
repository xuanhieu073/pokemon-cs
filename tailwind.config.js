module.exports = {
  // mode: "jit",
  content: ["./src/**/*.{ts,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
