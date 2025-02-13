# AI Code Review Integration

## Overview

Integration of AI-powered code review functionality from POC into the main Avesta Code Review system.

## Architecture Changes

### New Components

- `src/rules/ai-code-review-rule.ts`
- `src/repositories/openai-repository.ts`
- `src/services/ai-review-service.ts`

### Configuration Updates

1. `.avestarc.json`:

```json
{
  "rules": {
    "ai-code-review": true
  }
}
```

2. Environment Variables:

```
OPENAI_API_KEY=your_key_here
AI_REVIEW_MODEL=gpt-4
```

## Integration Steps

### Phase 1: Core Integration

1. Create OpenAI Repository

   - Port OpenAI integration code
   - Add error handling
   - Add rate limiting

2. Create AI Review Rule

   - Implement rule interface
   - Add file filtering
   - Add ignore markers support

3. Add AI Review Service
   - Handle review logic
   - Process git diffs
   - Format review comments

### Phase 2: Dashboard (Optional)

1. Port review dashboard components
2. Add React routing
3. Implement review history
4. Add user interactions

## Dependencies

```json
{
  "openai": "^4.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

## Workflow

### Development Workflow

1. **Setup**

   ```bash
   git checkout -b feature/ai-review-integration
   npm install openai
   ```

2. **Implementation Order**

   - Create repository
   - Add service layer
   - Implement rule
   - Add tests
   - Update configs

3. **Testing**
   - Unit tests for each component
   - Integration tests for review flow
   - Manual testing with sample PRs

### Usage Workflow

1. **Pre-commit**

   - Stage files
   - Run `avesta check`
   - AI reviews staged changes
   - Provides feedback in standard format

2. **Review Process**

   ```mermaid
   graph TD
     A[Stage Changes] --> B[Run Avesta Check]
     B --> C[AI Review Rule]
     C --> D[OpenAI Analysis]
     D --> E[Format Comments]
     E --> F[Display Results]
   ```

3. **Ignore Patterns**
   ```typescript
   // @ai-review-ignore-start
   // Code to ignore
   // @ai-review-ignore-end
   ```

## Migration Notes

- Keep existing rule system intact
- Use current git diff functionality
- Leverage comment parser system
- Maintain current severity levels

## Future Enhancements

1. Multiple AI model support
2. Custom review rules per file type
3. Review history tracking
4. Performance optimizations
5. Review suggestions auto-fix
