const baseConfig = require("./eslint/index.cjs");

// oxlint-disable no-map-spread
// oxlint-disable unicorn/no-array-callback-reference
const withProjectService = (cfg) => ({
  ...cfg,
  languageOptions: {
    ...cfg.languageOptions,
    parserOptions: {
      ...cfg.languageOptions?.parserOptions,
      projectService: true,
      tsconfigRootDir: __dirname,
    },
  },
});

module.exports = [
  { ignores: ["node_modules/**", "oxlint/**"] },
  ...baseConfig.map(withProjectService),
];
