import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";

// Reuse the plugin instances Next already registers in its flat config so we
// can override their rules without re-importing (and without a redefine clash).
const findPlugin = (name) => nextCoreWebVitals.find((c) => c.plugins?.[name])?.plugins[name];
const reactHooks = findPlugin("react-hooks");
const importPlugin = findPlugin("import");

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "generated/**"] },
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
      // React Compiler rules (newly enabled by Next 16). These below are clean
      // and enforced as errors. The remaining behavioral ones stay warnings and
      // are being fixed in tested per-file batches.
      "react-hooks/purity": "error",
      "react-hooks/immutability": "error",
      "react-hooks/incompatible-library": "error",
      "import/no-anonymous-default-export": "error",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default config;
