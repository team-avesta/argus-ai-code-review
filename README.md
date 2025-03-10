# Avesta Code Review

A CLI tool for automated code review and best practices analysis in TypeScript projects. This tool helps maintain code quality by analyzing your codebase against predefined best practices and coding standards.

## Features

- Static code analysis for TypeScript projects
- Best practices validation
- Code pattern detection
- Customizable rule sets
- ESLint-based rule engine
- Detailed error reporting

## Installation

### From npm (recommended)

```bash
# Install globally
npm install -g @team-avesta/avesta-code-review

# Or install locally in your project
npm install --save-dev @team-avesta/avesta-code-review
```

### From source

```bash
# Clone the repository
git clone https://github.com/team-avesta/avesta-code-review.git

# Navigate to project directory
cd avesta-code-review

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
avesta-review check <path-to-code>

# With custom config
avesta-review check <path-to-code> --config <path-to-config>
```

## Configuration

Create a `.avestarc.json` file in your project root:

```json
{
  "rules": {
    "avesta-code-review/react-props-helper": [
      "error",
      {
        "complexity": {
          "maxInlineProps": 2,
          "maxTernaryOperations": 1,
          "ignoreProps": ["style"]
        }
      }
    ],
    "avesta-code-review/prometheus-label-config": "error"
  }
}
```

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

## Versioning and Changelog

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for versioning and automatic changelog generation based on [Conventional Commits](https://www.conventionalcommits.org/).

To create a new release:

```bash
# Automatic versioning based on commits
npm run release

# Specific version bumps
npm run release:patch  # 1.0.0 -> 1.0.1
npm run release:minor  # 1.0.0 -> 1.1.0
npm run release:major  # 1.0.0 -> 2.0.0
```

### Continuous Integration and Deployment

This project uses GitHub Actions for continuous integration and deployment:

- **Automatic npm Publishing**: When changes are pushed to the `main` branch, a GitHub Action automatically:
  - Runs tests
  - Generates a new version (if needed)
  - Updates the CHANGELOG.md
  - Publishes to npm

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Add more React best practices rules
- [ ] Implement custom rule creation
- [ ] Add auto-fix capabilities
- [ ] Integrate with popular IDEs
- [ ] Add support for more frameworks
