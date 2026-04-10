/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          900: "#0f1117",
          800: "#181c27",
          700: "#1e2333",
          600: "#252b3b",
          500: "#2e3547",
        },
        amber: {
          400: "#f59e0b",
          300: "#fcd34d",
        },
        slate: {
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
