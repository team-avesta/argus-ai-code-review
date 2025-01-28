import rule from '../prometheus-label-config';
import { TSESLint } from '@typescript-eslint/utils';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('prometheus-label-config', rule, {
  valid: [
    // Basic valid cases with additional fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          timeout: 5000,
          retries: 3,
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: 'select_users_by_id'
          },
          cacheEnabled: true
        };
      `,
    },
    // Valid case without prometheusLabels but with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM items',
          queryIdentifier: 'list_items',
          timeout: 3000,
          retryCount: 2
        };
      `,
    },
    // TypeScript interface implementation with additional fields
    {
      code: `
        interface QueryConfig {
          sql: string;
          timeout?: number;
          queryIdentifier: string;
          prometheusLabels?: {
            query: string;
          };
          retryOptions?: {
            count: number;
            delay: number;
          };
        }
        
        const config: QueryConfig = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: 'select_users_query'
          },
          timeout: 5000,
          retryOptions: {
            count: 3,
            delay: 1000
          }
        };
      `,
    },
    // Function parameter usage with complex config
    {
      code: `
        function executeQuery(config: { 
          sql: string;
          queryIdentifier: string;
          prometheusLabels?: { query: string };
          timeout?: number;
          cache?: {
            enabled: boolean;
            ttl?: number;
          };
        }) {
          return config;
        }
        
        executeQuery({
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: 'select_users_query'
          },
          timeout: 5000,
          cache: {
            enabled: true,
            ttl: 60000
          }
        });
      `,
    },
  ],
  invalid: [
    // Empty prometheusLabels.query with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: ''
          },
          timeout: 5000
        };
      `,
      errors: [{ messageId: 'emptyPrometheusQuery' }],
    },
    // Missing prometheusLabels.query with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {},
          cache: { enabled: true }
        };
      `,
      errors: [{ messageId: 'missingPrometheusQuery' }],
    },
    // Invalid prometheusLabels structure (null) with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: null,
          timeout: 3000
        };
      `,
      errors: [{ messageId: 'invalidPrometheusLabels' }],
    },
    // Invalid prometheusLabels.query type (number) with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: 123
          },
          retries: 3
        };
      `,
      errors: [{ messageId: 'invalidPrometheusQueryType' }],
    },
    // Invalid prometheusLabels.query type (boolean) with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: true
          },
          cache: { ttl: 6000 }
        };
      `,
      errors: [{ messageId: 'invalidPrometheusQueryType' }],
    },
    // prometheusLabels with extra properties with other fields
    {
      code: `
        const config = {
          sql: 'SELECT * FROM users',
          queryIdentifier: 'get_users',
          prometheusLabels: {
            query: 'select_users',
            extraProp: 'not_allowed'
          },
          timeout: 5000
        };
      `,
      errors: [{ messageId: 'extraPrometheusProperties' }],
    },
  ],
});
