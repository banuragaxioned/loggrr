/** @type {import("prettier").Config} */
module.exports = {
  plugins: [
    require.resolve("@axioned/prettier-config"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
};
