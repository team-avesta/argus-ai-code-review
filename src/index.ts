#!/usr/bin/env node

import { Command } from 'commander';
import { ESLint } from 'eslint';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('avesta-review')
  .description('CLI tool for automated code review and best practices analysis')
  .version('1.0.0');

program
  .command('check')
  .description('Check files for rule violations')
  .argument('<files>', 'Files or patterns to check (e.g., "src/**/*.tsx")')
  .option('-c, --config <path>', 'Path to config file', '.avestarc.json')
  .action(async (files, options) => {
    try {
      const eslint = new ESLint({
        overrideConfigFile: options.config,
        overrideConfig: {
          parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            ecmaFeatures: {
              jsx: true,
            },
            parser: '@typescript-eslint/parser',
          },
          plugins: ['avesta-code-review'],
          rules: {
            'avesta-code-review/react-props-helper': [
              'error',
              {
                complexity: {
                  maxInlineProps: 2,
                  maxTernaryOperations: 1,
                  ignoreProps: ['style'],
                },
              },
            ],
          },
        },
        useEslintrc: false,
        resolvePluginsRelativeTo: path.resolve(__dirname, '..'),
      } as any);

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
