import { RuleTester } from 'eslint';
import rule from '../react-props-helper';

const ruleTester = new RuleTester();

// Configure parser globally
ruleTester.run('react-props-helper', rule, {
    valid: [
        {
            code: `
                const getSalesPropertiesDetails = (data) => ({
                    bed: data.bedrooms,
                    bathroom: data.bathrooms,
                    heading: data.title,
                });

                const MyComponent = () => (
                    <Card
                        data={getSalesPropertiesDetails(data)}
                        showPlaceHolder
                    />
                );
            `,
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                parser: '@typescript-eslint/parser',
            },
        } as any,
        {
            code: `
                const MyComponent = () => (
                    <Card
                        title="Simple String"
                        count={42}
                        isEnabled={true}
                        style={{ color: 'red' }}
                    />
                );
            `,
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                parser: '@typescript-eslint/parser',
            },
        } as any,
        {
            code: `
                const getCardProps = (data) => ({
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
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                parser: '@typescript-eslint/parser',
            },
        } as any,
    ],
    invalid: [
        {
            code: `
                const MyComponent = () => (
                    <Card
                        data={{
                            bed: data.bedrooms,
                            bathroom: data.bathrooms,
                            heading: data.title,
                        }}
                        showPlaceHolder
                    />
                );
            `,
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                parser: '@typescript-eslint/parser',
            },
            errors: [{
                message: 'Complex props should be extracted into a helper function',
                type: 'ObjectExpression',
            }],
        } as any,
        {
            code: `
                const MyComponent = () => (
                    <div>
                        <Card
                            data={{
                                bed: data.bedrooms,
                                bathroom: data.bathrooms,
                            }}
                        />
                        <Card
                            config={{
                                title: data.title,
                                description: data.description,
                            }}
                        />
                    </div>
                );
            `,
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                parser: '@typescript-eslint/parser',
            },
            errors: [
                {
                    message: 'Complex props should be extracted into a helper function',
                    type: 'ObjectExpression',
                },
                {
                    message: 'Complex props should be extracted into a helper function',
                    type: 'ObjectExpression',
                },
            ],
        } as any,
    ],
}); 