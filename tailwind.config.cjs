const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/stories/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: { light: colors.slate[50], dark: colors.slate[800] },
        backgroundHover: { light: colors.indigo[100] },
        "background-alternate": { light: colors.slate[300], dark: colors.slate[600] },
        content: { light: colors.slate[700], dark: colors.slate[50] },
        info: { light: colors.slate[500], dark: colors.slate[100] },
        brand: {
          light: colors.indigo[600],
          dark: colors.indigo[600],
          "hover-light": colors.indigo[700],
          "hover-dark": colors.indigo[500],
        },
        danger: {
          light: colors.red[600],
          dark: colors.rose[600],
          "hover-light": colors.rose[700],
          "hover-dark": colors.rose[500],
        },
        success: {
          light: colors.green[600],
          dark: colors.emerald[600],
          "hover-light": colors.emerald[700],
          "hover-dark": colors.emerald[500],
        },
        warning: { light: colors.amber[600], dark: colors.amber[600] },
        disabled: { light: colors.slate[300], dark: colors.slate[500] },
        dropdownBg: { 
          light: colors.indigo[50],
          hover: colors.indigo[100] 
        },
        dropdownBorder: {
          light: colors.slate[300],
          selected: colors.indigo[200]
        },
        billable: {
          light: colors.green[700],
          dark: colors.green[500],
          "hover-light": colors.green[700],
          "hover-dark": colors.green[400],
        },
        nonbillable: {
          light: colors.slate[300],
          dark: colors.slate[400],
          "hover-light": colors.slate[500],
          "hover-dark": colors.slate[300],
        },
        ctaBorder: { light: colors.indigo[600], dark: colors.indigo[600] },
        borderColor: { light: colors.slate[400], dark: colors.zinc[700] },
        focusColor: { one: colors.blue[500], two: colors.blue[300] },
        labelBackground: { light: colors.indigo[100] },
        labelContent: { light: colors.indigo[700] },
        transparent: "transparent",
        white: colors.white,
        black: colors.black,
        red: colors.red[600]
      },
      fontFamily: {
        sans: ["var(--font-font)", ...fontFamily.sans],
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
