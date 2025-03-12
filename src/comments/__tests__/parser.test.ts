import { parseComments } from '../parser';
import { InvalidCommentError, InvalidRuleNameError } from '../types';

describe('Comment Parser', () => {
  describe('Basic Comment Detection', () => {
    it('should detect disable-next-line comments', () => {
      const source = `
// argus-disable-next-line rule1
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1']));
    });

    it('should detect file-level disable comments', () => {
      const source = `
/* argus-disable rule1 */
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledRules).toEqual(new Set(['rule1']));
      expect(result.isFileDisabled).toBe(false);
    });

    it('should parse multiple rules in single comment', () => {
      const source = `
// argus-disable-next-line rule1, rule2
const test = true;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1', 'rule2']));
    });

    it('should handle whitespace variations', () => {
      const sources = [
        '//argus-disable-next-line rule1',
        '//  argus-disable-next-line   rule1',
        '//argus-disable-next-line rule1,rule2',
        '//argus-disable-next-line rule1 ,  rule2',
      ];

      sources.forEach((source) => {
        const result = parseComments({ source, filename: 'test.ts' });
        const disabled = result.disabledLines.get(2);
        expect(disabled?.has('rule1')).toBe(true);
      });
    });
  });

  describe('Rule State Management', () => {
    it('should track disabled rules per line', () => {
      const source = `
// argus-disable-next-line rule1
const a = 1;
// argus-disable-next-line rule2
const b = 2;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1']));
      expect(result.disabledLines.get(4)).toEqual(new Set(['rule2']));
    });

    it('should manage file-level disabled rules', () => {
      const source = `
/* argus-disable rule1 */
const a = 1;
/* argus-disable rule2 */
const b = 2;
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledRules).toEqual(new Set(['rule1', 'rule2']));
    });

    it('should handle multiple disable comments on consecutive lines', () => {
      const source = `
// argus-disable-next-line rule1
// argus-disable-next-line rule2
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
        const source = `// argus-disable-next-line ${ruleName}`;
        expect(() => parseComments({ source, filename: 'test.ts' })).toThrow(InvalidRuleNameError);
      });
    });

    it('should throw on invalid comment formats', () => {
      const invalidComments = [
        '// disable-next-line rule1', // missing prefix
        '// argus-disable-something rule1', // invalid type
        '// argus-disable-next-line', // missing rules
        '/* argus-disable */', // missing rules
        '// argus-disable-next-line ,rule1', // invalid comma placement
        '// argus-disable-next-line rule1,,rule2', // double comma
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
// argus-disable-next-line rule1
      `.trim();

      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.size).toBe(0); // No next line to disable
    });

    it('should handle comments in template literals', () => {
      const source = '`// argus-disable-next-line rule1`';
      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.size).toBe(0); // Should ignore comments in strings
    });

    it('should handle comments in strings', () => {
      const source = '"// argus-disable-next-line rule1"';
      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.size).toBe(0); // Should ignore comments in strings
    });

    it('should handle mixed line endings', () => {
      const source =
        '// argus-disable-next-line rule1\r\nconst a = 1;\n// argus-disable-next-line rule2\rconst b = 2;';
      const result = parseComments({ source, filename: 'test.ts' });
      expect(result.disabledLines.get(2)).toEqual(new Set(['rule1']));
      expect(result.disabledLines.get(4)).toEqual(new Set(['rule2']));
    });
  });

  describe('Real World Examples', () => {
    it('should handle complex React component', () => {
      const source = `
/* argus-disable react-props-helper */
import React from 'react';

// argus-disable-next-line handle-negative-first
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
// argus-disable-next-line handle-negative-first, react-props-helper
class Service {
  constructor(private readonly client: Client) {}
  
  async process() {
    /* argus-disable handle-negative-first */
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

  describe('JSX Comment Format', () => {
    it('should handle JSX comment format', () => {
      const sources = [
        '{/* @argus-disable-next-line rule1 */}',
        '{/* @argus-disable-next-line rule1,rule2 */}',
        '{/* argus-disable-next-line rule1 */}', // Also support without @
      ];

      sources.forEach((source) => {
        const result = parseComments({ source, filename: 'test.tsx' });
        const disabled = result.disabledLines.get(2);
        expect(disabled?.has('rule1')).toBe(true);
      });
    });
  });
});
