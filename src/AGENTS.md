# src/ Directory

Entry point modules for scribbly CLI.

## Files

| File | Purpose |
|------|---------|
| `cli.ts` | CLI entry point, command routing |
| `config.ts` | Config loader (file + env) |
| `generator.ts` | Markdown generation with Handlebars |

## Subdirectories

- `ai/` → AI enhancement (commit summaries)
- `parsers/` → Code parsing (commits, etc.)

## Key Exports

```typescript
// cli.ts
export { main } from './cli.js';

// config.ts
export function loadConfig(): ScribblyConfig;
export function initConfig(): void;

// generator.ts
export async function generateChangelog(): Promise<void>;
```
