# Function Complexity (function-complexity)

Analyzes the complexity of functions to identify overly complex code that may be difficult to understand, test, and maintain.

## Rule Details

This AI-powered rule examines the complexity of functions in your codebase using multiple metrics:

- **Cyclomatic Complexity**: Measures the number of linearly independent paths through a function
- **Cognitive Complexity**: Measures how difficult the function is to understand for humans

The rule uses AI to analyze the context of the function, considering factors such as:

- The function's purpose and domain
- Whether the complexity is justified
- Potential ways to simplify or refactor the function

## Examples

### ❌ Problematic

```typescript
function determineUserAccess(user, resource, context) {
  let hasAccess = false;

  if (user.isAdmin) {
    hasAccess = true;
  } else if (user.roles) {
    for (const role of user.roles) {
      if (role === 'manager' && resource.type === 'report') {
        if (context.department === user.department) {
          hasAccess = true;
        } else if (context.isPublic) {
          if (!resource.confidential) {
            hasAccess = true;
          }
        }
      } else if (role === 'viewer') {
        if (resource.type !== 'sensitive' && !resource.confidential) {
          if (context.isPublic || context.department === user.department) {
            hasAccess = true;
          }
        }
      }
    }
  }

  return hasAccess;
}
```

### ✅ Recommended

```typescript
function determineUserAccess(user, resource, context) {
  if (user.isAdmin) {
    return true;
  }

  if (!user.roles) {
    return false;
  }

  return user.roles.some((role) => hasRoleBasedAccess(role, user, resource, context));
}

function hasRoleBasedAccess(role, user, resource, context) {
  switch (role) {
    case 'manager':
      return hasManagerAccess(user, resource, context);
    case 'viewer':
      return hasViewerAccess(user, resource, context);
    default:
      return false;
  }
}

function hasManagerAccess(user, resource, context) {
  if (resource.type !== 'report') {
    return false;
  }

  return context.department === user.department || (context.isPublic && !resource.confidential);
}

function hasViewerAccess(user, resource, context) {
  if (resource.type === 'sensitive' || resource.confidential) {
    return false;
  }

  return context.isPublic || context.department === user.department;
}
```

## Configuration

This rule is configured in the `settings.aiReview.rules.function-complexity` section of your `.argusrc.json` file.

For detailed configuration options, see the [Configuration Reference](../configuration.md#function-complexity).

### Key Options

- **metrics**: The complexity metrics to consider when analyzing functions (default: `["cyclomatic", "cognitive"]`)

## Complexity Metrics Explained

### Cyclomatic Complexity

Cyclomatic complexity measures the number of linearly independent paths through a function. It increases with:

- Each `if`, `else if`, `case` statement
- Each `&&` or `||` operator
- Each loop (`for`, `while`, `do-while`)
- Each `catch` clause

Higher cyclomatic complexity indicates more potential execution paths, which means more test cases needed for full coverage and higher risk of bugs.

### Cognitive Complexity

Cognitive complexity measures how difficult code is to understand for humans. It considers:

- Nesting depth (heavily penalized)
- Control flow breaks
- Logical operations
- Recursion
- Complex conditionals

Unlike cyclomatic complexity, cognitive complexity penalizes nested structures more heavily, better reflecting how humans perceive code complexity.

## When Not To Use It

- For algorithms that inherently require complex logic
- In performance-critical code where simplification might impact performance
- In legacy code that would require significant refactoring
- When implementing complex business rules that cannot be simplified further

## Benefits of Simpler Functions

- **Reduced bug risk**: Simpler functions have fewer potential execution paths and edge cases
- **Improved testability**: Easier to achieve high test coverage
- **Enhanced maintainability**: Easier for developers to understand and modify
- **Better code reviews**: Simpler code is easier to review effectively
- **Faster onboarding**: New team members can understand the codebase more quickly

## Further Reading

- [Cyclomatic Complexity Explained](https://www.perforce.com/blog/qac/what-cyclomatic-complexity)
- [Cognitive Complexity: A New Way of Measuring Understandability](https://www.sonarsource.com/docs/CognitiveComplexity.pdf)
- [Refactoring Complex Methods](https://refactoring.guru/refactoring/techniques/simplifying-methods)
- [The Art of Readable Code](https://www.oreilly.com/library/view/the-art-of/9781449318482/)
