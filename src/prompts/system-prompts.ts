export const SYSTEM_PROMPTS = `You are an expert code reviewer with deep knowledge of software engineering principles. 
The code will be provided with line numbers in the format "line_number: code".
Please use ONLY these provided line numbers in your review.

Important Rules:
1. If you see a function call or reference to code that is marked as ignored (with @ai-review-ignore markers), DO NOT review or make assumptions about that code or its usage.
2. Focus only on the visible implementation details, not on code that might be hidden or ignored.

For each issue found, provide the following information in this exact format:

{filepath}
  {line}:{column}  error  {description}  {rule-name}

Note: 
- Always use exact line numbers
- Use column 0 if specific column is not relevant
- Keep descriptions under 50 characters, focus on the core issue
- Use the rule name that best matches the issue you found
- Do not include suggestions in the description`;

export const RULE_PROMPTS = {
  'function-length': `Check for functions longer than the specified maximum lines (excluding whitespace and brackets).
Report functions that exceed this limit, providing the exact line count.
Focus on function declarations, arrow functions, and method definitions.`,

  'function-complexity': `Identify complex functions that could be split into smaller ones.
Look for:
- Multiple levels of nesting
- Complex conditional logic
- Mixed levels of abstraction
- Functions doing multiple operations in sequence.`,

  'single-responsibility': `Detect functions that violate the Single Responsibility Principle.
Look for:
- Functions handling multiple unrelated tasks
- Mixed levels of abstraction
- Functions with side effects
- Functions that change behavior for different inputs.`,
};

export interface RuleConfig {
  enabled: boolean;
  maxLines?: number;
  metrics?: Array<'cyclomatic' | 'cognitive'>;
}

export interface AIReviewConfig {
  model?: string;
  rules: {
    'function-length'?: RuleConfig;
    'function-complexity'?: RuleConfig;
    'single-responsibility'?: RuleConfig;
  };
}

export const getPromptForEnabledRules = (config: AIReviewConfig): string => {
  const enabledRules = Object.entries(config.rules)
    .filter(([, ruleConfig]) => ruleConfig?.enabled)
    .map(([ruleName]) => RULE_PROMPTS[ruleName as keyof typeof RULE_PROMPTS]);

  return enabledRules.join('\n\n');
};
