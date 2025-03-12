# Disable Comments Pattern

## Overview

This pattern allows disabling Argus rules at different scopes using special comments, providing flexibility in rule enforcement while maintaining code quality.

## Rule Description

Special comments can be used to disable rules at line level or file level. This is useful when certain rules don't make sense in specific contexts or need to be temporarily disabled.

## Benefits

- Flexible rule enforcement
- Context-specific rule disabling
- Maintains code quality while allowing exceptions
- Clear documentation of rule exceptions
- Easy to track and review disabled rules

## Examples

### 1. Line Level Disabling

````typescript
// ❌ Bad Practice
// disable-next-line
function complexFunction() {  // Unclear which line is affected
  // This disables all rules without specifying which ones
}

```typescript
// ✅ Good Practice
// argus-disable-next-line handle-negative-first
function complexFunction() {  // This line is disabled
  // Comment must be placed BEFORE the line you want to disable
}

Note: Comments must always be placed on the line BEFORE the code you want to disable.

### 2. File Level Disabling

```typescript
// ❌ Bad Practice
/* disable */
// Entire file has all rules disabled without explanation

// ✅ Good Practice
/* argus-disable react-props-helper */
// Specific rule disabled for file with clear intent
````

## Test Cases

### 1. Basic Comment Detection

```typescript
describe('Comment Detection', () => {
  it('should detect disable-next-line comments');
  it('should detect file-level disable comments');
  it('should parse multiple rules in single comment');
  it('should handle whitespace variations');
});
```

### 2. Rule State Management

```typescript
describe('Rule State Management', () => {
  it('should track disabled rules per line');
  it('should manage file-level disabled rules');
  it('should handle multiple disable comments');
  it('should reset rule state appropriately');
});
```

### 3. Comment Parsing

```typescript
describe('Comment Parsing', () => {
  it('should extract rule names correctly');
  it('should handle invalid rule names');
  it('should parse comment variations');
  it('should validate comment format');
});
```

## Implementation Workflow

### 1. Comment Detection Setup

- Create comment pattern matchers
- Implement comment parsing logic
- Set up rule name extraction
- Test cases:
  - Single-line comments
  - Multi-line comments
  - Mixed comment types

### 2. State Management

- Implement line-level rule tracking
- Create file-level disable handling
- Manage rule state transitions
- Test cases:
  - State updates
  - Rule tracking
  - State persistence

### 3. Rule Configuration

```typescript
interface DisableComment {
  type: 'disable-next-line' | 'disable-file';
  rules: string[];
  line: number;
}

interface DisableState {
  disabledRules: Set<string>;
  disabledLines: Map<number, Set<string>>;
  isFileDisabled: boolean;
}

interface CommentParserOptions {
  source: string;
  filename: string;
}
```

### 4. Integration Points

- Comment parser integration
- Rule execution pipeline
- State management system
- Test cases:
  - Parser integration
  - Rule execution
  - State management

## Common Patterns

1. **Single Rule Disable**

```typescript
// argus-disable-next-line handle-negative-first
function complexCondition() {
  if (condition) {
    // Complex logic here
  }
}
```

2. **Multiple Rules Disable**

```typescript
// argus-disable-next-line handle-negative-first, react-props-helper
const Component = () => {
  // Complex component logic
};
```

3. **File Level Disable**

```typescript
/* argus-disable handle-negative-first */
// Entire file has handle-negative-first rule disabled
```

## Best Practices

1. **Always specify rules**

   - Be explicit about which rules are being disabled
   - Avoid disabling all rules unless absolutely necessary

2. **Add comments**

   - Explain why rules are being disabled
   - Document when rules can be re-enabled

3. **Minimize scope**

   - Prefer line-level disabling over file-level
   - Disable only specific rules rather than all rules

4. **Regular review**
   - Periodically review disabled rules
   - Remove unnecessary disables
   - Update as code evolves

## Configuration

The comment system uses the following built-in conventions that cannot be changed:

1. **Fixed Prefixes**

   - `argus-disable-next-line`
   - `argus-disable`

2. **Multiple Rules Support**
   - Comments always support disabling multiple rules using comma separation
   - Example: `// argus-disable-next-line rule1, rule2`
