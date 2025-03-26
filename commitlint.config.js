const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Formatting, missing semi colons, etc
        "refactor", // Code refactoring
        "test", // Adding tests
        "chore", // Maintenance
        "perf", // Performance improvements
        "todo" // Add todos
      ]
    ],
    "subject-case": [0]
  }
};

export default config;
