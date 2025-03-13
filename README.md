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

### Prerequisites

1. Make sure you have Node.js installed (version 14 or higher)
2. Set up your API key as an environment variable if you plan to use AI review:

```bash
export AI_PROVIDER_API_KEY=your_api_key_here
```

### From npm (recommended)

```bash
# Install locally in your project (recommended)
npm install --save-dev @team-avesta/argus-ai-code-review

# Or install globally
npm install -g @team-avesta/argus-ai-code-review
```

## Getting Started

1. **Create Configuration File**: First, create a `.argusrc.json` file in your project root with your desired rules and settings (see Configuration section below for details).

2. **Run the Tool**: After setting up your configuration file, you can run the tool using one of the following commands:

```bash
# Basic usage (runs ESLint rules on all files in the path)
argus-ai-code-review check <path-to-code>

# Example: Check the src directory
npx argus-ai-code-review check "src/modules/**/*(*.js|*.jsx|*.ts|*.tsx)"

# With custom config location
argus-ai-code-review check <path-to-code> --config <path-to-config>

# Example: Check with a custom config file
npx argus-ai-code-review check "src/modules/**/*(*.js|*.jsx|*.ts|*.tsx)" --config ./custom-argus-config.json

# Run on staged files only (both ESLint rules and AI review)
argus-ai-code-review check --staged

# Run on specific files
argus-ai-code-review check path/to/file1.ts path/to/file2.ts

# Example: Check specific files
argus-ai-code-review check src/modules/demo.tsx ./src/utils/helpers.ts

# Run with verbose output
argus-ai-code-review check <path-to-code> --verbose
```

> **Note**: When running without the `--staged` flag, only ESLint rules will be applied to all matching files. The AI-powered code review is only triggered when using the `--staged` flag and will only analyze staged files and their diff code to optimize performance and reduce API costs.

## How It Works

The tool operates in two distinct modes:

- **ESLint Rules**: Run on all files in the specified path. These static analysis rules are applied to every file that matches your path pattern.
- **AI Review**: Only runs on staged files and diff code to optimize performance and reduce API costs. The AI review focuses specifically on changes you're about to commit, providing targeted feedback on your modifications.

This dual approach ensures comprehensive code quality while keeping AI API usage efficient and cost-effective.

### Review Scope Differences

| Review Type       | Files Analyzed                        | When to Use                                          |
| ----------------- | ------------------------------------- | ---------------------------------------------------- |
| ESLint Rules      | All files matching the specified path | For regular code quality checks across your codebase |
| AI-powered Review | Only staged files and their diff code | When preparing to commit changes                     |

## Configuration

Create a `.argusrc.json` file in your project root before running any commands. This configuration file is required for the tool to work properly.

For a comprehensive reference of all configuration options, see the [Configuration Reference](docs/configuration.md).

Below is a basic example configuration:

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
    "argus-ai-code-review/handle-negative-first": "error"
  },
  "settings": {
    "aiReview": {
      "enabled": true,
      "model": "gpt-4-turbo-preview",
      "rules": {
        "function-length": {
          "enabled": true,
          "maxLines": 20
        },
        "function-complexity": {
          "enabled": true
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

The tool includes several ESLint rules to enforce best practices in your codebase. Each rule has detailed documentation available in the docs/rules directory:

- [react-props-helper](docs/rules/react-props-helper.md) - Enforces best practices for React props complexity
- [prometheus-label-config](docs/rules/prometheus-label-config.md) - Validates Prometheus label configurations
- [handle-negative-first](docs/rules/handle-negative-first.md) - Enforces handling negative conditions first

For detailed configuration options and examples, please refer to the individual rule documentation.

## AI-Powered Code Review

The tool includes an AI-powered code review feature that can use either OpenAI or Claude models to analyze your code for:

- Function length issues
- Function complexity
- Single responsibility principle violations

**Important**: Unlike ESLint rules which run on all files, AI review only runs on staged files and diff code to optimize performance and reduce API costs. This means you must stage your changes with `git add` before running the AI review.

### AI Rules

The tool includes several AI-powered rules to analyze your code. Each rule has detailed documentation available in the docs/ai-rules directory:

- [function-length](docs/ai-rules/function-length.md) - Analyzes function length to identify overly long functions
- [function-complexity](docs/ai-rules/function-complexity.md) - Analyzes the complexity of functions using metrics like cyclomatic and cognitive complexity
- [single-responsibility](docs/ai-rules/single-responsibility.md) - Ensures functions and classes adhere to the Single Responsibility Principle

For detailed configuration options and examples, please refer to the individual rule documentation.

### Using AI Review

To use this feature:

1. Create a `.argusrc.json` file with AI review settings (if not already done). See the [Configuration Reference](docs/configuration.md#ai-review-configuration) for all available options.

2. Set up your API key as an environment variable (if not already done during installation):

   ```bash
   export AI_PROVIDER_API_KEY=your_api_key_here
   ```

3. Run the check command on staged files:

   ```bash
   argus-ai-code-review check --staged
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
