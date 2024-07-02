import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "geist-black": ["Geist Black", "sans-serif"],
        "geist-bold": ["Geist Bold", "sans-serif"],
        "geist-light": ["Geist Light", "sans-serif"],
        "geist-medium": ["Geist Medium", "sans-serif"],
        "geist-regular": ["Geist Regular", "sans-serif"],
        "geist-semibold": ["Geist Semibold", "sans-serif"],
        "geist-thin": ["Geist Thin", "sans-serif"],
        "geist-ultrablack": ["Geist UltraBlack", "sans-serif"],
        "geist-ultralight": ["Geist UltraLight", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
