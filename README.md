# lint-config

`@ycookiey/lint-config` — a shared lint config for TypeScript and React that uses oxlint as the main linter and ESLint for the rules oxlint does not have.

## Install

```sh
npm i -D @ycookiey/lint-config oxlint eslint typescript@6
```

Requires oxlint 1.85 or later, ESLint 10 or later, TypeScript 5 or 6.0, and Node.js 22.13 or later. TypeScript 7 does not work, as typescript-eslint, which the ESLint config uses, does not support it.

## oxlint

`.oxlintrc.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@ycookiey/lint-config/oxlint/.oxlintrc.json"],
  "ignorePatterns": ["**/*.d.ts"]
}
```

oxlint's `extends` does not carry over the `ignorePatterns` of the extended config (checked with oxlint 1.85). To keep this config's ignore patterns, such as `**/*.d.ts`, repeat them in your own config.

### Next.js

Add the Next.js config to `extends`:

```json
{
  "extends": [
    "./node_modules/@ycookiey/lint-config/oxlint/.oxlintrc.json",
    "./node_modules/@ycookiey/lint-config/oxlint/next/.oxlintrc.json"
  ]
}
```

## ESLint

`eslint.config.mjs` (flat config):

```js
import lintConfig from '@ycookiey/lint-config/eslint';
export default [
  ...lintConfig,
  // your project's overrides
];
```

In test files (`.ts`, `.tsx`, `.js` and `.jsx` files named `*.test.*` or `*.spec.*`, or under `__tests__/`, `test-utils/` or `tests/`), the function passed to `it` / `test` is limited to 80 lines, not counting blank lines and comment-only lines (`@ycookiey/max-test-case-lines`). The length of a `describe` is not limited.

### Strict config (opt-in)

The base config plus rules that need type information. It is an ES module, so load it with `import`. When loaded with `require` from CommonJS, the config is in `.default`.

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

Rules it adds:

| rule | what it checks |
|---|---|
| `@typescript-eslint/naming-convention` | boolean variables start with `is` / `should` / `has` / `can` / `did` / `will`, interfaces have no `I` prefix, and more |
| `@typescript-eslint/switch-exhaustiveness-check` | a `switch` over a union handles every member; a `switch` over a non-union type has a `default` (`requireDefaultForNonUnion`) |
| `@typescript-eslint/no-floating-promises` | every Promise is awaited or has its rejection handled |
| `@typescript-eslint/promise-function-async` | a function that returns a Promise is `async`, so it always reports failure as a rejection |
| `@eslint-react/no-leaked-conditional-rendering` | the left side of `&&` in JSX cannot render a stray value such as `0` (judged from types; booleans are not reported) |

## License

[MIT](LICENSE)
