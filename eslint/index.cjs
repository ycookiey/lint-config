const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

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
      react: reactPlugin,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: { version: "detect" },
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
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
        },
      ],
    },
  },
];
