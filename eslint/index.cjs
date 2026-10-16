const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const ownPlugin = require("./plugin/index.cjs");

const TEST_FILES = [
  "**/*.test.{ts,tsx,js,jsx}",
  "**/*.spec.{ts,tsx,js,jsx}",
  "**/__tests__/**/*.{ts,tsx,js,jsx}",
  "**/test-utils/**/*.{ts,tsx,js,jsx}",
  "**/tests/**/*.{ts,tsx,js,jsx}",
];

// Base config: only rules that work without type information, so a project
// can adopt it without setting up a TypeScript project. Rules that need type
// information are in `./eslint-strict`.
// Hooks use eslint-plugin-react-hooks' recommended rules as they are (they
// include the React Compiler checks); oxlint's rules of the same names are off
// so that a finding is not reported twice. eslint-plugin-react is not used,
// since it cannot be installed with ESLint 10; components are checked by
// oxlint's react rules instead.
module.exports = [
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooksPlugin,
      "simple-import-sort": simpleImportSort,
      "@ycookiey": ownPlugin,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      ...reactHooksPlugin.configs.recommended.rules,
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1, 2, 100, 1000],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
        },
      ],
    },
  },
  // Test files allow magic numbers, as the oxlint config does: giving every
  // expected value and fixture number a named constant makes tests harder to
  // read. oxlint's max-lines-per-function is off for test files because it
  // also measures `describe`; max-test-case-lines limits only the function
  // given to `it` / `test`.
  {
    files: TEST_FILES,
    rules: {
      "@typescript-eslint/no-magic-numbers": "off",
      "@ycookiey/max-test-case-lines": [
        "error",
        { max: 80, skipBlankLines: true, skipComments: true },
      ],
    },
  },
];
