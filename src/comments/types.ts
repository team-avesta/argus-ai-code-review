/**
 * Type of disable comment
 */
export type DisableCommentType = 'disable-next-line' | 'disable-file';

/**
 * Represents a single disable comment in the code
 */
export interface DisableComment {
  /** Type of the disable comment */
  type: DisableCommentType;
  /** List of rule names to disable */
  rules: string[];
  /** Line number where the comment appears */
  line: number;
}

/**
 * Tracks the state of disabled rules throughout the file
 */
export interface DisableState {
  /** Set of rules disabled at file level */
  disabledRules: Set<string>;
  /** Map of line numbers to their disabled rules */
  disabledLines: Map<number, Set<string>>;
  /** Whether all rules are disabled for the file */
  isFileDisabled: boolean;
}

/**
 * Options for parsing comments
 */
export interface CommentParserOptions {
  /** Source code to parse */
  source: string;
  /** Name of the file being parsed */
  filename: string;
}

/**
 * Error thrown when a comment has invalid format
 */
export class InvalidCommentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCommentError';
  }
}

/**
 * Error thrown when a rule name is invalid
 */
export class InvalidRuleNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRuleNameError';
  }
}
