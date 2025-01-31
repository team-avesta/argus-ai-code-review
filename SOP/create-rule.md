# Standard Operating Procedure: Creating New ESLint Rules

## Overview

This SOP outlines the step-by-step process for planning and documenting new ESLint rules.

## Steps

### 1. Rule Documentation Creation

1. Create a new markdown file in `prompts/` directory with format `rule-name.md`
2. Document the following sections:

   ```markdown
   # Rule Name Pattern

   ## Overview

   - Brief description of what the rule does
   - Problem it solves
   - Why it's important

   ## Rule Description

   - Detailed explanation of the rule
   - When it applies
   - What it enforces

   ## Benefits

   - List key benefits
   - Impact on code quality
   - Maintenance advantages
   ```

### 2. Example Documentation

1. Document bad and good practices:

   ````markdown
   ## Examples

   ### ❌ Bad Practice

   ```typescript
   // Add 2-3 examples of code that violates the rule
   ```
   ````

   ### ✅ Good Practice

   ```typescript
   // Add 2-3 examples of fixed code that follows the rule
   ```

   ```

   ```

2. Include various use cases:
   - Simple cases
   - Complex cases
   - Edge cases
   - Different function/component types

### 3. Test Cases Structure

1. Document test categories:

   ````markdown
   ## Test Cases

   ### 1. Basic Detection Tests

   ```typescript
   describe('Basic Rule Detection', () => {
     // List core functionality tests
   });
   ```
   ````

   ### 2. Pattern Analysis Tests

   ```typescript
   describe('Pattern Analysis', () => {
     // List pattern-specific tests
   });
   ```

   ### 3. Configuration Tests

   ### 4. Edge Cases Tests

   ### 5. Auto-fix Tests

   ```

   ```

### 4. Implementation Planning

1. Document implementation workflow:

   ````markdown
   ## Implementation Workflow

   ### 1. AST Analysis Setup

   - List required AST visitors
   - Core analysis functions
   - Test cases

   ### 2. Rule Detection Logic

   - Core rule logic
   - Pattern detection
   - Test cases

   ### 3. Rule Configuration

   ```typescript
   interface RuleConfig {
     // Document configuration options
   }
   ```
   ````

   ### 4. Rule Implementation

   ### 5. Error Reporting

   ### 6. Integration

   ```

   ```

### 5. Configuration Documentation

1. Document ESLint configuration:

   ````markdown
   ## ESLint Configuration

   ```json
   {
     "rules": {
       "rule-name": [
         "error",
         {
           // Document configuration options
         }
       ]
     }
   }
   ```
   ````

   ```

   ```

### 6. Common Patterns

1. Document pattern categories:

   ````markdown
   ## Common Patterns to Check

   1. **Pattern Category Name**

   ```typescript
   // ❌ Bad
   // Example of violation

   // ✅ Good
   // Example of correct implementation
   ```
   ````

   ```

   ```

2. Include at least 4-6 common patterns

## Rule Creation Checklist

- [ ] Rule documentation file created
- [ ] Overview and benefits documented
- [ ] Bad and good examples provided
- [ ] Test cases structured
- [ ] Implementation workflow defined
- [ ] Configuration options documented
- [ ] Common patterns documented
- [ ] Edge cases considered
- [ ] Auto-fix scenarios planned
- [ ] Integration steps outlined

## Best Practices

1. **Examples**

   - Make examples realistic and practical
   - Cover different complexity levels
   - Include edge cases
   - Show clear contrast between good and bad

2. **Test Cases**

   - Start with basic functionality
   - Include edge cases
   - Cover all configuration options
   - Test auto-fix capabilities

3. **Configuration**

   - Keep options minimal but flexible
   - Document each option clearly
   - Provide sensible defaults
   - Consider backwards compatibility

4. **Documentation**
   - Use clear, concise language
   - Provide practical examples
   - Include rationale for decisions
   - Document limitations and edge cases

## Review Process

1. **Documentation Review**

   - Clarity and completeness
   - Example coverage
   - Test case completeness
   - Configuration options

2. **Implementation Review**

   - AST handling
   - Rule logic
   - Error messages
   - Auto-fix implementation

3. **Integration Review**
   - Rule registration
   - Configuration handling
   - Documentation integration
   - Test coverage
