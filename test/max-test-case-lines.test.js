import { describe, it } from "node:test";

import { RuleTester } from "eslint";

import rule from "../eslint/plugin/max-test-case-lines.cjs";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: "latest", sourceType: "module" },
});

// A function body of `n` statement lines, plus its opening and closing lines.
const body = (n) =>
  Array.from({ length: n }, (_, i) => `  const v${i} = ${i};`).join("\n");
const fnOf = (n) => `() => {\n${body(n)}\n}`;

// With max 4, a function of 2 body lines has 4 lines and passes,
// a function of 3 body lines has 5 lines and fails.
const MAX = 4;
const options = [{ max: MAX }];
const ok = fnOf(2);
const long = fnOf(3);
const exceed = { messageId: "exceed", data: { lineCount: 5, max: MAX } };

const shapes = [
  (fn) => `it("a", ${fn});`,
  (fn) => `test("a", ${fn});`,
  (fn) => `it("a", { timeout: 1 }, ${fn});`,
  (fn) => `it("a", ${fn}, 1000);`,
  (fn) => `it.only("a", ${fn});`,
  (fn) => `it.skip("a", ${fn});`,
  (fn) => `test.todo("a", ${fn});`,
  (fn) => `it.fails("a", ${fn});`,
  (fn) => `it.concurrent("a", ${fn});`,
  (fn) => `test.sequential("a", ${fn});`,
  (fn) => `it.skipIf(cond)("a", ${fn});`,
  (fn) => `test.runIf(cond)("a", ${fn});`,
  (fn) => `it.each([1, 2])("a %i", ${fn});`,
  (fn) => `test.each([1, 2])("a %i", ${fn});`,
  (fn) => `it.for([1, 2])("a %i", ${fn});`,
  (fn) => `it.concurrent.each([1, 2])("a %i", ${fn});`,
  (fn) => `it.concurrent.only.each([1, 2])("a %i", ${fn});`,
  (fn) => `it("a", function () {\n${body(fn === long ? 3 : 2)}\n});`,
  (fn) => `it("a", async () => {\n${body(fn === long ? 3 : 2)}\n});`,
];

ruleTester.run("max-test-case-lines", rule, {
  valid: [
    ...shapes.map((shape) => ({ code: shape(ok), options })),
    // describe and other callers are not test cases.
    { code: `describe("a", ${long});`, options },
    { code: `describe.each([1])("a", ${long});`, options },
    { code: `beforeEach(${long});`, options },
    { code: `foo("a", ${long});`, options },
    { code: `it["only"]("a", ${long});`, options },
    // A function passed by reference is not measured here.
    { code: `const f = ${long};\nit("a", f);`, options },
    // Blank lines and comment-only lines are not counted by default.
    {
      code: `it("a", () => {\n\n  // note\n  /* block\n     comment */\n${body(2)}\n});`,
      options,
    },
    // testFunctionNames replaces the default names.
    {
      code: `it("a", ${long});`,
      options: [{ max: MAX, testFunctionNames: ["spec"] }],
    },
    // The default limit is 80.
    { code: `it("a", ${fnOf(78)});` },
  ],
  invalid: [
    ...shapes.map((shape) => ({
      code: shape(long),
      options,
      errors: [exceed],
    })),
    // Blank and comment lines count when told to.
    {
      code: `it("a", () => {\n\n${body(2)}\n});`,
      options: [{ max: MAX, skipBlankLines: false }],
      errors: [{ messageId: "exceed", data: { lineCount: 5, max: MAX } }],
    },
    {
      code: `it("a", () => {\n  // note\n${body(2)}\n});`,
      options: [{ max: MAX, skipComments: false }],
      errors: [{ messageId: "exceed", data: { lineCount: 5, max: MAX } }],
    },
    // A line with code and a comment is a code line.
    {
      code: `it("a", () => {\n  const a = 1; // note\n  const b = 2; /* note */\n  const c = 3;\n});`,
      options,
      errors: [exceed],
    },
    // A test case nested in a describe is still measured.
    {
      code: `describe("a", () => {\n  it("b", ${long});\n});`,
      options,
      errors: [exceed],
    },
    // testFunctionNames picks up other names.
    {
      code: `spec("a", ${long});`,
      options: [{ max: MAX, testFunctionNames: ["spec"] }],
      errors: [exceed],
    },
    // The default limit is 80.
    {
      code: `it("a", ${fnOf(79)});`,
      errors: [{ messageId: "exceed", data: { lineCount: 81, max: 80 } }],
    },
  ],
});
