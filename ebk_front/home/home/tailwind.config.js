import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#000000",
            primary: {
              foreground: "#6B7280",
              DEFAULT: "#1F2937",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#FFFFFF",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#1F2937",
            },
          },
        },
      },
    }),
  ],
};

module.exports = config;
