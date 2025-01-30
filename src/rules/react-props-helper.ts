import { Rule } from 'eslint';
import { AST_NODE_TYPES } from '@typescript-eslint/types';

interface Property {
  type: string;
  value: any;
}

interface ObjectExpression {
  type: string;
  properties: Property[];
}

const DEFAULT_CONFIG = {
  maxInlineProps: 2,
};

const SAFE_VISITOR_KEYS = [
  'value',
  'expression',
  'left',
  'right',
  'object',
  'property',
  'elements',
  'properties',
];

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using helper functions for complex prop objects',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          complexity: {
            type: 'object',
            properties: {
              maxInlineProps: { type: 'number' },
              ignoreProps: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const config = {
      ...DEFAULT_CONFIG,
      ...(context.options[0]?.complexity || {}),
    };

    function isComplexObjectLiteral(node: ObjectExpression): boolean {
      // Check number of properties
      if (node.properties.length > config.maxInlineProps) {
        return true;
      }

      let hasTemplateString = false;
      let hasFunctionCall = false;

      // Visit all child nodes to check for complex expressions
      function visit(node: any) {
        if (!node || typeof node !== 'object') {
          return;
        }

        switch (node.type) {
          case AST_NODE_TYPES.TemplateLiteral:
            hasTemplateString = true;
            break;
          case AST_NODE_TYPES.CallExpression:
            hasFunctionCall = true;
            break;
        }

        // Visit only safe keys to prevent infinite recursion
        SAFE_VISITOR_KEYS.forEach((key) => {
          const value = node[key];
          if (Array.isArray(value)) {
            value.forEach(visit);
          } else if (value && typeof value === 'object') {
            visit(value);
          }
        });
      }

      node.properties.forEach((prop: Property) => visit(prop.value));

      return hasTemplateString || (hasFunctionCall && node.properties.length > 1);
    }

    return {
      JSXAttribute(node: any) {
        // Skip if the prop name is in ignoreProps
        if (config.ignoreProps?.includes(node.name.name)) {
          return;
        }

        // Check if the value is an object expression (including type assertions)
        if (node.value?.type === AST_NODE_TYPES.JSXExpressionContainer) {
          let objectExpression = node.value.expression;

          // Handle type assertions (TSAsExpression)
          if (objectExpression.type === AST_NODE_TYPES.TSAsExpression) {
            objectExpression = objectExpression.expression;
          }

          if (objectExpression.type === AST_NODE_TYPES.ObjectExpression) {
            // Lower the threshold for nested components
            const sourceCode = context.getSourceCode();
            const ancestors = sourceCode.getAncestors(node);
            const isNested = ancestors.some(
              (ancestor: any) =>
                ancestor.type === AST_NODE_TYPES.JSXElement &&
                ancestor.openingElement !== node.parent,
            );

            const localConfig = { ...config };
            if (isNested) {
              localConfig.maxInlineProps = Math.max(1, config.maxInlineProps - 1);
            }

            if (isComplexObjectLiteral(objectExpression)) {
              context.report({
                node: objectExpression,
                message: 'Complex props should be extracted into a helper function',
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
