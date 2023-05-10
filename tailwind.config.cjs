const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/stories/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Path to the tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-bg": 'rgb(var(--main-bg) / 1)',
        "element-bg": 'rgb(var(--element-bg) / 1)',
        "secondary-element-bg": 'rgb(var(--secondary-element-bg) / 1)',
        "border-color": 'rgb(var(--border-color) / 1)',
        "text-placeholder": 'rgb(var(--text-placeholder) / 1)',
        "text-color": 'rgb(var(--text-color) / 1)',
        brand: 'rgb(var(--brand) / 1)',
        hover: 'rgb(var(--hover) / 1)',
      },
      fontFamily: {
        sans: ["var(--font-primary)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // @ts-ignore
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
};