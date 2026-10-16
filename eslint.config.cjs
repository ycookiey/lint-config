const baseConfig = require("./eslint/index.cjs");

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
  ...baseConfig.map((cfg) => withProjectService(cfg)),
];
