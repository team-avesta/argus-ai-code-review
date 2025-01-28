# Query Configuration (prometheus-label-config)

Enforces proper configuration for query methods that implement the QueryConfig interface, using queryIdentifier as the anchor point for validation. This rule ensures consistent and valid query configurations across your codebase.

## Rule Details

This rule aims to enforce proper implementation of the QueryConfig interface in database query configurations. It supports both JavaScript and TypeScript codebases, with special handling for type assertions and interfaces.

### What is considered a "valid" QueryConfig?

A QueryConfig object must meet these criteria:

- Must have a `queryIdentifier` property (required)
- If `prometheusLabels` is present, it must:
  - Have a non-empty `query` string property
  - Follow the proper object structure

## Examples

### ❌ Incorrect

```typescript
// Missing prometheusLabels.query
const badConfig1 = {
  queryIdentifier: 'get_users'
};

// Empty query value in prometheusLabels
const badConfig2 = {
  queryIdentifier: 'list_items',
  prometheusLabels: {
    query: ''  // Empty string not allowed
  }
};

// Malformed prometheusLabels structure
const badConfig3 = {
  queryIdentifier: 'count_records',
  prometheusLabels: {}  // Missing required query field
};

// Direct usage in query methods
async function badQuery() {
  return executeQuery('SELECT * FROM users', {
    queryIdentifier: 'get_users'  // Missing prometheusLabels
  });
}
```

### ✅ Correct

```typescript
// Complete configuration with all required fields
const goodConfig1 = {
  queryIdentifier: 'get_users',
  prometheusLabels: {
    query: 'select_users_by_id'
  }
};

// TypeScript interface implementation
interface QueryConfig {
  queryIdentifier: string;
  prometheusLabels?: {
    query: string;
  };
}

const goodConfig2: QueryConfig = {
  queryIdentifier: 'list_items',
  prometheusLabels: {
    query: 'list_active_items'
  }
};

// Usage in query methods
async function goodQuery() {
  return executeQuery('SELECT * FROM users', {
    queryIdentifier: 'get_users',
    prometheusLabels: {
      query: 'select_users_query'
    }
  });
}
```

## When Not To Use It

- If you're not using Prometheus for monitoring
- If you have a different metrics collection system
- If you're working on a prototype or development environment where metrics aren't required

## Further Reading

- [Prometheus Query Best Practices](https://prometheus.io/docs/practices/naming/)
- [Prometheus Query Documentation](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [TypeScript Interface Documentation](https://www.typescriptlang.org/docs/handbook/interfaces.html)
