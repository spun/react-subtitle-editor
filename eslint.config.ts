import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  pluginReact.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off"
    },
    // Fix "Warning: React version not specified"
    settings: {
      react: {
        version: "detect"
      }
    }
  }
]);
