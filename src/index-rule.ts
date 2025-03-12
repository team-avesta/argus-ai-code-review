import reactPropsHelper from './rules/react-props-helper';
import prometheusLabelConfig from './rules/prometheus-label-config';
import handleNegativeFirst from './rules/handle-negative-first';
import { parseComments } from './comments/parser';
import { Linter } from 'eslint';

// Export rules
const rules = {
  'react-props-helper': reactPropsHelper,
  'prometheus-label-config': prometheusLabelConfig,
  'handle-negative-first': handleNegativeFirst,
};

// Store processor state
const processorStates = new Map<string, ReturnType<typeof parseComments>>();

// Export processors for handling comments
const processors: Record<string, Linter.Processor> = {
  '.ts': {
    preprocess(text: string, filename: string) {
      // Parse comments before processing
      const state = parseComments({ source: text, filename });
      processorStates.set(filename, state);
      return [text];
    },
    postprocess(messages: Linter.LintMessage[][], filename: string) {
      const state = processorStates.get(filename);
      if (!state) return messages[0];

      // Filter out messages for disabled rules
      return messages[0].filter((message) => {
        const line = message.line;
        const ruleId = message.ruleId?.replace('argus-ai-code-review/', '');

        if (!ruleId) return true;

        // Check if rule is disabled for this line
        const lineDisabled = state.disabledLines.get(line);
        if (lineDisabled?.has(ruleId)) {
          return false;
        }

        // Check if rule is disabled for the file
        if (state.disabledRules.has(ruleId)) {
          return false;
        }

        return true;
      });
    },
    supportsAutofix: true,
  },
  '.tsx': {
    preprocess(text: string, filename: string) {
      const state = parseComments({ source: text, filename });
      processorStates.set(filename, state);
      return [text];
    },
    postprocess(messages: Linter.LintMessage[][], filename: string) {
      const state = processorStates.get(filename);
      if (!state) return messages[0];

      return messages[0].filter((message) => {
        const line = message.line;
        const ruleId = message.ruleId?.replace('argus-ai-code-review/', '');
        if (!ruleId) return true;
        const lineDisabled = state.disabledLines.get(line);
        if (lineDisabled?.has(ruleId)) return false;
        if (state.disabledRules.has(ruleId)) return false;
        return true;
      });
    },
    supportsAutofix: true,
  },
};

export default {
  rules,
  processors,
};
