# Function Length (function-length)

Analyzes function length to identify overly long functions that may be difficult to understand and maintain.

## Rule Details

This AI-powered rule examines the length of functions in your codebase and flags those that exceed a configurable maximum line count. Long functions often violate the Single Responsibility Principle and can be harder to test, debug, and maintain.

The rule uses AI to analyze the context of the function, considering factors such as:

- The function's purpose and complexity
- Whether the length is justified by the functionality
- Potential ways to refactor or split the function

## Examples

### ❌ Problematic

```typescript
function processUserData(userData) {
  // 50+ lines of code with multiple responsibilities:
  // - Validation
  // - Data transformation
  // - API calls
  // - Error handling
  // - Logging
  // - State updates
  // ...
}
```

### ✅ Recommended

```typescript
// Split into smaller, focused functions
function processUserData(userData) {
  if (!validateUserData(userData)) {
    return handleInvalidData(userData);
  }

  const transformedData = transformUserData(userData);
  return saveUserData(transformedData);
}

function validateUserData(userData) {
  // Focused validation logic
}

function transformUserData(userData) {
  // Focused transformation logic
}

function saveUserData(userData) {
  // Focused data saving logic
}
```

## Configuration

This rule is configured in the `settings.aiReview.rules.function-length` section of your `.argusrc.json` file.

For detailed configuration options, see the [Configuration Reference](../configuration.md#function-length).

### Key Options

- **maxLines**: Maximum number of lines allowed in a function before it's flagged for review (default: `20`)

## When Not To Use It

- For codebases with established patterns of longer functions
- In legacy code that would require significant refactoring
- When working with certain algorithms or complex logic that is difficult to break down
- When the overhead of function calls would impact performance in critical sections

## Benefits of Shorter Functions

- **Improved readability**: Easier to understand at a glance
- **Better testability**: Smaller units are easier to test
- **Enhanced maintainability**: Easier to modify without side effects
- **Reduced cognitive load**: Developers can focus on one task at a time
- **Better code reuse**: Smaller functions are more likely to be reusable

## Further Reading

- [Clean Code: Functions Should Do One Thing](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)
- [The Art of Writing Small Functions](https://medium.com/swlh/the-art-of-writing-small-functions-in-javascript-e0ce1a5ddd1e)
- [Function Length: A Code Quality Metric](https://www.sonarsource.com/blog/function-length-a-key-metric-for-code-quality/)
