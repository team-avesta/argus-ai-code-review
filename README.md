# Argus AI Code Review

A CLI tool for automated code review and best practices analysis in TypeScript projects. This tool helps maintain code quality by analyzing your codebase against predefined best practices and coding standards.

## Features

- Static code analysis for TypeScript projects
- Best practices validation
- Code pattern detection
- Customizable rule sets
- ESLint-based rule engine
- Detailed error reporting
- AI-powered code review with support for multiple providers (OpenAI and Claude)

## Installation

### From npm (recommended)

```bash
# Install globally
npm install -g @team-avesta/argus-ai-code-review

# Or install locally in your project
npm install --save-dev @team-avesta/argus-ai-code-review
```

### From source

```bash
# Clone the repository
git clone https://github.com/team-avesta/argus-ai-code-review.git

# Navigate to project directory
cd argus-ai-code-review

# Install dependencies
npm install

# Build the project
npm run build

# Create a global symlink (optional)
npm link
```

## Usage

```bash
# Basic usage
argus-ai-code-review check <path-to-code>

# With custom config
argus-ai-code-review check <path-to-code> --config <path-to-config>
```

## Configuration

Create a `.argusrc.json` file in your project root:

```json
{
  "rules": {
    "argus-ai-code-review/react-props-helper": [
      "error",
      {
        "complexity": {
          "maxInlineProps": 2,
          "maxTernaryOperations": 1,
          "ignoreProps": ["style"]
        }
      }
    ],
    "argus-ai-code-review/prometheus-label-config": "error",
    "argus-ai-code-review/handle-negative-first": [
      "error",
      {
        "maxNestingDepth": 1,
        "enforceThrow": false,
        "allowSingleNesting": false,
        "checkArrowFunctions": true,
        "checkAsyncFunctions": true,
        "checkGenerators": true,
        "checkTernaries": true,
        "checkTryCatch": true,
        "enforceEarlyReturn": true,
        "maxElseDepth": 2
      }
    ]
  },
  "settings": {
    "aiReview": {
      "enabled": true,
      "model": "gpt-4-turbo-preview",
      "ignorePatterns": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "function-length": {
          "enabled": true,
          "maxLines": 20
        },
        "function-complexity": {
          "enabled": true,
          "metrics": ["cyclomatic", "cognitive"]
        },
        "single-responsibility": {
          "enabled": true
        }
      }
    }
  }
}
```

### AI Review Models

The tool supports multiple AI models for code review:

- OpenAI models: `gpt-4-turbo-preview`, `gpt-4`, `gpt-3.5-turbo`
- Anthropic models: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`, `claude-3-haiku-20240307`

To use a specific model, set the `model` property in the `aiReview` settings. The tool will automatically determine which AI provider to use based on the model name.

#### API Key Configuration

Set your API key using the environment variable:

```bash
# Set your API key for the selected model
AI_PROVIDER_API_KEY=your_api_key_here
```

The same environment variable is used for all AI providers. Make sure to use the appropriate API key for the model you've selected in your configuration.

## Available Rules

### react-props-helper

Enforces best practices for React props complexity:

- Limits inline props
- Controls ternary operation nesting
- Configurable prop ignoring

### prometheus-label-config

Validates Prometheus label configurations:

- Enforces proper query structure
- Validates label format
- Prevents empty queries

### handle-negative-first

Enforces handling negative conditions first to improve code readability and maintainability:

- Limits nesting depth of conditional statements
- Enforces early returns for negative conditions
- Configurable options for different function types
- Checks ternary expressions
- Controls maximum else depth

## AI-Powered Code Review

The tool includes an AI-powered code review feature that can use either OpenAI or Claude models to analyze your code for:

- Function length issues
- Function complexity
- Single responsibility principle violations

To use this feature:

1. Set up your API key as an environment variable:

   ```bash
   export AI_PROVIDER_API_KEY=your_api_key_here
   ```

2. Configure AI review in your `.argusrc.json` configuration:

   ```json
   "settings": {
     "aiReview": {
       "enabled": true,
       "model": "gpt-4-turbo-preview", // or "claude-3-opus-20240229"
       "ignorePatterns": ["**/*.test.ts", "**/*.spec.ts"],
       "rules": {
         "function-length": {
           "enabled": true,
           "maxLines": 20
         },
         "function-complexity": {
           "enabled": true,
           "metrics": ["cyclomatic", "cognitive"]
         },
         "single-responsibility": {
           "enabled": true
         }
       }
     }
   }
   ```

3. Run the check command as usual:

   ```bash
   argus-ai-code-review check <path-to-code>
   ```

You can exclude specific code blocks from AI review by using the `@ai-review-ignore` markers in your comments:

```typescript
// @ai-review-ignore-start
function complexFunctionToIgnore() {
  // This function will be ignored by the AI review
}
// @ai-review-ignore-end
```

### Switching Between AI Providers

The tool automatically selects the appropriate AI provider based on the model name:

- Models starting with `gpt-` will use OpenAI
- Models starting with `claude-` will use Anthropic's Claude

You can also override the model in your configuration by setting the `AI_REVIEW_MODEL` environment variable:

```bash
export AI_REVIEW_MODEL=claude-3-sonnet-20240229
```

## Development

```bash
# Start development
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes using conventional commit format:

   ```
   type(scope): subject

   body (optional)

   footer (optional)
   ```

   Types: feat, fix, docs, style, refactor, perf, test, chore, revert
   Example: `feat(rules): add new rule for React hooks`

5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request
