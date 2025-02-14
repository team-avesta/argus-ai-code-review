#!/usr/bin/env node

import { Command } from 'commander';
import { ESLint } from 'eslint';
import chalk from 'chalk';
import { glob } from 'glob';
import * as fs from 'fs/promises';
import rules from './index-rule';
import { AIReviewService } from './services/ai-review-service';
import { AIReviewConfig } from './prompts/system-prompts';

// Register the plugin
const plugin = {
  rules: rules.rules,
  processors: rules.processors,
};

const program = new Command();

program
  .name('avesta-code-review')
  .description('CLI tool for automated code review and best practices analysis')
  .version('1.0.0');

async function loadConfig(configPath: string) {
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configContent);
  } catch (error: unknown) {
    console.error(chalk.red(`Error loading config from ${configPath}:`), error);
    process.exit(1);
  }
}

program
  .command('check')
  .description('Check files for rule violations')
  .argument('<patterns...>', 'Files or glob patterns to check (e.g., "src/**/*.tsx")')
  .option('-c, --config <path>', 'Path to config file', '.avestarc.json')
  .action(async (patterns: string[], options) => {
    try {
      const files = await glob(patterns, { ignore: ['node_modules/**'] });

      if (files.length === 0) {
        console.log(chalk.yellow('No files found matching the provided patterns'));
        return;
      }

      const config = await loadConfig(options.config);
      const eslintConfig: any = {
        baseConfig: {
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            ecmaFeatures: {
              jsx: true,
            },
          },
          extends: [],
          plugins: ['@typescript-eslint', 'avesta-code-review'],
          rules: {},
          ignorePatterns: ['node_modules/**'],
          env: {
            node: true,
            es6: true,
          },
          processor: 'avesta-code-review/.ts',
        },
        plugins: {
          'avesta-code-review': plugin,
        },
        overrideConfigFile: options.config,
        useEslintrc: false,
        overrideConfig: {
          plugins: ['avesta-code-review'],
          rules: {},
        },
      };

      const eslint = new ESLint(eslintConfig);

      const results = await eslint.lintFiles(files);
      const formatter = await eslint.loadFormatter('stylish');
      const resultText = formatter.format(results, {
        cwd: process.cwd(),
        rulesMeta: eslint.getRulesMetaForResults(results),
      });

      if (resultText) {
        console.log(resultText);
        const errorCount = results.reduce((count, result) => count + result.errorCount, 0);
        const warningCount = results.reduce((count, result) => count + result.warningCount, 0);

        if (errorCount > 0) {
          console.log(chalk.red(`\n✖ Found ${errorCount} error${errorCount === 1 ? '' : 's'}`));
        }
        if (warningCount > 0) {
          console.log(
            chalk.yellow(`\n⚠ Found ${warningCount} warning${warningCount === 1 ? '' : 's'}`),
          );
        }
        if (errorCount === 0 && warningCount === 0) {
          console.log(chalk.green('\n✔ No ESLint issues found'));
        }
      } else {
        console.log(chalk.green('✔ No ESLint issues found'));
      }

      // Run AI review if enabled in config
      if (config.settings?.aiReview?.enabled) {
        console.log('\nRunning AI code review...');
        const aiReviewConfig: AIReviewConfig = {
          rules: {
            'function-length': {
              enabled: config.settings.aiReview.rules?.['function-length']?.enabled ?? true,
              maxLines: config.settings.aiReview.rules?.['function-length']?.maxLines ?? 20,
            },
            'function-complexity': {
              enabled: config.settings.aiReview.rules?.['function-complexity']?.enabled ?? true,
              metrics: config.settings.aiReview.rules?.['function-complexity']?.metrics ?? [
                'cyclomatic',
                'cognitive',
              ],
            },
            'single-responsibility': {
              enabled: config.settings.aiReview.rules?.['single-responsibility']?.enabled ?? true,
            },
          },
        };
        const aiReviewService = new AIReviewService(aiReviewConfig);
        await aiReviewService.reviewStagedFiles();
      } else {
        console.log('\nAI code review is disabled');
      }
    } catch (error: unknown) {
      console.error(chalk.red('Error running checks:'), error);
      process.exit(1);
    }
  });

program.parse();
