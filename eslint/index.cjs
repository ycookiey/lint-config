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

// Base config (v1.1.0 以降): naming-convention のような型情報要求 rule は
// `./eslint-strict` で opt-in 提供。ここではプロジェクト導入時の摩擦が
// 少ない rule のみ default で error。
// v2.0.0: hooks は eslint-plugin-react-hooks v7 の recommended をそのまま使う
// (React Compiler 由来の検査を含む公式実装)。oxlint 側の同名 rule は off に
// して二重指摘を避ける。コンポーネントをアロー関数で書く規則は oxlint の
// react/function-component-definition に移した (eslint-plugin-react は
// ESLint 10 と同時に install できない)。
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
  // test override: テストファイルでは magic number を許容 (oxlint preset と同方針)。
  // テストは expected 値や fixture 数字を多用するため、命名強制は逆に可読性を損なう。
  // v3.0.0: oxlint の max-lines-per-function は test では off にした (describe の
  // 長さを測ってしまうため)。代わりに it / test に渡す関数だけを 80 行に制限する。
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
