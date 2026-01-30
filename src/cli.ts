#!/usr/bin/env bun

import { Command } from 'commander';
import { generateChangelog } from './generator.js';
import { initConfig } from './config.js';

const program = new Command();

program
  .name('scribbly')
  .description('AI-powered auto-documentation CLI');

program
  .command('generate')
  .description('Generate changelog from commits')
  .action(async () => {
    await generateChangelog();
  });

program
  .command('init')
  .description('Create default configuration')
  .action(() => {
    initConfig();
  });

program.parse();
