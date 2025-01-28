#!/usr/bin/env node

import { Command } from 'commander';
import { ESLint } from 'eslint';
import chalk from 'chalk';
import { glob } from 'glob';
import path from 'path';
import rules from './index-rule';

// Register the plugin
const plugin = {
  rules: rules as any,
};

const program = new Command();

program
  .name('avesta-review')
  .description('CLI tool for automated code review and best practices analysis')
  .version('1.0.0');

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

      const eslint = new ESLint({
        baseConfig: {
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            ecmaFeatures: {
              jsx: true,
            },
            project: null,
          },
          extends: [],
          plugins: ['avesta'],
          rules: {},
          ignorePatterns: ['node_modules/**'],
          env: {
            node: true,
            es6: true,
          },
        },
        plugins: {
          avesta: plugin,
        },
        overrideConfigFile: options.config,
        resolvePluginsRelativeTo: path.resolve(__dirname, '..'),
        useEslintrc: false,
        overrideConfig: {
          plugins: ['avesta'],
        },
      });

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
          console.log(chalk.green('\n✔ No issues found'));
        }
      } else {
        console.log(chalk.green('✔ No issues found'));
      }
    } catch (error) {
      console.error(chalk.red('Error running checks:'), error);
      process.exit(1);
    }
  });

program.parse();
