import { RuleTester } from 'eslint';
import rule from '../react-props-helper';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
} as {
  parser: string;
  parserOptions: { ecmaVersion: number; sourceType: string; ecmaFeatures: { jsx: boolean } };
});

// Test cases with TypeScript types and interfaces
ruleTester.run('avesta-code-review/react-props-helper', rule, {
  valid: [
    {
      code: `
                interface CardData {
                    bed: number;
                    bathroom: number;
                    heading: string;
                }

                interface Props {
                    data: CardData;
                    showPlaceHolder?: boolean;
                }

                interface PropertyData {
                    bedrooms: number;
                    bathrooms: number;
                    title: string;
                }

                const getSalesPropertiesDetails = (data: PropertyData): CardData => ({
                    bed: data.bedrooms,
                    bathroom: data.bathrooms,
                    heading: data.title,
                });

                const MyComponent: React.FC<Props> = () => (
                    <Card
                        data={getSalesPropertiesDetails(data)}
                        showPlaceHolder
                    />
                );
            `,
    },
    {
      code: `
                interface StyleProps {
                    color: string;
                    width?: number;
                }

                const MyComponent: React.FC = () => (
                    <Card
                        title="Simple String"
                        count={42}
                        isEnabled={true}
                        style={{ color: 'red', width: 100 }}
                    />
                );
            `,
    },
    {
      code: `
                type CardProps = {
                    title: string;
                    description: string;
                };

                const getCardProps = (data: any): CardProps => ({
                    title: data.title,
                    description: data.description,
                });

                const MyComponent = () => (
                    <Card
                        {...getCardProps(data)}
                        showPlaceHolder
                    />
                );
            `,
    },
    {
      // Now valid since we're not checking ternary operations
      code: `
                const MyComponent = () => (
                    <div>
                        <Card
                            data={{
                                bed: isNewListing ? 0 : data.bedrooms,
                                bathroom: isNewListing ? 0 : data.bathrooms,
                            }}
                        />
                    </div>
                );
            `,
    },
  ],
  invalid: [
    {
      code: `
                interface CardData {
                    bed: number;
                    bathroom: number;
                    heading: string;
                }

                const MyComponent: React.FC = () => (
                    <Card
                        data={{
                            bed: data.bedrooms,
                            bathroom: data.bathrooms,
                            heading: data.title,
                        } as CardData}
                        showPlaceHolder
                    />
                );
            `,
      errors: [
        {
          message: 'Complex props should be extracted into a helper function',
          type: 'ObjectExpression',
        },
      ],
    },
    {
      code: `
                interface NestedData {
                    title: string;
                    description: string;
                }

                const MyComponent = () => (
                    <div>
                        <Card
                            config={{
                                title: \`\${data.title} - \${data.id}\`,
                                description: getDescription(data),
                                extraInfo: data.info,
                            } as NestedData}
                        />
                    </div>
                );
            `,
      errors: [
        {
          message: 'Complex props should be extracted into a helper function',
          type: 'ObjectExpression',
        },
      ],
    },
    {
      code: `
                const MyComponent = () => (
                    <Card
                        data={{
                            title: getTitle(),
                            description: getDescription(),
                            image: getImage(),
                            url: getUrl(),
                        }}
                    />
                );
            `,
      errors: [
        {
          message: 'Complex props should be extracted into a helper function',
          type: 'ObjectExpression',
        },
      ],
    },
  ],
});
