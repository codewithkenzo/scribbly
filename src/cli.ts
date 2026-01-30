#!/usr/bin/env bun

import { parseArgs } from 'util';
import { generateChangelog } from './generator.js';
import { initConfig } from './config.js';

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
    case 'init':
      initConfig();
      break;
    case 'help':
    case undefined:
      console.log(`
Scribbly - AI-powered auto-documentation CLI

Usage:
  bun run cli generate    Generate changelog from commits
  bun run cli init        Create default config
  bun run cli help        Show this help
`);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
