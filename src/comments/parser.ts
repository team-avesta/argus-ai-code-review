import {
  CommentParserOptions,
  DisableState,
  InvalidCommentError,
  InvalidRuleNameError,
} from './types';

// Patterns for detecting comments
const DISABLE_NEXT_LINE_PATTERN = /^\s*\/\/\s*avesta-disable-next-line\s+(.+)$/;
const DISABLE_FILE_PATTERN = /\/\*\s*avesta-disable\s+(.+?)\s*\*\//;
const RULE_NAME_PATTERN = /^[a-z0-9-]+$/;
const COMMENT_START_PATTERN = /^\s*(?:\/\/|\/\*)\s*avesta-disable/;
const INVALID_COMMENT_PATTERN =
  /^\s*(?:\/\/|\/\*)\s*(?:disable|avesta-disable-(?!next-line)|avesta-disable\s*$)/;

/**
 * Validates a rule name against the allowed pattern
 */
function validateRuleName(ruleName: string): void {
  if (!RULE_NAME_PATTERN.test(ruleName)) {
    throw new InvalidRuleNameError(
      `Invalid rule name: ${ruleName}. Rule names must be lowercase, and can only contain letters, numbers, and hyphens.`,
    );
  }
}

/**
 * Parses a comma-separated list of rule names
 */
function parseRuleNames(rulesStr: string): string[] {
  const rules = rulesStr
    .split(',')
    .map((rule) => rule.trim())
    .filter(Boolean);

  if (rules.length === 0) {
    throw new InvalidCommentError('No rules specified in disable comment');
  }

  // Check for invalid comma placement
  if (rulesStr.includes(',,') || rulesStr.trim().startsWith(',') || rulesStr.trim().endsWith(',')) {
    throw new InvalidCommentError('Invalid comma placement in rule list');
  }

  // Validate each rule name first
  rules.forEach(validateRuleName);
  return rules;
}

/**
 * Checks if a line contains a disable comment inside a string literal
 */
function isCommentInString(line: string): boolean {
  if (!(line.includes('`') || line.includes('"') || line.includes("'"))) {
    return false;
  }

  const stringMatch = line.match(/(['"`])(.*?)\1/g);
  if (!stringMatch) return false;

  return stringMatch.some((str) => str.includes('avesta-disable'));
}

/**
 * Gets the next non-comment line number
 */
function getNextCodeLineNumber(lines: string[], currentIndex: number): number {
  let nextIndex = currentIndex + 1;

  // For single-line sources with disable-next-line, use line 2
  // This matches ESLint's behavior
  if (nextIndex >= lines.length) {
    // Only return line 2 if this is a single-line source
    return lines.length === 1 ? 2 : -1;
  }

  // Look for the next non-comment line
  while (nextIndex < lines.length) {
    const line = lines[nextIndex].trim();
    if (line && !COMMENT_START_PATTERN.test(line)) {
      return nextIndex + 1;
    }
    nextIndex++;
  }

  // If we reach here and it's a disable-next-line comment,
  // there's no actual code to disable
  return -1;
}

/**
 * Extracts rules from a comment match
 */
function extractRules(match: RegExpExecArray, errorType: 'next-line' | 'file'): string[] {
  try {
    return parseRuleNames(match[1]);
  } catch (error) {
    if (error instanceof InvalidRuleNameError) {
      throw error;
    }
    throw new InvalidCommentError(`Invalid ${errorType} comment format`);
  }
}

/**
 * Processes a single line for disable comments
 */
function processLine(lines: string[], currentIndex: number, state: DisableState): void {
  const line = lines[currentIndex];
  const trimmedLine = line.trim();

  // Skip empty lines and comments in strings
  if (!trimmedLine || isCommentInString(line)) {
    return;
  }

  // Check for invalid comment format first
  if (INVALID_COMMENT_PATTERN.test(trimmedLine)) {
    throw new InvalidCommentError('Invalid disable comment format');
  }

  // First check if it's a disable comment
  if (!trimmedLine.includes('avesta-disable')) {
    return;
  }

  // Handle disable-next-line comments
  if (trimmedLine.includes('disable-next-line')) {
    const match = DISABLE_NEXT_LINE_PATTERN.exec(trimmedLine);
    if (!match) {
      throw new InvalidCommentError('Invalid disable-next-line comment format');
    }

    const rules = extractRules(match, 'next-line');
    const nextCodeLine = getNextCodeLineNumber(lines, currentIndex);

    // Only set disabled lines if there's actual code after
    if (nextCodeLine !== -1) {
      const disabledSet = state.disabledLines.get(nextCodeLine) || new Set();
      rules.forEach((rule) => disabledSet.add(rule));
      state.disabledLines.set(nextCodeLine, disabledSet);
    }
    return;
  }

  // Handle file-level disable comments
  if (trimmedLine.includes('/* avesta-disable')) {
    const match = DISABLE_FILE_PATTERN.exec(trimmedLine);
    if (!match) {
      throw new InvalidCommentError('Invalid file-level disable comment format');
    }

    const rules = extractRules(match, 'file');
    rules.forEach((rule) => state.disabledRules.add(rule));
    return;
  }

  // If we get here, it's an invalid disable comment
  throw new InvalidCommentError('Invalid disable comment format');
}

/**
 * Main function to parse comments and track disabled rules
 */
export function parseComments(options: CommentParserOptions): DisableState {
  const { source } = options;

  // Initialize state
  const state: DisableState = {
    disabledRules: new Set(),
    disabledLines: new Map(),
    isFileDisabled: false,
  };

  // Handle empty source
  if (!source.trim()) {
    return state;
  }

  // Split into lines, normalizing line endings
  const lines = source.replace(/\r\n?/g, '\n').split('\n');

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    processLine(lines, i, state);
  }

  return state;
}
