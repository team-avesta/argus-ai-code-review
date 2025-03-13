# Contributing to Argus AI Code Review

Thank you for considering contributing to Argus AI Code Review! This document outlines the process for contributing to the project and helps to make the contribution process easy and effective for everyone involved.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Git

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/argus-ai-code-review.git
   cd argus-ai-code-review
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your API key as an environment variable if you plan to use AI review:
   ```bash
   export AI_PROVIDER_API_KEY=your_api_key_here
   ```
5. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Tool Locally

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

### Making Changes

1. Make your changes in your feature branch
2. Add tests for your changes
3. Run the tests to ensure they pass
4. Update documentation if necessary
5. Format your code

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `revert`: Reverts a previous commit

Example:

```
feat(rules): add new rule for React hooks

This adds a new rule to enforce proper usage of React hooks.

Closes #123
```

### Pull Request Process

1. Update the README.md or documentation with details of changes if appropriate
2. Update the CHANGELOG.md with details of changes if appropriate
3. The PR should work with the latest development branch
4. Include screenshots or animated GIFs in your PR if it includes visual changes
5. Link any relevant issues in the PR description

## Adding New Rules

### ESLint Rules

1. Create a new rule file in `src/rules/`
2. Add tests in `tests/rules/`
3. Document the rule in `docs/rules/`
4. Add the rule to the rule index file
5. Update the configuration documentation

### AI Rules

1. Create a new rule implementation in `src/ai-rules/`
2. Add tests in `tests/ai-rules/`
3. Document the rule in `docs/ai-rules/`
4. Update the configuration documentation

## Documentation

- Keep documentation up to date with code changes
- Follow the existing documentation style
- Place rule documentation in the appropriate directory (`docs/rules/` or `docs/ai-rules/`)
- Reference the central configuration file instead of duplicating configuration details

## Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass before submitting a PR
- Follow the existing testing patterns

## Releasing

Only maintainers can release new versions. The process is:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a new GitHub release
4. Publish to npm

## Questions?

If you have any questions, please feel free to:

- Open an issue
- Discuss in the pull request
- Reach out to the maintainers

Thank you for contributing to Argus AI Code Review!
