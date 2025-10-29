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
  // Replacing "configs.recommended" with "strict"+"stylistic" is a
  //  recommended change from the typescript-eslint docs
  //  https://typescript-eslint.io/getting-started/#additional-configs
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  // Required to enable typed linting
  //  https://typescript-eslint.io/getting-started/typed-linting
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
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
