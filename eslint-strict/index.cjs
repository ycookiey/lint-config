const base = require("../eslint/index.cjs");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

// Strict 版 (v1.1.0 以降の opt-in): base に加えて型情報要求の
// naming-convention (boolean prefix is/should/has/can/did/will 強制) を有効化。
// parserOptions.project の設定が別途必要なため、monorepo 等で重い場合は
// 引き続き ./eslint (base) を使うこと。
module.exports = [
  ...base,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
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
    },
  },
];
