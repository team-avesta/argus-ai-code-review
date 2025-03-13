# Configuration Reference

This document provides a comprehensive reference for all configuration options in Argus AI Code Review.

## Configuration File

Argus AI Code Review uses a `.argusrc.json` file in your project root for configuration. Below is a complete example with all available options:

```json
{
  "rules": {
    "argus-ai-code-review/react-props-helper": [
      "error",
      {
        "complexity": {
          "maxInlineProps": 2,
          "maxTernaryOperations": 1,
          "ignoreProps": ["style"]
        }
      }
    ],
    "argus-ai-code-review/prometheus-label-config": "error",
    "argus-ai-code-review/handle-negative-first": [
      "error",
      {
        "maxNestingDepth": 1,
        "enforceThrow": false,
        "allowSingleNesting": false,
        "checkArrowFunctions": true,
        "checkAsyncFunctions": true,
        "checkGenerators": true,
        "checkTernaries": true,
        "checkTryCatch": true,
        "enforceEarlyReturn": true,
        "maxElseDepth": 2
      }
    ]
  },
  "settings": {
    "aiReview": {
      "enabled": true,
      "model": "gpt-4-turbo-preview",
      "ignorePatterns": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "function-length": {
          "enabled": true,
          "maxLines": 20
        },
        "function-complexity": {
          "enabled": true,
          "metrics": ["cyclomatic", "cognitive"]
        },
        "single-responsibility": {
          "enabled": true
        }
      }
    }
  }
}
```

## ESLint Rules Configuration

ESLint rules are configured in the `rules` section of the configuration file. Each rule can be set to one of the following values:

- `"off"` or `0` - Turn the rule off
- `"warn"` or `1` - Turn the rule on as a warning (doesn't affect exit code)
- `"error"` or `2` - Turn the rule on as an error (exit code will be 1)

Some rules also accept an options object as a second parameter. See individual rule documentation for details:

- [react-props-helper](rules/react-props-helper.md)
- [prometheus-label-config](rules/prometheus-label-config.md)
- [handle-negative-first](rules/handle-negative-first.md)

### ESLint Rule Options

#### react-props-helper

| Option                            | Type     | Default     | Description                                            |
| --------------------------------- | -------- | ----------- | ------------------------------------------------------ |
| `complexity.maxInlineProps`       | number   | `2`         | Maximum number of properties allowed inline            |
| `complexity.maxTernaryOperations` | number   | `1`         | Maximum number of ternary operations allowed in a prop |
| `complexity.ignoreProps`          | string[] | `["style"]` | Array of prop names to ignore from the rule            |

#### prometheus-label-config

This rule does not have any options and can be enabled with:

```json
{
  "rules": {
    "argus-ai-code-review/prometheus-label-config": "error"
  }
}
```

#### handle-negative-first

| Option                | Type    | Default | Description                                                                         |
| --------------------- | ------- | ------- | ----------------------------------------------------------------------------------- |
| `maxNestingDepth`     | number  | `1`     | Maximum allowed nesting depth for conditional statements                            |
| `enforceThrow`        | boolean | `false` | When true, requires negative conditions to throw errors instead of returning values |
| `allowSingleNesting`  | boolean | `false` | When true, allows a single level of nesting without requiring negative conditions   |
| `checkArrowFunctions` | boolean | `true`  | Whether to check arrow functions for compliance with the rule                       |
| `checkAsyncFunctions` | boolean | `true`  | Whether to check async functions for compliance with the rule                       |
| `checkGenerators`     | boolean | `true`  | Whether to check generator functions for compliance with the rule                   |
| `checkTernaries`      | boolean | `true`  | Whether to check ternary expressions for nesting violations                         |
| `checkTryCatch`       | boolean | `true`  | Whether to check if statements inside try/catch blocks                              |
| `enforceEarlyReturn`  | boolean | `true`  | When true, enforces using early returns instead of else blocks                      |
| `maxElseDepth`        | number  | `2`     | Maximum allowed depth of else/else-if chains                                        |

## AI Review Configuration

AI review is configured in the `settings.aiReview` section of the configuration file.

### Global AI Review Settings

| Option           | Type     | Default                            | Description                       |
| ---------------- | -------- | ---------------------------------- | --------------------------------- |
| `enabled`        | boolean  | `true`                             | Whether AI review is enabled      |
| `model`          | string   | `"gpt-4-turbo-preview"`            | The AI model to use for review    |
| `ignorePatterns` | string[] | `["**/*.test.ts", "**/*.spec.ts"]` | Glob patterns for files to ignore |

### AI Rule Configuration

Each AI rule has its own configuration section under `settings.aiReview.rules`:

#### function-length

| Option     | Type    | Default | Description                                   |
| ---------- | ------- | ------- | --------------------------------------------- |
| `enabled`  | boolean | `true`  | Whether this rule is enabled                  |
| `maxLines` | number  | `20`    | Maximum number of lines allowed in a function |

#### function-complexity

| Option    | Type     | Default                       | Description                    |
| --------- | -------- | ----------------------------- | ------------------------------ |
| `enabled` | boolean  | `true`                        | Whether this rule is enabled   |
| `metrics` | string[] | `["cyclomatic", "cognitive"]` | Complexity metrics to consider |

#### single-responsibility

| Option    | Type    | Default | Description                  |
| --------- | ------- | ------- | ---------------------------- |
| `enabled` | boolean | `true`  | Whether this rule is enabled |

For detailed information about each rule, see the individual rule documentation:

- [function-length](ai-rules/function-length.md)
- [function-complexity](ai-rules/function-complexity.md)
- [single-responsibility](ai-rules/single-responsibility.md)

## Environment Variables

| Variable              | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `AI_PROVIDER_API_KEY` | API key for the AI provider (required for AI review) |
| `AI_REVIEW_MODEL`     | Override the AI model specified in the configuration |
