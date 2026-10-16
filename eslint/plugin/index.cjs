// Rules of this package that no published plugin provides.
// Registered as the plugin `@ycookiey`, so the rules are `@ycookiey/<name>`.
const maxTestCaseLines = require("./max-test-case-lines.cjs");

module.exports = {
  meta: { name: "@ycookiey/lint-config" },
  rules: {
    "max-test-case-lines": maxTestCaseLines,
  },
};
