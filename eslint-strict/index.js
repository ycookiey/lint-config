import eslintReact from "@eslint-react/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";

import base from "../eslint/index.cjs";

// Strict 版 (v1.1.0 以降の opt-in): base に加えて型情報要求の rule を有効化。
// parserOptions.projectService (または project) の設定が別途必要。
// v3.0.0: ES module にした (@eslint-react/eslint-plugin が ES module のみのため)。
// 型情報を使う次の rule を足した。
// - naming-convention: boolean の変数に is/should/has/can/did/will を求める
// - switch-exhaustiveness-check: union の switch は網羅を型で確かめ、
//   union でない switch には default を求める (oxlint の default-case の代わり。
//   union の switch に default を足すと、union に値が増えたときに型で気づけない)
// - no-floating-promises: await も catch もしない Promise を禁止
//   (oxlint の同名 rule は --type-aware なしでは動かないので、こちらで見る)
// - promise-function-async: Promise を返す関数は async にし、失敗を必ず reject で
//   返す (oxlint の require-await の代わり。require-await は async を外させ、
//   同期の例外を許す向きに働く)
// - @eslint-react/no-leaked-conditional-rendering: `&&` の左側が数などで
//   画面に漏れうる条件付き表示を禁止
// oxlint-disable-next-line import/no-default-export
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
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { requireDefaultForNonUnion: true },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@eslint-react/no-leaked-conditional-rendering": "error",
    },
  },
];
