# AGENTS.md - Scribbly

*AI-powered auto-documentation CLI*

## Quick Start

```bash
cd scribbly
bun install
bun run cli generate    # Generate changelog
bun run cli init        # Create config
bun run cli help        # Show help
```

## Project Structure

```
scribbly/
├── src/
│   ├── cli.ts           # CLI entry point (bun run src/cli.ts <command>)
│   ├── config.ts        # Config loading (scribbly.config.json + OPENAI_API_KEY env)
│   ├── generator.ts     # Handlebars markdown generation
│   ├── ai/
│   │   └── enhancer.ts  # AI SDK for commit summaries
│   └── parsers/
│       └── commits.ts   # Conventional commit parsing with Zod
├── templates/
│   └── changelog.hbs    # Handlebars template for CHANGELOG.md
└── scribbly.config.json # Config file
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run cli generate` | Parse git commits → generate CHANGELOG.md |
| `bun run cli init` | Create default `scribbly.config.json` |
| `bun run cli help` | Show help |

## Config

`scribbly.config.json`:
```json
{
  "openaiApiKey": "sk-...",     // Optional: for AI enhancement
  "model": "gpt-4o",            // AI model (default: gpt-4o)
  "outputPath": "./CHANGELOG.md", // Output file
  "templatePath": "./templates/changelog.hbs" // Custom template
}
```

Or use `OPENAI_API_KEY` environment variable.

## Branch Workflow

- `main` → development branch (protected)
- `dev` → feature branches → PR to dev → greptile review → merge
- Feature branches → PR to dev → review → merge to main

## Testing

```bash
bun run cli init
bun run cli generate
cat CHANGELOG.md
```

## Stack

- Bun + TypeScript
- Zod (validation)
- @ai-sdk/openai (AI)
- Handlebars (templating)

## Notes

- Conventional commits: `type(scope): message`
- AI enhancement requires `OPENAI_API_KEY` or config
- Greptile reviews PRs automatically
