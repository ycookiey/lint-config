# lint-config

`@ycookiey/lint-config` — oxlint をメインに、ESLint で補完するための共有設定。

## install

```sh
npm i -D @ycookiey/lint-config oxlint eslint typescript
```

oxlint 1.85 以上、ESLint 10 以上が必要。

## oxlint

`.oxlintrc.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@ycookiey/lint-config/oxlint/.oxlintrc.json"]
}
```

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

### Strict 版 (opt-in)

型情報要求の `@typescript-eslint/naming-convention` (boolean prefix 強制等) を有効化したい場合:

```js
import lintConfig from '@ycookiey/lint-config/eslint-strict';
export default [
  ...lintConfig,
  // parserOptions.project の設定が別途必要 (monorepo 等では重い)
];
```
