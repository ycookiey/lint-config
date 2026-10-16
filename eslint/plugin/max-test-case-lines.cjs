// Limits the length of the function passed to a test case (`it` / `test`),
// counted the same way as ESLint's `max-lines-per-function`.
//
// `max-lines-per-function` cannot tell a test case from the `describe` that
// groups test cases, so in test files it ends up limiting the length of a
// `describe`. This rule looks only at the test cases.
//
// A call counts as a test case when its callee starts with one of
// `testFunctionNames` (default: it, test), followed by any chain of
// properties (only, skip, todo, fails, concurrent, sequential, ...) and
// calls (each(table), for(table), skipIf(cond), runIf(cond), ...).
// The first function among the call's arguments is measured, so an options
// object before it or a timeout after it does not matter.

const DEFAULT_MAX = 80;
const DEFAULT_TEST_FUNCTION_NAMES = ["it", "test"];

const isFunctionNode = (node) =>
  node.type === "ArrowFunctionExpression" ||
  node.type === "FunctionExpression";

// Returns the base identifier name of a callee such as
// `it.concurrent.each(table)`, or null when the callee is anything else.
const baseNameOf = (callee) => {
  let node = callee;
  for (;;) {
    if (node.type === "Identifier") {
      return node.name;
    }
    if (node.type === "MemberExpression" && !node.computed) {
      node = node.object;
    } else if (node.type === "CallExpression") {
      node = node.callee;
    } else {
      return null;
    }
  }
};

const isWhitespace = (text) => text.trim() === "";

// Lines (1-based) that hold nothing but comments.
const commentOnlyLinesOf = (sourceCode) => {
  const { lines } = sourceCode;
  const result = new Set();
  for (const comment of sourceCode.getAllComments()) {
    const { start, end } = comment.loc;
    const isOwnFirstLine = isWhitespace(
      lines[start.line - 1].slice(0, start.column),
    );
    const isOwnLastLine = isWhitespace(lines[end.line - 1].slice(end.column));
    for (let line = start.line; line <= end.line; line += 1) {
      if (
        (line !== start.line || isOwnFirstLine) &&
        (line !== end.line || isOwnLastLine)
      ) {
        result.add(line);
      }
    }
  }
  return result;
};

const countLines = (node, lines, skipBlankLines, skippedLines) => {
  let count = 0;
  for (let line = node.loc.start.line; line <= node.loc.end.line; line += 1) {
    const isSkipped =
      (skipBlankLines && isWhitespace(lines[line - 1])) ||
      skippedLines.has(line);
    if (!isSkipped) {
      count += 1;
    }
  }
  return count;
};

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce a maximum number of lines in the function of a test case (`it` / `test`)",
    },
    schema: [
      {
        type: "object",
        properties: {
          max: { type: "integer", minimum: 0 },
          skipBlankLines: { type: "boolean" },
          skipComments: { type: "boolean" },
          testFunctionNames: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        max: DEFAULT_MAX,
        skipBlankLines: true,
        skipComments: true,
        testFunctionNames: DEFAULT_TEST_FUNCTION_NAMES,
      },
    ],
    messages: {
      exceed:
        "Test case has too many lines ({{lineCount}}). Maximum allowed is {{max}}.",
    },
  },

  create(context) {
    const options = context.options[0] ?? {};
    const max = options.max ?? DEFAULT_MAX;
    const skipBlankLines = options.skipBlankLines ?? true;
    const skipComments = options.skipComments ?? true;
    const testFunctionNames = new Set(
      options.testFunctionNames ?? DEFAULT_TEST_FUNCTION_NAMES,
    );
    const { sourceCode } = context;
    const skippedLines = skipComments
      ? commentOnlyLinesOf(sourceCode)
      : new Set();

    return {
      CallExpression(node) {
        const name = baseNameOf(node.callee);
        if (name === null || !testFunctionNames.has(name)) {
          return;
        }
        const fn = node.arguments.find(isFunctionNode);
        if (fn === undefined) {
          return;
        }
        const lineCount = countLines(
          fn,
          sourceCode.lines,
          skipBlankLines,
          skippedLines,
        );
        if (lineCount > max) {
          context.report({
            node: fn,
            messageId: "exceed",
            data: { lineCount, max },
          });
        }
      },
    };
  },
};

module.exports = rule;
