import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { ignores: ["commitlint.config.js"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: pluginReact
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: pluginReact.configs.recommended.rules,
    settings: {
      react: {
        version: "detect"
      }
    }
  }
]);
