# Query Configuration Linting Rule

## Rule Description

Enforces proper configuration for query methods that implement the QueryConfig interface, using queryIdentifier as the anchor point for validation.

## Configuration Interface

```typescript
interface QueryConfig {
  queryIdentifier: string;  // Required - Used as anchor for detection
  prometheusLabels?: {      // Optional
    query: string;          // Required if prometheusLabels is present
  };
}
```

## Rule Details

This rule enforces:

1. Any object literal matching QueryConfig structure (detected via queryIdentifier presence) must fully implement the interface
2. `queryIdentifier` field is mandatory and used as the anchor point for detection
3. If `prometheusLabels` is provided, it must include a `query` field with a non-empty string value

## Examples

### ❌ Incorrect

```typescript
// Missing prometheusLabels.query
async badQuery() {
  return this.query('SELECT * FROM users', {
    queryIdentifier: 'get_users'  // Detected as QueryConfig due to queryIdentifier
  });
}

// Empty query value
async badQuery2() {
  return someQuery('SELECT *', {
    queryIdentifier: 'test',      // Detected as QueryConfig due to queryIdentifier
    prometheusLabels: {
      query: ''
    }
  });
}
```

### ✅ Correct

```typescript
// Works with any method using QueryConfig
async getUsers() {
  return customQuery('SELECT *', {
    queryIdentifier: 'get_users',
    prometheusLabels: {
      query: 'get_users'
    }
  });
}
```

## Implementation Workflow

### 1. Test Cases (Following TDD)

```typescript
describe('query-config-validation', () => {
  // Test detection via queryIdentifier
  it('should detect and validate any object matching QueryConfig structure', () => {
    const code = `
      const config = {
        queryIdentifier: 'test'
      };
      someFunction(config);
    `;
    expect(ruleTester.run(code)).toHaveError('prometheusLabels.query must not be empty');
  });

  // Test in different contexts
  it('should validate QueryConfig in various method calls', () => {
    const code = `
      class CustomClass {
        async query1() {
          return customQuery('SELECT *', {
            queryIdentifier: 'test',
            prometheusLabels: { query: '' }
          });
        }
      }
    `;
    expect(ruleTester.run(code)).toHaveError('prometheusLabels.query must not be empty');
  });
});
```

### 2. Implementation Steps

1. Create rule module focusing on interface structure

   ```typescript
   // src/rules/query-config-validation.ts
   export default {
     meta: {
       type: 'problem',
       docs: {
         description: 'Enforce proper QueryConfig interface implementation',
         category: 'Errors',
         recommended: true
       },
       schema: [] // no options
     },
     create(context) {
       return {
         ObjectExpression(node) {
           // Check for queryIdentifier property as anchor
           const hasQueryIdentifier = node.properties.some(
             prop => prop.key.name === 'queryIdentifier'
           );
           
           if (hasQueryIdentifier) {
             // Validate full interface implementation
           }
         }
       };
     }
   };
   ```

2. AST Visitor Implementation
   - Detect objects with queryIdentifier property
   - Validate full interface structure when detected
   - Check prometheusLabels.query if present
   - Report appropriate errors

3. Error Messages

   ```typescript
   const ERROR_MESSAGES = {
     MISSING_IDENTIFIER: 'Objects implementing QueryConfig must have queryIdentifier',
     EMPTY_QUERY: 'prometheusLabels.query must not be empty when prometheusLabels is provided',
     INVALID_CONFIG: 'Object appears to implement QueryConfig but is missing required fields'
   };
   ```

### 3. Integration

1. Register rule in plugin index
2. Add to recommended config
3. Document in plugin README
4. Add to CI pipeline checks

### 4. Error Handling

- Provide clear error messages with fix suggestions
- Include code examples in error messages
- Point to exact location of the issue

### 5. Performance Considerations

- Cache AST traversal results
- Early return on non-IRevBase classes
- Optimize visitor patterns

## Rule Configuration

```json
{
  "rules": {
    "avesta/irev-base-query-config": "error"
  }
}
```

## Test Scenarios

### 1. Basic Detection Tests

```typescript
describe('Basic QueryConfig Detection', () => {
  it('should detect object with queryIdentifier property')
  it('should validate prometheusLabels when present')
  it('should handle objects without queryIdentifier')
  it('should detect multiple QueryConfig objects in same scope')
  it('should handle variable assignments vs direct usage')
})
```

### 2. Structure Analysis Tests

```typescript
describe('QueryConfig Structure Analysis', () => {
  it('should validate queryIdentifier is string type')
  it('should validate prometheusLabels object structure')
  it('should validate query field in prometheusLabels')
  it('should handle optional prometheusLabels')
  it('should detect malformed prometheusLabels structure')
  it('should handle spread operators in objects')
})
```

### 3. Configuration Tests

```typescript
describe('Rule Configuration', () => {
  it('should respect custom error messages')
  it('should handle custom validation rules')
  it('should respect ignored patterns')
  it('should validate configuration values')
  it('should handle missing configuration')
})
```

### 4. Edge Cases Tests

```typescript
describe('Edge Cases', () => {
  it('should handle null/undefined values')
  it('should handle dynamic property names')
  it('should handle nested QueryConfig objects')
  it('should handle destructured objects')
  it('should handle template literals in values')
  it('should handle function calls in values')
})
```

### 5. Auto-fix Tests

```typescript
describe('Auto-fix Suggestions', () => {
  it('should suggest adding missing prometheusLabels')
  it('should suggest fixing malformed structures')
  it('should handle multiple fixes in same file')
  it('should preserve existing comments')
  it('should maintain code style')
})
```

### 6. Performance Tests

```typescript
describe('Performance', () => {
  it('should handle large files efficiently')
  it('should optimize object detection')
  it('should cache validation results')
  it('should handle multiple validations in same pass')
})
```

### 7. Integration Tests

```typescript
describe('Integration', () => {
  it('should work with TypeScript files')
  it('should work with JavaScript files')
  it('should handle different import patterns')
  it('should work with different query function patterns')
  it('should integrate with existing ESLint rules')
})
```

### 8. Error Message Tests

```typescript
describe('Error Messages', () => {
  it('should provide clear violation descriptions')
  it('should include fix suggestions')
  it('should show correct code snippets')
  it('should handle multiple errors in same object')
  it('should provide context-aware suggestions')
})
