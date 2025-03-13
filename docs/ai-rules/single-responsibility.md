# Single Responsibility Principle (single-responsibility)

Analyzes functions and classes to ensure they adhere to the Single Responsibility Principle (SRP), a core principle of clean code and good software design.

## Rule Details

This AI-powered rule examines your code to identify functions and classes that have multiple responsibilities. According to the Single Responsibility Principle, a function or class should have only one reason to change - meaning it should have only one responsibility.

The rule uses AI to analyze:

- The cohesion of code within functions and classes
- The presence of multiple distinct operations
- Mixing of different levels of abstraction
- Potential ways to refactor the code to better adhere to SRP

## Examples

### ❌ Problematic

```typescript
// Function with multiple responsibilities
function processUserRegistration(userData) {
  // Validate user data
  if (!userData.email || !userData.password) {
    throw new Error('Invalid user data');
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(userData.password, 10);

  // Save to database
  const user = new User({
    ...userData,
    password: hashedPassword,
  });
  await user.save();

  // Send confirmation email
  const emailContent = `Welcome ${userData.name}! Please confirm your account...`;
  await sendEmail(userData.email, 'Welcome!', emailContent);

  // Log the registration
  logger.info(`New user registered: ${userData.email}`);

  // Return user data
  return {
    id: user.id,
    name: userData.name,
    email: userData.email,
  };
}
```

### ✅ Recommended

```typescript
// Split into functions with single responsibilities
async function processUserRegistration(userData) {
  validateUserData(userData);

  const hashedPassword = hashPassword(userData.password);

  const user = await saveUserToDatabase({
    ...userData,
    password: hashedPassword,
  });

  await sendWelcomeEmail(user);

  logUserRegistration(user);

  return formatUserResponse(user);
}

function validateUserData(userData) {
  if (!userData.email || !userData.password) {
    throw new Error('Invalid user data');
  }
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

async function saveUserToDatabase(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

async function sendWelcomeEmail(user) {
  const emailContent = `Welcome ${user.name}! Please confirm your account...`;
  await sendEmail(user.email, 'Welcome!', emailContent);
}

function logUserRegistration(user) {
  logger.info(`New user registered: ${user.email}`);
}

function formatUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
```

## Configuration

This rule is configured in the `settings.aiReview.rules.single-responsibility` section of your `.argusrc.json` file.

For detailed configuration options, see the [Configuration Reference](../configuration.md#single-responsibility).

## Signs of SRP Violations

- **Multiple levels of abstraction**: Mixing high-level business logic with low-level implementation details
- **Unrelated operations**: Performing operations that aren't directly related to the function's primary purpose
- **Long parameter lists**: Functions that require many parameters often do too much
- **Multiple reasons to change**: If a function would need to change for multiple different reasons, it likely has multiple responsibilities
- **Difficulty naming**: If it's hard to name a function concisely, it might be doing too much
- **Comments separating sections**: Comments like "// Now do X" often indicate separate responsibilities

## Benefits of Following SRP

- **Improved maintainability**: Changes to one responsibility don't affect code for other responsibilities
- **Better testability**: Smaller, focused units are easier to test
- **Enhanced reusability**: Functions with single responsibilities are more likely to be reusable
- **Easier debugging**: When issues occur, it's clearer where to look
- **Simplified code reviews**: Reviewers can understand the purpose and implementation more easily
- **Reduced cognitive load**: Developers can focus on one concept at a time

## When Not To Use It

- In very small applications where the overhead of many small functions might not be justified
- In performance-critical code where function call overhead is a concern
- In legacy code that would require significant refactoring
- When implementing certain design patterns that intentionally combine responsibilities

## Further Reading

- [The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)
- [SOLID Principles: Single Responsibility](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#single-responsibility-principle)
- [Cohesion and Coupling: The Difference](https://enterprisecraftsmanship.com/posts/cohesion-coupling-difference/)
- [Function Composition in JavaScript](https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea)
