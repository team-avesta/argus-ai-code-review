import { RuleTester } from 'eslint';
import rule from '../handle-negative-first';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('handle-negative-first', rule, {
  valid: [
    // Basic negative conditions first
    {
      code: `
        function processUser(user) {
          if (!user.isActive) return;
          if (!user.hasPermission) return;
          return processUserData(user.data);
        }
      `,
    },
    // Early returns
    {
      code: `
        function validateInput(input) {
          if (!input) return false;
          if (typeof input !== 'string') return false;
          if (input.length === 0) return false;
          return true;
        }
      `,
    },
    // Throw statements
    {
      code: `
        function processData(data) {
          if (!data) throw new Error('No data');
          if (!data.valid) throw new Error('Invalid data');
          return data.process();
        }
      `,
    },
    // Multiple conditions without nesting
    {
      code: `
        function validateUser(user) {
          if (!user.name) return false;
          if (!user.email) return false;
          if (user.age < 18) return false;
          return true;
        }
      `,
    },
    // If/else chain without nesting
    {
      code: `
        function getStatus(code) {
          if (code < 200) return 'invalid';
          if (code < 300) return 'success';
          if (code < 400) return 'redirect';
          if (code < 500) return 'client error';
          return 'server error';
        }
      `,
    },
    // Try/catch with early returns
    {
      code: `
        async function fetchData() {
          try {
            const response = await api.get();
            if (!response.ok) throw new Error('Bad response');
            if (!response.data) throw new Error('No data');
            return process(response.data);
          } catch (error) {
            handleError(error);
          }
        }
      `,
    },
    // Ternary without nesting
    {
      code: `
        function getDiscount(total) {
          if (total <= 0) return 0;
          return total > 1000 ? total * 0.1 : total * 0.05;
        }
      `,
    },
    // Allow deeper nesting with maxNestingDepth config
    {
      code: `
        function validateUser(user) {
          if (user.name) {
            if (user.email) {
              return true;
            }
          }
          return false;
        }
      `,
      options: [{ maxNestingDepth: 2 }],
    },
    // Arrow function with early returns
    {
      code: `
        const validate = (data) => {
          if (!data) return null;
          if (!data.valid) return null;
          return process(data);
        };
      `,
    },
    // Async function with early returns
    {
      code: `
        async function fetchData() {
          if (!url) return null;
          if (!options) return null;
          const response = await fetch(url, options);
          return response.json();
        }
      `,
    },
    // Generator function with early returns
    {
      code: `
        function* generate() {
          if (!input) return;
          if (!input.valid) return;
          yield* process(input);
        }
      `,
    },
    // Allow single nesting with allowSingleNesting
    {
      code: `
        function processUser(user) {
          if (user.isActive) {
            if (!user.hasPermission) return;
            return processUserData(user.data);
          }
          return null;
        }
      `,
      options: [{ allowSingleNesting: true }],
    },
    // Skip arrow function with checkArrowFunctions: false
    {
      code: `
        const validate = (data) => {
          if (data.isValid) {
            if (data.hasData) {
              return process(data);
            }
          }
          return null;
        };
      `,
      options: [{ checkArrowFunctions: false }],
    },
    // Skip async function with checkAsyncFunctions: false
    {
      code: `
        async function fetchData() {
          if (response.ok) {
            if (response.data) {
              return await process(response.data);
            }
          }
          return null;
        }
      `,
      options: [{ checkAsyncFunctions: false }],
    },
    // Skip generator function with checkGenerators: false
    {
      code: `
        function* generate() {
          if (input.valid) {
            if (input.hasNext) {
              yield input.next();
            }
          }
          return;
        }
      `,
      options: [{ checkGenerators: false }],
    },
    // Skip ternary with checkTernaries: false
    {
      code: `
        function getDiscount(total) {
          if (total > 0) {
            return total > 1000 
              ? total > 5000 
                ? total * 0.2 
                : total * 0.1 
              : total * 0.05;
          }
          return 0;
        }
      `,
      options: [{ checkTernaries: false }],
    },
    // Skip try/catch with checkTryCatch: false
    {
      code: `
        async function fetchData() {
          try {
            const response = await api.get();
            if (response.ok) {
              if (response.data) {
                return process(response.data);
              }
            }
          } catch (error) {
            handleError(error);
          }
        }
      `,
      options: [{ checkTryCatch: false }],
    },
    // Allow else blocks when enforceEarlyReturn is false
    {
      code: `
        function processUser(user) {
          if (user.isActive) {
            return processUserData(user.data);
          } else {
            return null;
          }
        }
      `,
      options: [{ enforceEarlyReturn: false }],
    },
    // Allow else-if chains within maxElseDepth
    {
      code: `
        function getStatus(code) {
          if (code < 200) {
            return 'invalid';
          } else if (code < 300) {
            return 'success';
          } else if (code < 400) {
            return 'redirect';
          }
          return 'error';
        }
      `,
      options: [{ maxElseDepth: 3 }],
    },
    // Single line function
    {
      code: `const isValid = (x) => x !== null && x !== undefined;`,
    },
    // Single line if statement
    {
      code: `const getValue = (x) => x ? x.value : null;`,
    },
    // Empty function
    {
      code: `function noop() {}`,
    },
    // Empty async function
    {
      code: `async function asyncNoop() {}`,
    },
    // Empty generator function
    {
      code: `function* generatorNoop() {}`,
    },
    // Function with only comments
    {
      code: `
        function commented() {
          // This function is empty
          /* Multi-line
             comment */
        }
      `,
    },
    // Function with only variable declarations
    {
      code: `
        function declarations() {
          const x = 1;
          let y = 2;
          var z = 3;
        }
      `,
    },
    // Function with destructuring
    {
      code: `
        function destructure({ a, b, c }) {
          if (!a) return null;
          if (!b) return null;
          if (!c) return null;
          return { a, b, c };
        }
      `,
    },
    // Function with rest parameters
    {
      code: `
        function rest(...args) {
          if (!args.length) return;
          if (!args[0]) return;
          return args;
        }
      `,
    },
    // Function with default parameters
    {
      code: `
        function defaults(a = 1, b = 2) {
          if (a < 0) return null;
          if (b < 0) return null;
          return a + b;
        }
      `,
    },
  ],
  invalid: [
    // Nested positive conditions
    {
      code: `
        function processUser(user) {
          if (user.isActive) {
            if (user.hasPermission) {
              return processUserData(user.data);
            }
          }
          return null;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Multiple nested conditions
    {
      code: `
        function validateUser(user) {
          if (user.name) {
            if (user.email) {
              if (user.age >= 18) {
                return true;
              }
            }
          }
          return false;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Nested conditions with throw
    {
      code: `
        function processData(data) {
          if (data) {
            if (data.valid) {
              return data.process();
            } else {
              throw new Error('Invalid data');
            }
          } else {
            throw new Error('No data');
          }
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Nested if/else chain
    {
      code: `
        function getStatus(code) {
          if (code >= 200) {
            if (code < 300) {
              return 'success';
            } else if (code < 400) {
              return 'redirect';
            } else if (code < 500) {
              return 'client error';
            }
          }
          return 'invalid';
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Nested try/catch
    {
      code: `
        async function fetchData() {
          try {
            const response = await api.get();
            if (response.ok) {
              if (response.data) {
                return process(response.data);
              }
            }
            throw new Error('Invalid response');
          } catch (error) {
            handleError(error);
          }
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Nested ternary
    {
      code: `
        function getDiscount(total) {
          if (total > 0) {
            return total > 1000 
              ? total > 5000 
                ? total * 0.2 
                : total * 0.1 
              : total * 0.05;
          }
          return 0;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Exceeds maxNestingDepth
    {
      code: `
        function validateUser(user) {
          if (user.name) {
            if (user.email) {
              return true;
            }
          }
          return false;
        }
      `,
      options: [{ maxNestingDepth: 1 }],
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Invalid with enforceThrow
    {
      code: `
        function processData(data) {
          if (data) {
            if (data.valid) {
              return data.process();
            }
            return null;
          }
          return null;
        }
      `,
      options: [{ enforceThrow: true }],
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Single nesting not allowed by default
    {
      code: `
        function processUser(user) {
          if (user.isActive) {
            if (!user.hasPermission) return;
            return processUserData(user.data);
          }
          return null;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Arrow function checked by default
    {
      code: `
        const validate = (data) => {
          if (data.isValid) {
            if (data.hasData) {
              return process(data);
            }
          }
          return null;
        };
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Async function checked by default
    {
      code: `
        async function fetchData() {
          if (response.ok) {
            if (response.data) {
              return await process(response.data);
            }
          }
          return null;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Generator function checked by default
    {
      code: `
        function* generate() {
          if (input.valid) {
            if (input.hasNext) {
              yield input.next();
            }
          }
          return;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Ternary checked by default
    {
      code: `
        function getDiscount(total) {
          if (total > 0) {
            return total > 1000 
              ? total > 5000 
                ? total * 0.2 
                : total * 0.1 
              : total * 0.05;
          }
          return 0;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Try/catch checked by default
    {
      code: `
        async function fetchData() {
          try {
            const response = await api.get();
            if (response.ok) {
              if (response.data) {
                return process(response.data);
              }
            }
          } catch (error) {
            handleError(error);
          }
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Enforce early return by default
    {
      code: `
        function processUser(user) {
          if (user.isActive) {
            return processUserData(user.data);
          } else {
            return null;
          }
        }
      `,
      options: [{ enforceEarlyReturn: true }],
      errors: [
        {
          message: 'Use early return instead of else block',
          type: 'IfStatement',
        },
      ],
    },
    // Exceeds maxElseDepth
    {
      code: `
        function getStatus(code) {
          if (code < 200) {
            return 'invalid';
          } else if (code < 300) {
            return 'success';
          } else if (code < 400) {
            return 'redirect';
          } else if (code < 500) {
            return 'client error';
          } else {
            return 'server error';
          }
        }
      `,
      options: [{ maxElseDepth: 2 }],
      errors: [
        {
          message: 'Too many else-if statements, maximum allowed is 2',
          type: 'IfStatement',
        },
      ],
    },
    // Single line function with nested ternary
    {
      code: `const getDiscount = (x) => x > 0 ? x > 100 ? 0.2 : 0.1 : 0;`,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'ConditionalExpression',
        },
      ],
    },
    // Nested conditions in destructuring default
    {
      code: `
        function processObject({ a = b > 0 ? b > 100 ? 0.2 : 0.1 : 0 }) {
          return a;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'ConditionalExpression',
        },
      ],
    },
    // Nested conditions in parameter default
    {
      code: `
        function processValue(value = x > 0 ? x > 100 ? 0.2 : 0.1 : 0) {
          return value;
        }
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'ConditionalExpression',
        },
      ],
    },
    // Arrow function with block and nested conditions
    {
      code: `
        const process = ({ a, b, c } = {}) => {
          if (a) {
            if (b) {
              if (c) {
                return true;
              }
            }
          }
          return false;
        };
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
    // Async arrow function with nested conditions
    {
      code: `
        const fetchData = async () => {
          if (url) {
            if (options) {
              const response = await fetch(url, options);
              if (response.ok) {
                return response.json();
              }
            }
          }
          return null;
        };
      `,
      errors: [
        {
          message: 'Handle negative conditions first to reduce nesting',
          type: 'IfStatement',
        },
      ],
    },
  ],
});
