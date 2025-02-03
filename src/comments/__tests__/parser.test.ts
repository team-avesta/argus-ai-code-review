import { parseComments } from '../parser';
import { InvalidCommentError, InvalidRuleNameError } from '../types';

describe('Comment Parser', () => {
  describe('Basic Comment Detection', () => {
    it('should detect disable-next-line comments', () => {
      const source = `
// avesta-disable-next-line rule1
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1']));
    });

    it('should detect file-level disable comments', () => {
      const source = `
/* avesta-disable rule1 */
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledRules).toEqual(new Set(['rule1']));
      expect(result.isFileDisabled).toBe(false);
    });

    it('should parse multiple rules in single comment', () => {
      const source = `
// avesta-disable-next-line rule1, rule2
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1', 'rule2']));
    });

    it('should handle whitespace variations', () => {
      const sources = [
        '//avesta-disable-next-line rule1',
        '//  avesta-disable-next-line   rule1',
        '//avesta-disable-next-line rule1,rule2',
        '//avesta-disable-next-line rule1 ,  rule2',
      ];

      sources.forEach((source) => {
        console.log('Testing source:', source);
        const result = parseComments({ source, filename: 'test.ts' });
        console.log('Result:', result);
        const disabled = result.disabledLines.get(2);
        console.log('Disabled:', disabled);
        expect(disabled?.has('rule1')).toBe(true);
      });
    });
  });

  describe('Rule State Management', () => {
    it('should track disabled rules per line', () => {
      const source = `
// avesta-disable-next-line rule1
const a = 1;
// avesta-disable-next-line rule2
const b = 2;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1']));
      expect(result.disabledLines.get(4)).toEqual(new Set(['rule2']));
    });

    it('should manage file-level disabled rules', () => {
      const source = `
/* avesta-disable rule1 */
const a = 1;
/* avesta-disable rule2 */
const b = 2;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledRules).toEqual(new Set(['rule1', 'rule2']));
    });

    it('should handle multiple disable comments on consecutive lines', () => {
      const source = `
// avesta-disable-next-line rule1
// avesta-disable-next-line rule2
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(3)).toEqual(new Set(['rule1', 'rule2']));
    });
  });

  describe('Comment Validation', () => {
    it('should throw on invalid rule names', () => {
      const invalidRuleNames = [
        '@invalid-rule',
        '!bad-rule',
        'Invalid_Rule',
        'UPPERCASE-RULE',
        'spaces in rule',
        'no-special-$chars',
      ];

      invalidRuleNames.forEach((ruleName) => {
        const source = `// avesta-disable-next-line ${ruleName}`;
        expect(() => parseComments({ source, filename: 'test.ts' })).toThrow(InvalidRuleNameError);
      });
    });

    it('should throw on invalid comment formats', () => {
      const invalidComments = [
        '// disable-next-line rule1', // missing prefix
        '// avesta-disable-something rule1', // invalid type
        '// avesta-disable-next-line', // missing rules
        '/* avesta-disable */', // missing rules
        '// avesta-disable-next-line ,rule1', // invalid comma placement
        '// avesta-disable-next-line rule1,,rule2', // double comma
      ];

      invalidComments.forEach((source) => {
        expect(() => parseComments({ source, filename: 'test.ts' })).toThrow(InvalidCommentError);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty source', () => {
      const result = parseComments({ source: '', filename: 'test.ts' });
      expect(result.disabledRules.size).toBe(0);
      expect(result.disabledLines.size).toBe(0);
      expect(result.isFileDisabled).toBe(false);
    });

    it('should handle source with only comments', () => {
      const source = `
// Just a regular comment
/* Another comment */
// avesta-disable-next-line rule1
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.size).toBe(0); // No next line to disable
    });

    it('should handle comments in template literals', () => {
      const source = '`// avesta-disable-next-line rule1`';
      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.size).toBe(0); // Should ignore comments in strings
    });

    it('should handle comments in strings', () => {
      const source = '"// avesta-disable-next-line rule1"';
      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.size).toBe(0); // Should ignore comments in strings
    });

    it('should handle mixed line endings', () => {
      const source =
        '// avesta-disable-next-line rule1\r\nconst a = 1;\n// avesta-disable-next-line rule2\rconst b = 2;';
      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1']));
      expect(result.disabledLines.get(4)).toEqual(new Set(['rule2']));
    });
  });

  describe('Real World Examples', () => {
    it('should handle complex React component', () => {
      const source = `
/* avesta-disable react-props-helper */
import React from 'react';

// avesta-disable-next-line handle-negative-first
function Component({ data }) {
  if (data.isValid) {
    return <div>{data.content}</div>;
  }
  return null;
}
      `.trim();

      const result = parseComments({ source, filename: 'Component.tsx' });
      expect(result.disabledRules).toEqual(new Set(['react-props-helper']));
      expect(result.disabledLines.get(5)).toEqual(new Set(['handle-negative-first']));
    });

    it('should handle multiple rules in TypeScript', () => {
      const source = `
// avesta-disable-next-line handle-negative-first, react-props-helper
class Service {
  constructor(private readonly client: Client) {}
  
  async process() {
    /* avesta-disable handle-negative-first */
    if (this.client.isConnected) {
      return this.client.send();
    }
  }
}
      `.trim();

      const result = parseComments({ source, filename: 'service.ts' });
      expect(result.disabledLines.get(2)).toEqual(
        new Set(['handle-negative-first', 'react-props-helper']),
      );
      expect(result.disabledRules).toEqual(new Set(['handle-negative-first']));
    });
  });
});
