# Avesta Code Review

A CLI tool for automated code review and best practices analysis in TypeScript projects. This tool helps maintain code quality by analyzing your codebase against predefined best practices and coding standards.

## Features

- Static code analysis for TypeScript projects
- Best practices validation
- Code pattern detection
- Customizable rule sets
- CI/CD integration support
- HTML and JSON report generation

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/avesta-code-review.git

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
avesta-review analyze <path-to-code>

# With custom config
avesta-review analyze <path-to-code> --config <path-to-config>
```

## Configuration

Create a `.avestarc.json` file in your project root:

```json
{
  "rules": {
    "naming-convention": "error",
    "max-line-length": ["warn", 100],
    "no-any": "error"
  },
  "ignore": [
    "node_modules/**",
    "dist/**"
  ]
}
```

## Available Rules

- Naming Conventions
- Code Structure
- Type Safety
- Performance Patterns
- Security Best Practices
- And more...

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
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Add support for React best practices
- [ ] Implement custom rule creation
- [ ] Add auto-fix capabilities
- [ ] Integrate with popular IDEs
- [ ] Add support for more frameworks 