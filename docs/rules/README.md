# Argus AI Code Review Rules

This directory contains documentation for all available rules in the Argus AI Code Review tool.

## Available Rules

### React Rules

- [react-props-helper](./react-props-helper.md) - Enforces the use of helper functions for complex prop objects in React components.

### Code Structure Rules

- [handle-negative-first](./handle-negative-first.md) - Enforces handling negative conditions first to improve code readability and reduce nesting.

### Query Configuration Rules

- [prometheus-label-config](./prometheus-label-config.md) - Enforces proper configuration of Prometheus labels in query objects.

## Rule Categories

### Best Practices

Rules that help enforce best practices and improve code quality:

- [handle-negative-first](./handle-negative-first.md) - Reduces cognitive load and improves maintainability by enforcing early returns and guard clauses.
- [react-props-helper](./react-props-helper.md) - Improves code readability and maintainability by extracting complex prop objects into helper functions.
- [prometheus-label-config](./prometheus-label-config.md) - Ensures consistent and valid Prometheus label configurations for monitoring.

## Configuration

You can configure these rules in your `.argusrc.json` file:

```json
{
  "rules": {
    "handle-negative-first": [
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
    ],
    "react-props-helper": [
      "error",
      {
        "complexity": {
          "maxInlineProps": 2,
          "ignoreProps": ["style"]
        }
      }
    ],
    "prometheus-label-config": "error"
  }
}
```

## Disabling Rules

You can disable rules using special comments in your code:

### Line Level Disabling

```typescript
// Disable a single rule for next line
// argus-disable-next-line handle-negative-first
function someFunction() { ... }

// Disable multiple rules for next line
// argus-disable-next-line handle-negative-first, react-props-helper
function anotherFunction() { ... }
```

### File Level Disabling

```typescript
/* argus-disable handle-negative-first */
// Entire file will have handle-negative-first rule disabled

/* argus-disable handle-negative-first, react-props-helper */
// Multiple rules can be disabled for the entire file
```

### Comment Format

- Comments must be placed BEFORE the line you want to disable
- Rule names must be lowercase and can only contain letters, numbers, and hyphens
- Multiple rules must be comma-separated
- No spaces allowed in rule names

## Contributing

When adding new rules, please:

1. Create a new rule file in the `src/rules` directory
2. Add comprehensive tests in `src/rules/__tests__`
3. Add documentation in `docs/rules`
4. Update this README with the new rule
5. Follow the existing rule format and documentation style
