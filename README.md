# lint-config

`@ycookiey/lint-config` — oxlint をメインに、ESLint で補完するための共有設定。

## install

```sh
npm i -D @ycookiey/lint-config oxlint eslint typescript
```

oxlint 1.85 以上、ESLint 10 以上、Node.js 22.13 以上が必要。

## oxlint

`.oxlintrc.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@ycookiey/lint-config/oxlint/.oxlintrc.json"],
  "ignorePatterns": ["**/*.d.ts"]
}
```

oxlint (1.85 で確認) の `extends` は、extends した設定の `ignorePatterns` を受け継がない。この設定の `ignorePatterns` (`**/*.d.ts` など) を効かせるには、利用側の設定に書き直す。

### Next.js

追加設定も extends する:

```json
{
  "extends": [
    "./node_modules/@ycookiey/lint-config/oxlint/.oxlintrc.json",
    "./node_modules/@ycookiey/lint-config/oxlint/next/.oxlintrc.json"
  ]
}
```

## ESLint

`eslint.config.mjs` (Flat Config):

```js
import lintConfig from '@ycookiey/lint-config/eslint';
export default [
  ...lintConfig,
  // 必要に応じてプロジェクト固有 override
];
```

test file (`*.test.*`・`*.spec.*`・`__tests__/`・`test-utils/`・`tests/` の下) では、`it` / `test` に渡す関数を 80 行 (空行とコメントだけの行を除く) までに制限する (`@ycookiey/max-test-case-lines`)。`describe` の長さは制限しない。

### Strict 版 (opt-in)

型情報を要する rule を足した版。ES module なので `import` で読む (CommonJS から `require` すると `.default` に入る)。

```js
import lintConfig from '@ycookiey/lint-config/eslint-strict';
export default [
  ...lintConfig,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
];
```

足している rule:

| rule | 内容 |
|---|---|
| `@typescript-eslint/naming-convention` | boolean の変数に `is`/`should`/`has`/`can`/`did`/`will` を求める、interface に `I` を付けない、など |
| `@typescript-eslint/switch-exhaustiveness-check` | union の switch は網羅を型で確かめ、union でない switch には `default` を求める (`requireDefaultForNonUnion`) |
| `@typescript-eslint/no-floating-promises` | `await` も `catch` もしない Promise を禁止 |
| `@typescript-eslint/promise-function-async` | Promise を返す関数は `async` にする (失敗を必ず reject で返す) |
| `@eslint-react/no-leaked-conditional-rendering` | `&&` の左側が数などで、画面に `0` などが漏れうる条件付き表示を禁止 (型情報で判定。boolean は指摘しない) |

## 3.0.0 の変更点

型情報を使う検査を Strict 版に寄せ、test で目的と食い違っていた制限を直した。指摘が増えるので major にした。

- Strict 版を ES module にした (`@eslint-react/eslint-plugin` が ES module のみのため)。Node.js 22.13 以上が必要
- oxlint の `default-case` を off にし、Strict 版の `switch-exhaustiveness-check` で見る。union の switch に `default` を足させると、union に値が増えたときに型で気づけなくなる
- oxlint の `typescript/no-floating-promises` を外し、Strict 版で見る。oxlint の同名 rule は `--type-aware` なしでは動かない
- oxlint の `require-await` を off にし、Strict 版の `promise-function-async` で見る。`require-await` は Promise を返す約束の関数から `async` を外させ、同期の例外を許す向きに働く。`await` の付け忘れは `no-floating-promises` が見る
- Strict 版に `@eslint-react/no-leaked-conditional-rendering` を足した (`eslint-plugin-react` が ESLint 10 に対応せず外れた `react/jsx-no-leaked-render` の代わり)
- oxlint で、eslint:recommended などの推奨設定にあった次の rule を有効にした: `no-array-constructor`・`no-case-declarations`・`no-empty`・`no-fallthrough`・`no-inner-declarations`・`no-prototype-builtins`・`no-regex-spaces`・`prefer-rest-params`・`typescript/no-empty-object-type`・`typescript/no-namespace`・`typescript/no-require-imports` (`*.cjs` では off)・`typescript/no-unsafe-function-type`・`react/display-name`・`react/jsx-no-target-blank`・`react/no-unescaped-entities`・`react/no-unknown-property`
- oxlint の `react/memo-dependencies`・`react/exhaustive-effect-dependencies` を off にした。ESLint の `react-hooks/exhaustive-deps` と同じものを見て、二重に指摘していた
- test file の対象に `test-utils/`・`tests/` の下を足した (oxlint・ESLint とも)
- test file では oxlint の `max-lines-per-function` を off にし、ESLint の `@ycookiey/max-test-case-lines` で `it` / `test` に渡す関数だけを制限する。test file では `max-lines` を off にしているのに、`max-lines-per-function` が `describe` の長さを制限していた
- test file では oxlint の `max-nested-callbacks` を 4 にした (`describe` 2 段、`it`、その中の関数 1 段)。3 では `describe` の入れ子と、`it` の中で関数を渡すこと (`expect(() => …)` など) が両立しなかった
