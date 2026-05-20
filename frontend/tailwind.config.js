import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"Inter"', "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          ...daisyUIThemes["light"],
          primary: "#059669",
          "primary-content": "#ffffff",
          secondary: "#0f172a",
          accent: "#f59e0b",
          neutral: "#0f172a",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
        },
      },
      "light",
    ],
  },
};
