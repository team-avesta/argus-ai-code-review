import { ESLint } from 'eslint';
import path from 'path';
import rules from '../../index-rule';

describe('Plugin Configuration', () => {
    it('should only apply custom rules, not eslint:recommended', async () => {
        const plugin = { rules };
        const eslint = new ESLint({
            baseConfig: {
                parser: '@typescript-eslint/parser',
                extends: [], // Prevent inheriting any recommended configs
                plugins: ['avesta'],
                rules: {},
            },
            plugins: {
                avesta: plugin as any,
            },
            useEslintrc: false,
        } as any);

        const code = 'const unusedVar = 5;\n';

        const results = await eslint.lintText(code);
        expect(results[0].messages).toHaveLength(0); // Should have no errors since no-unused-vars should be ignored
    });
}); 
