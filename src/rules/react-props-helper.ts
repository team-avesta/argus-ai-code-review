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
    maxTernaryOperations: 1,
};

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce using helper functions for complex prop objects',
            category: 'Best Practices',
            recommended: true,
            url: 'https://github.com/your-username/avesta-code-review/blob/main/docs/rules/react-props-helper.md',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    complexity: {
                        type: 'object',
                        properties: {
                            maxInlineProps: { type: 'number' },
                            maxTernaryOperations: { type: 'number' },
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

            // Count ternary operations and complex expressions
            let ternaryCount = 0;
            let hasTemplateString = false;
            let hasFunctionCall = false;

            // Visit all child nodes to check for complex expressions
            function visit(node: any) {
                if (!node || typeof node !== 'object') {
                    return;
                }

                if (node.type === 'ConditionalExpression') {
                    ternaryCount++;
                } else if (node.type === 'TemplateLiteral') {
                    hasTemplateString = true;
                } else if (node.type === 'CallExpression') {
                    hasFunctionCall = true;
                }

                // Only visit specific AST node properties to avoid infinite recursion
                const propertiesToVisit = ['value', 'expression', 'left', 'right', 'object', 'property'];
                propertiesToVisit.forEach(prop => {
                    if (node[prop] && typeof node[prop] === 'object') {
                        visit(node[prop]);
                    }
                });

                if (Array.isArray(node.elements)) {
                    node.elements.forEach(visit);
                }
                if (Array.isArray(node.properties)) {
                    node.properties.forEach(visit);
                }
            }

            node.properties.forEach((prop: Property) => visit(prop.value));

            return (
                ternaryCount > config.maxTernaryOperations ||
                hasTemplateString ||
                (hasFunctionCall && node.properties.length > 1)
            );
        }

        return {
            JSXAttribute(node: any) {
                // Skip if the prop name is in ignoreProps
                if (config.ignoreProps?.includes(node.name.name)) {
                    return;
                }

                // Check if the value is an object expression
                if (
                    node.value &&
                    node.value.type === 'JSXExpressionContainer' &&
                    node.value.expression.type === 'ObjectExpression'
                ) {
                    const objectExpression = node.value.expression;
                    // Lower the threshold for nested components
                    const sourceCode = context.getSourceCode();
                    const isNested = sourceCode.getAncestors(node).some((ancestor: any) =>
                        ancestor.type === 'JSXElement' &&
                        ancestor.openingElement !== node.parent
                    );

                    if (isNested) {
                        config.maxInlineProps = Math.max(1, config.maxInlineProps - 1);
                    }

                    if (isComplexObjectLiteral(objectExpression)) {
                        context.report({
                            node: objectExpression,
                            message: 'Complex props should be extracted into a helper function',
                        });
                    }
                }
            },
        };
    },
};

export default rule; 