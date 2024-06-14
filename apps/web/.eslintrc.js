/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@loggrr/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "tailwindcss/no-custom-classname": "off",
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
    },
  },
};
