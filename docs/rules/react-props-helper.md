# React Props Helper Function (react-props-helper)

Enforces the use of helper functions for complex prop objects in React components to improve code readability and maintainability.

## Rule Details

This rule aims to prevent complex inline object literals in JSX props by requiring them to be extracted into helper functions.

### What is considered "complex"?

An object literal is considered complex if it meets any of these criteria:
- Has more properties than `maxInlineProps` (default: 2)
- Contains more ternary operations than `maxTernaryOperations` (default: 1)
- Contains template literals
- Contains multiple function calls

Additionally, the complexity threshold is automatically lowered for nested components to encourage cleaner code structure.

## Examples

### ❌ Incorrect

```jsx
// Too many properties
<Card
  data={{
    bed: data.bedrooms,
    bathroom: data.bathrooms,
    heading: data.title,
  }}
/>

// Contains ternary operations
<Info
  content={{
    title: isNew ? 'New Listing' : 'Property',
    status: isPending ? 'Pending' : 'Available',
  }}
/>

// Contains template literals
<Address
  location={{
    full: `${street}, ${city}`,
    short: `${city}, ${state}`,
  }}
/>

// Multiple function calls
<Image
  sources={{
    main: getImageUrl(data.mainImage),
    thumbnail: getImageUrl(data.thumbnail),
  }}
/>
```

### ✅ Correct

```jsx
// Using helper function
const getCardData = (data) => ({
  bed: data.bedrooms,
  bathroom: data.bathrooms,
  heading: data.title,
});

<Card data={getCardData(data)} />

// Simple inline props are fine
<Card
  title="Simple String"
  count={42}
  isEnabled={true}
/>

// Using spread operator with helper
const getInfoContent = (isNew, isPending) => ({
  title: isNew ? 'New Listing' : 'Property',
  status: isPending ? 'Pending' : 'Available',
});

<Info content={getInfoContent(isNew, isPending)} />
```

## Options

The rule accepts the following options:

```js
{
  "react-props-helper": ["error", {
    "complexity": {
      "maxInlineProps": 2,        // Maximum number of properties allowed inline
      "maxTernaryOperations": 1,  // Maximum number of ternary operations allowed
      "ignoreProps": ["style"]    // Props to ignore from the rule
    }
  }]
}
```

### complexity.maxInlineProps

Type: `number`
Default: `2`

Maximum number of properties allowed in an inline object literal before requiring extraction to a helper function.

### complexity.maxTernaryOperations

Type: `number`
Default: `1`

Maximum number of ternary operations allowed in an inline object literal before requiring extraction.

### complexity.ignoreProps

Type: `string[]`
Default: `[]`

List of prop names to ignore from this rule. Useful for props that commonly use inline objects (like `style`).

## When Not To Use It

- If you prefer inline object literals for props regardless of complexity
- If your components rarely use complex prop objects
- If you're working on a small prototype or proof of concept

## Further Reading

- [React Props Documentation](https://react.dev/learn/passing-props-to-a-component)
- [JavaScript Object Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals)
- [Clean Code in React](https://github.com/ryanmcdermott/clean-code-javascript#objects-and-data-structures) 