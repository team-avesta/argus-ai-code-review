import { Rule } from 'eslint';
import {
  Node,
  IfStatement,
  ConditionalExpression,
  ReturnStatement,
  FunctionDeclaration,
  AssignmentPattern,
  Property,
} from 'estree';

interface RuleOptions {
  maxNestingDepth?: number;
  enforceThrow?: boolean;
  allowSingleNesting?: boolean;
  checkArrowFunctions?: boolean;
  checkAsyncFunctions?: boolean;
  checkGenerators?: boolean;
  checkTernaries?: boolean;
  checkTryCatch?: boolean;
  enforceEarlyReturn?: boolean;
  maxElseDepth?: number;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce handling negative conditions first',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxNestingDepth: {
            type: 'number',
            minimum: 1,
          },
          enforceThrow: {
            type: 'boolean',
          },
          allowSingleNesting: {
            type: 'boolean',
          },
          checkArrowFunctions: {
            type: 'boolean',
          },
          checkAsyncFunctions: {
            type: 'boolean',
          },
          checkGenerators: {
            type: 'boolean',
          },
          checkTernaries: {
            type: 'boolean',
          },
          checkTryCatch: {
            type: 'boolean',
          },
          enforceEarlyReturn: {
            type: 'boolean',
          },
          maxElseDepth: {
            type: 'number',
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      negativeFirst: 'Handle negative conditions first to reduce nesting',
      useEarlyReturn: 'Use early return instead of else block',
      tooManyElse: 'Too many else-if statements, maximum allowed is {{max}}',
    },
  },

  create(context) {
    const options: RuleOptions = context.options[0] || {};
    const maxNestingDepth = options.maxNestingDepth || 1;
    const enforceThrow = options.enforceThrow || false;
    const allowSingleNesting = options.allowSingleNesting || false;
    const checkArrowFunctions = options.checkArrowFunctions !== false;
    const checkAsyncFunctions = options.checkAsyncFunctions !== false;
    const checkGenerators = options.checkGenerators !== false;
    const checkTernaries = options.checkTernaries !== false;
    const checkTryCatch = options.checkTryCatch !== false;
    const enforceEarlyReturn = options.enforceEarlyReturn || false;
    const maxElseDepth = options.maxElseDepth || 2;

    function shouldSkipFunctionType(node: Node): boolean {
      let parent: Node | null = node;
      while (parent) {
        // @ts-expect-error - Property 'parent' does not exist on type 'Node'
        parent = parent.parent;
        if (parent && parent.type === 'ArrowFunctionExpression' && !checkArrowFunctions) {
          return true;
        }
        if (parent && parent.type === 'FunctionDeclaration') {
          const func = parent as FunctionDeclaration;
          if (!checkAsyncFunctions && func.async) {
            return true;
          }
          if (!checkGenerators && func.generator) {
            return true;
          }
        }
      }
      return false;
    }

    function isInTryCatch(node: Node): boolean {
      let parent: Node | null = node;
      while (parent) {
        // @ts-expect-error - Property 'parent' does not exist on type 'Node'
        parent = parent.parent;
        if (parent && parent.type === 'TryStatement') {
          return true;
        }
      }
      return false;
    }

    function hasParentIfStatement(node: Node): boolean {
      let parent: Node | null = node;
      while (parent) {
        // @ts-expect-error - Property 'parent' does not exist on type 'Node'
        parent = parent.parent;
        if (parent && parent.type === 'IfStatement') {
          return true;
        }
      }
      return false;
    }

    function countNestedConditionals(node: Node | null): number {
      if (!node) return 0;

      if (node.type === 'IfStatement') {
        const ifNode = node as IfStatement;
        const altCount = ifNode.alternate ? countNestedConditionals(ifNode.alternate) : 0;
        return Math.max(1 + countNestedConditionals(ifNode.consequent), altCount);
      }

      if (checkTernaries && node.type === 'ConditionalExpression') {
        const condNode = node as ConditionalExpression;
        return Math.max(
          1 + countNestedConditionals(condNode.consequent),
          1 + countNestedConditionals(condNode.alternate),
        );
      }

      if (node.type === 'BlockStatement') {
        return Math.max(...node.body.map((n) => countNestedConditionals(n)), 0);
      }

      if (node.type === 'ReturnStatement') {
        const returnNode = node as ReturnStatement;
        return returnNode.argument ? countNestedConditionals(returnNode.argument) : 0;
      }

      if (node.type === 'AssignmentPattern') {
        const assignNode = node as AssignmentPattern;
        return countNestedConditionals(assignNode.right);
      }

      if (node.type === 'Property') {
        const propNode = node as Property;
        return countNestedConditionals(propNode.value);
      }

      return 0;
    }

    function countElseDepth(node: IfStatement): number {
      let depth = 0;
      let current: IfStatement | null = node;

      while (current && current.type === 'IfStatement') {
        if (current.alternate) {
          depth++;
        }
        current = current.alternate as IfStatement | null;
      }

      return depth;
    }

    function hasThrowStatement(node: Node): boolean {
      if (!node) return false;

      if (node.type === 'ThrowStatement') {
        return true;
      }

      // @ts-expect-error - Properties do not exist on type 'Node'
      if (node.consequent && hasThrowStatement(node.consequent)) {
        return true;
      }

      // @ts-expect-error - Properties do not exist on type 'Node'
      if (node.alternate && hasThrowStatement(node.alternate)) {
        return true;
      }

      if (node.type === 'BlockStatement') {
        return node.body.some((n) => hasThrowStatement(n));
      }

      return false;
    }

    function checkNesting(node: IfStatement | ConditionalExpression) {
      // Skip if it's not the outermost if or if we should skip this function type
      if (hasParentIfStatement(node) || shouldSkipFunctionType(node)) {
        return;
      }

      // Skip if in try/catch and checkTryCatch is false
      if (!checkTryCatch && isInTryCatch(node)) {
        return;
      }

      if (node.type === 'IfStatement') {
        // Check else depth
        const elseDepth = countElseDepth(node);
        if (elseDepth > maxElseDepth) {
          context.report({
            node,
            messageId: 'tooManyElse',
            data: { max: String(maxElseDepth) },
          });
          return;
        }

        // Check early return
        if (enforceEarlyReturn && node.alternate) {
          context.report({
            node,
            messageId: 'useEarlyReturn',
          });
          return;
        }
      }

      // Count nested conditionals
      const nestedCount = countNestedConditionals(node) - 1; // Subtract 1 to not count the current node

      // Allow single nesting if configured
      if (allowSingleNesting && nestedCount <= 1) {
        return;
      }

      // Check if nesting depth exceeds the maximum allowed
      if (nestedCount >= maxNestingDepth) {
        // If enforceThrow is true, check if there's a throw statement
        if (enforceThrow && !hasThrowStatement(node)) {
          context.report({
            node,
            messageId: 'negativeFirst',
          });
          return;
        }

        // Report if not enforcing throw or if throw check passed
        if (!enforceThrow) {
          context.report({
            node,
            messageId: 'negativeFirst',
          });
        }
      }
    }

    return {
      IfStatement: checkNesting,
      ConditionalExpression(node) {
        if (checkTernaries) {
          checkNesting(node);
        }
      },
    };
  },
};

export default rule;
