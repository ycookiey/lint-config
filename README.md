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
