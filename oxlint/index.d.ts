type Severity = "off" | "warn" | "error";

type RuleEntry = Severity | [Severity, ...unknown[]];

type Override = {
  files: string[];
  env?: Record<string, boolean>;
  globals?: Record<string, "readonly" | "writable" | "off">;
  rules?: Record<string, RuleEntry>;
};

export type OxlintConfig = {
  $schema?: string;
  plugins?: string[];
  categories?: Record<string, Severity>;
  env?: Record<string, boolean>;
  globals?: Record<string, "readonly" | "writable" | "off">;
  ignorePatterns?: string[];
  rules?: Record<string, RuleEntry>;
  overrides?: Override[];
};

declare const config: OxlintConfig;
export default config;
