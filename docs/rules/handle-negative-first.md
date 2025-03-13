# Handle Negative Conditions First (handle-negative-first)

Enforces handling negative conditions (guard clauses) at the beginning of functions to improve code readability and reduce nesting.

## Rule Details

This rule aims to enforce the pattern of handling negative conditions first in functions, also known as "early returns" or "guard clauses". This pattern helps reduce cognitive load, prevents deep nesting, and makes the happy path clearer.

### What is considered a "negative condition"?

A condition is considered negative when it:

- Uses logical NOT operator (`!`)
- Checks for null/undefined
- Uses less than/equal comparisons (`<`, `<=`)
- Returns early from the function
- Throws an error

## Examples

### ❌ Incorrect

```typescript
// Nested positive conditions
function processUser(user) {
  if (user.isActive) {
    if (user.hasPermission) {
      return processUserData(user.data);
    }
  }
  return null;
}

// Deep nesting with multiple conditions
function validateUser(user) {
  if (user.name) {
    if (user.email) {
      if (user.age >= 18) {
        return true;
      }
    }
  }
  return false;
}

// Nested error handling
function processData(data) {
  if (data) {
    if (data.valid) {
      return data.process();
    } else {
      throw new Error('Invalid data');
    }
  } else {
    throw new Error('No data');
  }
}

// Excessive else-if chains
function getStatus(code) {
  if (code >= 200) {
    if (code < 300) {
      return 'success';
    } else if (code < 400) {
      return 'redirect';
    } else if (code < 500) {
      return 'client error';
    }
  }
  return 'invalid';
}
```

### ✅ Correct

```typescript
// Early returns with guard clauses
function processUser(user) {
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;
  return processUserData(user.data);
}

// Flat validation chain
function validateUser(user) {
  if (!user.name) return false;
  if (!user.email) return false;
  if (user.age < 18) return false;
  return true;
}

// Clear error handling
function processData(data) {
  if (!data) throw new Error('No data');
  if (!data.valid) throw new Error('Invalid data');
  return data.process();
}

// Simplified status checks
function getStatus(code) {
  if (code < 200) return 'invalid';
  if (code < 300) return 'success';
  if (code < 400) return 'redirect';
  if (code < 500) return 'client error';
  return 'server error';
}
```

## Options

This rule is configured in the `rules["argus-ai-code-review/handle-negative-first"]` section of your `.argusrc.json` file.

For detailed configuration options, see the [Configuration Reference](../configuration.md#eslint-rules-configuration).

### Key Options

- **maxNestingDepth**: Maximum allowed nesting depth for conditional statements (default: `1`)
- **enforceThrow**: When true, requires negative conditions to throw errors instead of returning values (default: `false`)
- **allowSingleNesting**: When true, allows a single level of nesting without requiring negative conditions (default: `false`)
- **checkArrowFunctions**: Whether to check arrow functions for compliance with the rule (default: `true`)
- **checkAsyncFunctions**: Whether to check async functions for compliance with the rule (default: `true`)
- **checkGenerators**: Whether to check generator functions for compliance with the rule (default: `true`)
- **checkTernaries**: Whether to check ternary expressions for nesting violations (default: `true`)
- **checkTryCatch**: Whether to check if statements inside try/catch blocks (default: `true`)
- **enforceEarlyReturn**: When true, enforces using early returns instead of else blocks (default: `true`)
- **maxElseDepth**: Maximum allowed depth of else/else-if chains (default: `2`)

## When Not To Use It

- If you prefer traditional if/else nesting for readability
- If your codebase heavily relies on complex conditional logic
- If you're working with legacy code that would require significant refactoring
- If you need to maintain a specific control flow structure

## Further Reading

- [Guard Clauses Pattern](https://refactoring.guru/replace-nested-conditional-with-guard-clauses)
- [Clean Code: Guard Clauses](https://deviq.com/design-patterns/guard-clause)
- [Early Returns in JavaScript](https://www.youtube.com/watch?v=EumXak7TyQ0)
- [Defensive Programming](https://en.wikipedia.org/wiki/Defensive_programming)
