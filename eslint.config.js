import pluginJs from "@eslint/js";
import airbnbBase from "eslint-config-airbnb-base";
import configPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginJest from "eslint-plugin-jest";
import pluginPrettier from "eslint-plugin-prettier";
import pluginSecurity from "eslint-plugin-security";
import globals from "globals";

export default [
  {
    files: ["**/*.{mjs,cjs,js}"]
  },
  pluginJs.configs.recommended,
  pluginSecurity.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 2021
    },

    plugins: {
      jest: pluginJest,
      security: pluginSecurity,
      prettier: pluginPrettier,
      import: pluginImport
    },

    rules: {
      // Base rules
      ...airbnbBase.rules,
      ...configPrettier.rules,

      // Jest rules
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",

      // Import rules
      "import/order": [
        "error",
        {
          groups: [["builtin"], ["external"], ["internal"], ["parent", "sibling", "index"]],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      "import/no-duplicates": "error",

      // Include Prettier
      "prettier/prettier": ["error"],

      // Security Plugins
      "security/detect-object-injection": "off",

      // General rules
      "prefer-const": ["error"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["error"],
      "no-unused-expressions": ["error"],
      quotes: ["error", "double"],
      camelcase: ["error", { properties: "always" }]
    }
  }
];
