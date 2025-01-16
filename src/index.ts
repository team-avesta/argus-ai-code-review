#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
    .name('avesta-review')
    .description('CLI tool for code review and best practices analysis')
    .version('1.0.0');

program
    .command('analyze')
    .description('Analyze code for best practices')
    .argument('<path>', 'Path to analyze')
    .option('-c, --config <path>', 'Path to config file')
    .action((path, options) => {
        console.log(chalk.blue(`Analyzing path: ${path}`));
        // TODO: Implement analysis logic
    });

program.parse(); 