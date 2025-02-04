import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

type MessageIds =
  | 'missingPrometheusIdentifier'
  | 'emptyPrometheusIdentifier'
  | 'invalidPrometheusLabels'
  | 'invalidPrometheusIdentifierType';

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/eslint/rules/${name}`);

export default createRule<[], MessageIds>({
  name: 'prometheus-label-config',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforces proper configuration for query methods using queryIdentifier',
    },
    messages: {
      missingPrometheusIdentifier:
        "prometheusLabels must contain either a 'query' or 'label' property",
      emptyPrometheusIdentifier: 'prometheusLabels.query or prometheusLabels.label cannot be empty',
      invalidPrometheusLabels: 'prometheusLabels must be an object',
      invalidPrometheusIdentifierType:
        'prometheusLabels.query or prometheusLabels.label must be a string',
    },
    schema: [], // no options
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node: TSESTree.ObjectExpression) {
        const properties = node.properties;

        // Check if this is a config object with prometheusLabels
        const prometheusLabelsProperty = properties.find(
          (prop): prop is TSESTree.Property =>
            prop.type === AST_NODE_TYPES.Property &&
            prop.key.type === AST_NODE_TYPES.Identifier &&
            prop.key.name === 'prometheusLabels',
        );

        // prometheusLabels is optional, but if present must be valid
        if (!prometheusLabelsProperty) {
          return;
        }

        const value = prometheusLabelsProperty.value;

        // Check if prometheusLabels is null
        if (value.type === AST_NODE_TYPES.Literal && value.value === null) {
          context.report({
            node: value,
            messageId: 'invalidPrometheusLabels',
          });
          return;
        }

        // Check if prometheusLabels is an object
        if (value.type !== AST_NODE_TYPES.ObjectExpression) {
          context.report({
            node: value,
            messageId: 'invalidPrometheusLabels',
          });
          return;
        }

        const queryProperty = value.properties.find(
          (prop): prop is TSESTree.Property =>
            prop.type === AST_NODE_TYPES.Property &&
            prop.key.type === AST_NODE_TYPES.Identifier &&
            (prop.key.name === 'query' || prop.key.name === 'label'),
        );

        // Check if either query or label property exists
        if (!queryProperty) {
          context.report({
            node: value,
            messageId: 'missingPrometheusIdentifier',
          });
          return;
        }

        // Check query/label value type and emptiness
        const queryValue = queryProperty.value;
        if (queryValue.type === AST_NODE_TYPES.Literal) {
          if (typeof queryValue.value !== 'string') {
            context.report({
              node: queryValue,
              messageId: 'invalidPrometheusIdentifierType',
            });
          } else if (queryValue.value === '') {
            context.report({
              node: queryValue,
              messageId: 'emptyPrometheusIdentifier',
            });
          }
        }
      },
    };
  },
});
