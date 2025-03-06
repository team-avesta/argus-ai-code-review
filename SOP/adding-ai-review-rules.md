# SOP: Adding New AI Review Rules

## Overview

This document outlines the process for adding new AI review rules to the Avesta Code Review system. These rules are used by the AI to analyze code and provide feedback based on specific patterns and best practices.

## Rule Creation Process

### 1. Rule Conceptualization

1. **Identify the Problem**:

   - Define what code quality issue the rule will address
   - Determine how it differs from existing rules
   - Establish clear criteria for violations

2. **Define Rule Scope**:
   - Determine what types of code the rule applies to (functions, classes, components, etc.)
   - Identify edge cases and exceptions
   - Consider how the rule interacts with other rules

### 2. Rule Prompt Creation

1. **Create Concise Description**:

   - Write a 1-2 sentence overview of what the rule checks for
   - Make it clear and actionable

2. **Define Detection Criteria**:

   - List specific patterns the AI should look for
   - Use bullet points for clarity
   - Focus on observable code characteristics

3. **Follow Existing Format**:
   - Keep prompts brief (3-6 lines total)
   - Use imperative language
   - Maintain consistent style with existing rules

### 3. Rule Configuration

1. **Define Configuration Options**:

   - Determine what aspects of the rule should be configurable
   - Add appropriate properties to the `RuleConfig` interface
   - Update the `AIReviewConfig` interface to include the new rule

2. **Set Default Values**:
   - Provide sensible defaults for all configuration options
   - Document the reasoning behind default values

### 4. Testing and Validation

1. **Create Test Cases**:

   - Develop sample code that should trigger the rule
   - Include edge cases and boundary conditions
   - Create examples of both compliant and non-compliant code

2. **Validate AI Detection**:
   - Test the rule with the AI review system
   - Verify that violations are correctly identified
   - Ensure error messages are clear and helpful

### 5. Documentation

1. **Update Rule Documentation**:

   - Add the new rule to the documentation
   - Include examples of violations and fixes
   - Document configuration options

2. **Update Configuration Examples**:
   - Add the new rule to example configurations
   - Show different configuration options

## Rule Prompt Template

```typescript
'rule-name': `Brief description of what the rule checks for.
Look for:
- Specific pattern 1
- Specific pattern 2
- Specific pattern 3
- Specific pattern 4.`,
```

## Configuration Update Template

```typescript
// Add to RuleConfig interface if needed
export interface NewRuleConfig extends RuleConfig {
  specificOption?: string | number | boolean;
}

// Update AIReviewConfig interface
export interface AIReviewConfig {
  rules: {
    'function-length'?: RuleConfig;
    'function-complexity'?: RuleConfig;
    'single-responsibility'?: RuleConfig;
    'new-rule-name'?: NewRuleConfig; // Add new rule here
  };
}
```

## Implementation Checklist

- [ ] Rule concept defined and scoped
- [ ] Rule prompt created following template
- [ ] Configuration options defined
- [ ] AIReviewConfig interface updated
- [ ] Test cases created
- [ ] AI detection validated
- [ ] Documentation updated
- [ ] Configuration examples updated
- [ ] Code review completed

## Best Practices

1. **Keep Prompts Focused**:

   - Each rule should address one specific code quality concern
   - Avoid overlap with existing rules
   - Be specific about what patterns to detect

2. **Use Clear Language**:

   - Write prompts that are easy for the AI to interpret
   - Use consistent terminology
   - Be explicit about what constitutes a violation

3. **Consider AI Limitations**:

   - Focus on patterns that are visually identifiable in code
   - Avoid rules that require deep semantic understanding
   - Consider what context the AI has access to

4. **Balance Strictness**:
   - Rules should catch real issues without excessive false positives
   - Consider configurability for team-specific preferences
   - Provide clear rationale for why violations matter
