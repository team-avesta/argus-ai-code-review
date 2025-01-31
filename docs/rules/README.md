# Avesta Code Review Rules

This directory contains documentation for all available rules in the Avesta Code Review tool.

## Available Rules

### React Rules

- [react-props-helper](./react-props-helper.md) - Enforces the use of helper functions for complex prop objects in React components.

### Query Configuration Rules

- [prometheus-label-config](./prometheus-label-config.md) - Enforces proper configuration of Prometheus labels in query objects.

## Rule Categories

### Best Practices

Rules that help enforce best practices and improve code quality:

- [react-props-helper](./react-props-helper.md) - Improves code readability and maintainability by extracting complex prop objects into helper functions.
- [prometheus-label-config](./prometheus-label-config.md) - Ensures consistent and valid Prometheus label configurations for monitoring.

## Configuration

You can configure these rules in your `.avestarc.json` file:

```json
{
  "rules": {
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

## Contributing

When adding new rules, please:

1. Create a new rule file in the `src/rules` directory
2. Add comprehensive tests in `src/rules/__tests__`
3. Add documentation in `docs/rules`
4. Update this README with the new rule
5. Follow the existing rule format and documentation style
