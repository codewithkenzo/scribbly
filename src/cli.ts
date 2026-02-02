#!/usr/bin/env bun

import { parseArgs } from 'node:util';
import { generateChangelog } from './generator.js';
import { initConfig } from './config.js';
import { generateApiDocs } from './commands/api.js';
import { generateReadme } from './commands/readme.js';
import { watchMode } from './commands/watch.js';

const args = parseArgs({
  args: Bun.argv,
  options: {
    help: { type: 'boolean', short: 'h' },
  },
  strict: false,
  allowPositionals: true,
});

const command = args.positionals[2];

async function main() {
  switch (command) {
    case 'generate':
      try {
        await generateChangelog();
      } catch (error) {
        console.error('Error generating changelog:', error);
        process.exit(1);
      }
      break;
    case 'api':
      try {
        await generateApiDocs();
      } catch (error) {
        console.error('Error generating API docs:', error);
        process.exit(1);
      }
      break;
    case 'readme':
      try {
        await generateReadme();
      } catch (error) {
        console.error('Error generating README:', error);
        process.exit(1);
      }
      break;
    case 'watch':
      try {
        await watchMode();
      } catch (error) {
        console.error('Error starting watch mode:', error);
        process.exit(1);
      }
      break;
    case 'init':
      initConfig();
      break;
    case 'help':
    case undefined:
      console.log(`
Scribbly - AI-powered auto-documentation CLI

Usage:
  scribbly generate    Generate changelog from commits
  scribbly api         Generate API.md from TypeScript
  scribbly readme      Scaffold README.md from project
  scribbly watch       Auto-regenerate docs on file changes
  scribbly init        Create default config
  scribbly help        Show this help
`);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
