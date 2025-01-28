import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

type MessageIds =
  | 'missingPrometheusQuery'
  | 'emptyPrometheusQuery'
  | 'invalidPrometheusLabels'
  | 'invalidPrometheusQueryType'
  | 'extraPrometheusProperties';

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/eslint/rules/${name}`);

export default createRule<[], MessageIds>({
  name: 'prometheus-label-config',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforces proper configuration for query methods using queryIdentifier',
    },
    messages: {
      missingPrometheusQuery: "prometheusLabels must contain a 'query' property",
      emptyPrometheusQuery: 'prometheusLabels.query cannot be empty',
      invalidPrometheusLabels: 'prometheusLabels must be an object',
      invalidPrometheusQueryType: 'prometheusLabels.query must be a string',
      extraPrometheusProperties: 'prometheusLabels should only contain the query property',
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
            prop.key.name === 'query',
        );

        // Check if query property exists
        if (!queryProperty) {
          context.report({
            node: value,
            messageId: 'missingPrometheusQuery',
          });
          return;
        }

        // Check for extra properties
        if (value.properties.length > 1) {
          context.report({
            node: value,
            messageId: 'extraPrometheusProperties',
          });
          return;
        }

        // Check query value type and emptiness
        const queryValue = queryProperty.value;
        if (queryValue.type === AST_NODE_TYPES.Literal) {
          if (typeof queryValue.value !== 'string') {
            context.report({
              node: queryValue,
              messageId: 'invalidPrometheusQueryType',
            });
          } else if (queryValue.value === '') {
            context.report({
              node: queryValue,
              messageId: 'emptyPrometheusQuery',
            });
          }
        }
      },
    };
  },
});
