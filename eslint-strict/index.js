import eslintReact from "@eslint-react/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";

import base from "../eslint/index.cjs";

// Strict config: the base config plus rules that need type information.
// The project sets parserOptions.projectService (or project).
// This file is an ES module because @eslint-react/eslint-plugin is published
// as an ES module only.
// oxlint-disable-next-line import/no-default-export -- ESLint reads a flat config from the default export
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@eslint-react": eslintReact,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "should", "has", "can", "did", "will"],
        },
        { selector: "typeLike", format: ["PascalCase"] },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: false },
        },
        { selector: "enumMember", format: ["UPPER_CASE"] },
      ],
      // Replaces oxlint's default-case: a `default` in a switch over a union
      // would hide a member added to the union later.
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { requireDefaultForNonUnion: true },
      ],
      // oxlint's rule of the same name runs only with --type-aware.
      "@typescript-eslint/no-floating-promises": "error",
      // Replaces oxlint's require-await, which has a function that returns a
      // Promise drop `async`, after which it can throw instead of rejecting.
      "@typescript-eslint/promise-function-async": "error",
      "@eslint-react/no-leaked-conditional-rendering": "error",
    },
  },
];
