import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";

// Reuse the plugin instances Next already registers in its flat config so we
// can override their rules without re-importing (and without a redefine clash).
const findPlugin = (name) => nextCoreWebVitals.find((c) => c.plugins?.[name])?.plugins[name];
const reactHooks = findPlugin("react-hooks");
const importPlugin = findPlugin("import");

export default [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    plugins: {
      tailwindcss,
      ...(reactHooks ? { "react-hooks": reactHooks } : {}),
      ...(importPlugin ? { import: importPlugin } : {}),
    },
    settings: {
      tailwindcss: {
        callees: ["cn"],
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-key": "off",
      "tailwindcss/no-custom-classname": "off",
      // The React Compiler lint rules below are newly enabled by Next 16's
      // eslint config. They flag pre-existing patterns across the app; demoted
      // to warnings so the deps upgrade isn't blocked. Adopt as errors and fix
      // incrementally in a dedicated follow-up.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-anonymous-default-export": "warn",
    },
  },
];
