# React Props Helper Function (react-props-helper)

Enforces the use of helper functions for complex prop objects in React components to improve code readability and maintainability.

## Rule Details

This rule aims to prevent complex inline object literals in JSX props by requiring them to be extracted into helper functions. It supports both JavaScript and TypeScript codebases, with special handling for type assertions and interfaces.

### What is considered "complex"?

An object literal is considered complex if it meets any of these criteria:

- Has more properties than `maxInlineProps` (default: 2)
- Contains template literals
- Contains multiple function calls
- Is nested within another JSX component (lower threshold applies)

## Examples

### ❌ Incorrect

```tsx
// Too many properties
interface CardData {
  bed: number;
  bathroom: number;
  heading: string;
}

const MyComponent = () => (
  <Card
    data={
      {
        bed: data.bedrooms,
        bathroom: data.bathrooms,
        heading: data.title,
      } as CardData
    }
  />
);

// Contains template literals
const LocationComponent = () => (
  <Address
    location={{
      full: `${street}, ${city}`,
      short: `${city}, ${state}`,
    }}
  />
);

// Multiple function calls
const ImageComponent = () => (
  <Image
    sources={{
      main: getImageUrl(data.mainImage),
      thumbnail: getImageUrl(data.thumbnail),
    }}
  />
);

// Nested components with complex props
const NestedComponent = () => (
  <Container>
    <Card
      data={{
        title: getTitle(),
        description: getDescription(),
      }}
    />
  </Container>
);
```

### ✅ Correct

```tsx
// Using helper function with TypeScript interface
interface CardData {
  bed: number;
  bathroom: number;
  heading: string;
}

const getCardData = (data: any): CardData => ({
  bed: data.bedrooms,
  bathroom: data.bathrooms,
  heading: data.title,
});

const MyComponent = () => <Card data={getCardData(data)} />;

// Simple inline props are fine
const SimpleComponent = () => <Card title="Simple String" count={42} isEnabled={true} />;

// Using spread operator with helper
type InfoContent = {
  title: string;
  status: string;
};

const getInfoContent = (data: any): InfoContent => ({
  title: data.title,
  status: data.status,
});

const InfoComponent = () => <Info content={getInfoContent(data)} />;
```

## Options

```json
{
  "react-props-helper": [
    "error",
    {
      "complexity": {
        "maxInlineProps": 2, // Maximum number of properties allowed inline
        "ignoreProps": ["style"] // Props to ignore from the rule
      }
    }
  ]
}
```

### complexity.maxInlineProps

Type: `number`  
Default: `2`

Maximum number of properties allowed in an inline object literal before requiring extraction to a helper function. For nested components, this threshold is automatically lowered by 1.

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
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)
- [Clean Code in React](https://github.com/ryanmcdermott/clean-code-javascript#objects-and-data-structures)
