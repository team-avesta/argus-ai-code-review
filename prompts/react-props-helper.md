# React Props Helper Function Pattern

## Overview
This pattern enforces the use of helper functions to prepare and pass props to React components instead of directly passing complex prop objects inline.

## Rule Description
When passing complex props to React components, extract the prop preparation logic into a dedicated helper function instead of defining it inline within the JSX.

## Benefits
- Improved code readability
- Better maintainability
- Reusable prop preparation logic
- Easier testing of prop preparation logic
- Reduced JSX complexity

## Examples

### ❌ Bad Practice
```tsx
<Card
  data={{ 
    bed: isNewDevelopmentListing ? 0 : data.bedrooms,
    bathroom: isNewDevelopmentListing ? 0 : data.bathrooms,
    parking: isNewDevelopmentListing ? 0 : data.carparks,
    heading: isNewDevelopmentListing ? data.title || '' : data.priceText,
    address: isNewDevelopmentListing
      ? `${data.suburbName}, ${data.state} ${data.postcode}`
      : getPropertyAddress(data),
    image: data.heroImageUrl ? getImageUrl(data.heroImageUrl, data.entityType) : '',
    url: data.listingDetailUrl,
    imageUrlSlug: data.imageUrlSlug,
    newDevelopmentPriceText: isNewDevelopmentListing ? data.priceText : '',
  }}
  imageCDNPath={getImageCDNPath(aData)}
  addressClassName="w-36"
  headingClassName="w-36"
  showPlaceHolder
/>
```

### ✅ Good Practice
```tsx
<Card
  data={getSalesPropertiesDetails(aData)}
  imageCDNPath={getImageCDNPath(aData)}
  addressClassName="w-36"
  headingClassName="w-36"
  showPlaceHolder
/>

const getSalesPropertiesDetails = (data: IAuctionListings) => {
  return {
    bed: isNewDevelopmentListing ? 0 : data.bedrooms,
    bathroom: isNewDevelopmentListing ? 0 : data.bathrooms,
    parking: isNewDevelopmentListing ? 0 : data.carparks,
    heading: isNewDevelopmentListing ? data.title || '' : data.priceText,
    address: isNewDevelopmentListing
      ? `${data.suburbName}, ${data.state} ${data.postcode}`
      : getPropertyAddress(data),
    image: data.heroImageUrl ? getImageUrl(data.heroImageUrl, data.entityType) : '',
    url: data.listingDetailUrl,
    imageUrlSlug: data.imageUrlSlug,
    newDevelopmentPriceText: isNewDevelopmentListing ? data.priceText : '',
  };
};
```

## Test Cases

### 1. Basic Detection Tests
```typescript
describe('Basic Prop Helper Detection', () => {
  it('should pass when using helper function for complex props')
  it('should fail when using inline complex object literal')
  it('should pass when using simple inline props (strings, numbers, booleans)')
  it('should pass when spreading props from helper function')
  it('should detect multiple violations in single component')
})
```

### 2. Complexity Analysis Tests
```typescript
describe('Prop Complexity Analysis', () => {
  it('should detect when object has more than maxInlineProps properties')
  it('should detect when object has nested ternary operations')
  it('should detect template literal usage')
  it('should detect multiple function calls')
  it('should handle deeply nested object structures')
  it('should analyze spread operator usage')
})
```

### 3. Configuration Tests
```typescript
describe('Rule Configuration', () => {
  it('should respect maxInlineProps threshold')
  it('should respect maxTernaryOperations threshold')
  it('should ignore specified props in ignoreProps list')
  it('should handle missing configuration options')
  it('should validate configuration values')
})
```

### 4. Edge Cases Tests
```typescript
describe('Edge Cases', () => {
  it('should handle empty objects')
  it('should handle null/undefined props')
  it('should handle dynamic prop names')
  it('should handle JSX spread attributes')
  it('should handle nested JSX components')
  it('should handle conditional rendering')
})
```

### 5. Auto-fix Tests
```typescript
describe('Auto-fix Suggestions', () => {
  it('should suggest helper function extraction')
  it('should preserve types in suggestions')
  it('should handle multiple violations in same file')
  it('should suggest meaningful function names')
  it('should maintain code formatting')
})
```

### 6. Performance Tests
```typescript
describe('Performance', () => {
  it('should process large files efficiently')
  it('should handle multiple files in parallel')
  it('should cache AST analysis results')
  it('should optimize helper function detection')
})
```

### 7. Integration Tests
```typescript
describe('Integration', () => {
  it('should work with TypeScript React components')
  it('should work with JavaScript React components')
  it('should handle different import styles')
  it('should work with different component patterns')
  it('should integrate with existing ESLint config')
})
```

### 8. Error Message Tests
```typescript
describe('Error Messages', () => {
  it('should provide clear violation messages')
  it('should include code examples in errors')
  it('should suggest fixes in error messages')
  it('should show correct line numbers')
  it('should handle multiple errors in single line')
})
```

## Implementation Workflow

### 1. AST Analysis Setup
- Create TypeScript AST parser utility
- Implement JSX element visitor pattern
- Set up prop analysis helpers
- Test cases:
  - Parse simple JSX elements
  - Detect prop objects
  - Identify inline object literals

### 2. Rule Detection Logic
- Implement complexity scoring for prop objects
  - Count number of properties
  - Detect nested ternary operations
  - Check for function calls
  - Identify template literals
- Create helper function detection
- Test cases:
  - Score simple vs complex prop objects
  - Detect inline vs helper function usage
  - Handle edge cases (empty objects, single props)

### 3. Rule Configuration
- Define rule options schema:
  ```typescript
  interface ReactPropsHelperRuleConfig {
    complexity: {
      maxInlineProps: number;      // Max number of props before requiring helper
      maxTernaryOperations: number;// Max allowed inline ternary operations
      ignoreProps: string[];       // Props to exclude from checks
    };
  }
  ```
- Test cases:
  - Validate configuration options
  - Apply different thresholds
  - Test with ignored props

### 4. Rule Implementation
- Create rule visitor pattern
- Implement violation detection
- Add auto-fix suggestions
- Test cases:
  - Detect rule violations
  - Generate correct fix suggestions
  - Handle different component patterns

### 5. Error Reporting
- Define violation message format
- Implement suggestion generation
- Add code examples in errors
- Test cases:
  - Verify error messages
  - Check suggestion accuracy
  - Test different violation scenarios

### 6. Integration Tests
- End-to-end rule testing
- Configuration integration
- CLI output verification
- Test cases:
  - Full codebase analysis
  - Multiple violation detection
  - Config file integration

### 7. Performance Optimization
- Implement caching for parsed AST
- Add batch processing for multiple files
- Optimize helper function detection
- Test cases:
  - Measure analysis speed
  - Verify memory usage
  - Test large codebase performance

### 8. Documentation
- Add rule documentation
- Include configuration examples
- Provide migration guides
- Test cases:
  - Verify documentation examples
  - Test configuration samples
  - Validate error messages

## Linting Rule
This pattern can be enforced through custom ESLint rules that detect inline object literals in JSX props above a certain complexity threshold. 