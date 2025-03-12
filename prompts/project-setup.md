# Argus AI Code Review Tool - Project Setup Guide

## Project Overview

A CLI-based code review tool built with TypeScript to analyze and enforce best practices in both frontend and backend projects.

## Tech Stack

- Language: TypeScript
- Runtime: Node.js
- Package Manager: npm
- Testing Framework: Jest
- Linting: ESLint + Prettier
- CLI Framework: Commander.js
- AST Parser: TypeScript Compiler API

## Project Structure

```
argus-ai-code-review/
├── src/
│   ├── cli/           # CLI command handlers
│   ├── analyzers/     # Code analysis modules
│   │   ├── typescript/
│   │   ├── patterns/
│   │   └── best-practices/
│   ├── rules/         # Rule definitions and configurations
│   ├── reporters/     # Output formatters
│   └── utils/         # Helper functions
├── tests/
├── dist/             # Compiled output
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
```

## Setup Steps

1. Initialize Project

```bash
mkdir argus-ai-code-review
cd argus-ai-code-review
npm init
```

2. Install Core Dependencies

```bash
npm install -D typescript @types/node ts-node
npm install commander chalk glob
```

3. Install Development Dependencies

```bash
npm install -D jest @types/jest ts-jest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

4. Configure TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

5. Configure ESLint (`.eslintrc.js`)

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Custom rules here
  },
};
```

6. Configure Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

7. Update `package.json` Scripts

```json
{
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepare": "husky install"
  }
}
```

## Core Features to Implement

1. CLI Interface

   - Command-line argument parsing
   - Configuration file support
   - Interactive mode

2. Code Analysis

   - TypeScript AST parsing
   - Pattern matching
   - Best practices validation

3. Rule Engine

   - Custom rule definitions
   - Rule severity levels
   - Rule configuration

4. Reporting
   - Console output
   - JSON reports
   - HTML reports
   - Integration with CI/CD

## Development Workflow

1. Create feature branches from `main`
2. Write tests before implementation
3. Implement features
4. Run linting and tests
5. Create PR for review
6. Merge after approval

## Next Steps

1. Set up basic CLI structure
2. Implement core analyzer framework
3. Define initial set of rules
4. Create basic reporter
5. Add test coverage
