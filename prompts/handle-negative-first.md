# Handle Negative Conditions First Pattern

## Overview

This pattern enforces handling negative conditions (guard clauses) at the beginning of functions to improve code readability and reduce nesting.

## Rule Description

Functions should handle negative cases, validations, and edge cases first before proceeding with the main logic. This pattern is also known as "early returns" or "guard clauses".

## Benefits

- Reduces cognitive load
- Prevents deep nesting
- Makes the happy path clearer
- Improves error handling
- Easier to maintain and test

## Examples

### ❌ Bad Practice

```typescript
function processUser(user: User) {
  if (user.isActive) {
    if (user.hasPermission) {
      if (user.data) {
        // Main logic here
        return processUserData(user.data);
      } else {
        throw new Error('No user data');
      }
    } else {
      throw new Error('No permission');
    }
  } else {
    throw new Error('User not active');
  }
}

const calculateDiscount = (price: number, quantity: number) => {
  if (price > 0) {
    if (quantity > 0) {
      const total = price * quantity;
      if (total > 1000) {
        return total * 0.1;
      } else {
        return total * 0.05;
      }
    } else {
      return 0;
    }
  } else {
    throw new Error('Invalid price');
  }
};
```

### ✅ Good Practice

```typescript
function processUser(user: User) {
  if (!user.isActive) {
    throw new Error('User not active');
  }

  if (!user.hasPermission) {
    throw new Error('No permission');
  }

  if (!user.data) {
    throw new Error('No user data');
  }

  return processUserData(user.data);
}

const calculateDiscount = (price: number, quantity: number) => {
  if (price <= 0) {
    throw new Error('Invalid price');
  }

  if (quantity <= 0) {
    return 0;
  }

  const total = price * quantity;
  return total > 1000 ? total * 0.1 : total * 0.05;
};
```

## Test Cases

### 1. Basic Detection Tests

```typescript
describe('Basic Negative Condition Detection', () => {
  it('should pass when negative conditions are handled first');
  it('should fail when positive conditions create nesting');
  it('should detect multiple nested conditions');
  it('should handle early returns');
  it('should check throw statements');
});
```

### 2. Pattern Analysis Tests

```typescript
describe('Pattern Analysis', () => {
  it('should detect if/else chains');
  it('should analyze nested conditions');
  it('should handle switch statements');
  it('should check try/catch blocks');
  it('should validate async/await patterns');
  it('should analyze ternary operators');
});
```

### 3. Configuration Tests

```typescript
describe('Rule Configuration', () => {
  it('should respect ignoredPatterns');
  it('should handle different function types');
  it('should respect maxNestingDepth');
  it('should validate configuration values');
});
```

### 4. Edge Cases Tests

```typescript
describe('Edge Cases', () => {
  it('should handle single line functions');
  it('should process arrow functions');
  it('should check async functions');
  it('should validate generator functions');
  it('should handle empty functions');
});
```

### 5. Auto-fix Tests

```typescript
describe('Auto-fix Suggestions', () => {
  it('should flip simple conditions');
  it('should restructure nested conditions');
  it('should preserve comments');
  it('should maintain code style');
});
```

## Implementation Workflow

### 1. AST Analysis Setup

- Create function visitor pattern
- Implement condition analysis
- Set up return statement tracking
- Test cases:
  - Function declarations
  - Arrow functions
  - Method definitions

### 2. Rule Detection Logic

- Implement nesting depth analysis
- Create condition order validation
- Check early return patterns
- Test cases:
  - Condition placement
  - Return statement order
  - Error throwing patterns

### 3. Rule Configuration

```typescript
interface HandleNegativeFirstConfig {
  // Maximum allowed nesting depth before triggering
  maxNestingDepth?: number;

  // Patterns to ignore (regex strings)
  ignoredPatterns?: string[];

  // Function types to check
  checkArrowFunctions?: boolean;
  checkAsyncFunctions?: boolean;
  checkGenerators?: boolean;

  // Whether to enforce throwing on negative conditions
  enforceThrow?: boolean;
}
```

### 4. Rule Implementation

- Create AST visitor
- Implement violation detection
- Add auto-fix suggestions
- Test cases:
  - Rule violations
  - Fix suggestions
  - Different function patterns

### 5. Error Reporting

- Define violation messages
- Implement fix suggestions
- Add code examples
- Test cases:
  - Message clarity
  - Fix accuracy
  - Example relevance

### 6. Integration

- Register rule in index
- Add configuration docs
- Create examples
- Test cases:
  - Rule registration
  - Config loading
  - Example validation

## ESLint Configuration

```json
{
  "rules": {
    "handle-negative-first": [
      "error",
      {
        "maxNestingDepth": 2,
        "checkArrowFunctions": true,
        "checkAsyncFunctions": true,
        "enforceThrow": true
      }
    ]
  }
}
```

## Common Patterns to Check

1. **Null/Undefined Checks**

```typescript
// ❌ Bad
function process(data?: Data) {
  if (data) {
    // process data
  }
}

// ✅ Good
function process(data?: Data) {
  if (!data) {
    return;
  }
  // process data
}
```

2. **Validation Chains**

```typescript
// ❌ Bad
function validateUser(user: User) {
  if (user.name) {
    if (user.email) {
      if (user.age >= 18) {
        return true;
      }
    }
  }
  return false;
}

// ✅ Good
function validateUser(user: User) {
  if (!user.name) return false;
  if (!user.email) return false;
  if (user.age < 18) return false;

  return true;
}
```

3. **Error Handling**

```typescript
// ❌ Bad
async function fetchData() {
  try {
    const response = await api.get();
    if (response.ok) {
      if (response.data) {
        return process(response.data);
      } else {
        throw new Error('No data');
      }
    } else {
      throw new Error('Bad response');
    }
  } catch (error) {
    handleError(error);
  }
}

// ✅ Good
async function fetchData() {
  try {
    const response = await api.get();
    if (!response.ok) {
      throw new Error('Bad response');
    }

    if (!response.data) {
      throw new Error('No data');
    }

    return process(response.data);
  } catch (error) {
    handleError(error);
  }
}
```

4. **Getter Functions**

```typescript
// ❌ Bad
function getUserData(user) {
  if (user.isActive) {
    if (user.data) {
      return user.data;
    }
  }
  return null;
}

// ✅ Good
function getUserData(user) {
  if (!user.isActive) {
    return null;
  }
  if (!user.data) {
    return null;
  }
  return user.data;
}
```

5. **Boolean Checks**

```typescript
// ❌ Bad
function isValidUser(user) {
  if (user.email) {
    if (user.verified) {
      return true;
    }
  }
  return false;
}

// ✅ Good
function isValidUser(user) {
  if (!user.email) {
    return false;
  }
  if (!user.verified) {
    return false;
  }
  return true;
}
```

6. **Complex Object Processing**

```typescript
// ❌ Bad
function processOrder(order) {
  if (order.items) {
    if (order.items.length > 0) {
      if (order.paymentStatus === 'confirmed') {
        return {
          status: 'ready',
          items: order.items,
          total: calculateTotal(order.items),
        };
      }
    }
  }
  return { status: 'invalid' };
}

// ✅ Good
function processOrder(order) {
  if (!order.items) {
    return { status: 'invalid' };
  }
  if (order.items.length === 0) {
    return { status: 'invalid' };
  }
  if (order.paymentStatus !== 'confirmed') {
    return { status: 'invalid' };
  }

  return {
    status: 'ready',
    items: order.items,
    total: calculateTotal(order.items),
  };
}
```
