<p align="center"><img src="assets/logo.png" width="120" alt="scribbly logo"></p>

<p align="center">
  <a href="https://www.npmjs.com/package/scribbly"><img src="https://img.shields.io/npm/v/scribbly" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/scribbly"><img src="https://img.shields.io/npm/dm/scribbly" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
</p>

# scribbly

**AI-powered documentation generation CLI** that automatically creates comprehensive docs, API references, and READMEs from your codebase using OpenAI.

Generate professional documentation in seconds. No manual writing required.

## Features

- 🤖 **AI-Powered** - Uses OpenAI to intelligently analyze and document your code
- 📝 **Multiple Output Formats** - Generate READMEs, API docs, changelogs, and more
- 🎨 **Customizable Templates** - Handlebars-based templates for full control
- ⚡ **Watch Mode** - Live documentation updates as you code
- 🔧 **TypeScript Support** - First-class TypeScript support with full type inference
- ⚙️ **Easy Configuration** - Simple config file to get started

## Installation

### Using Bun (Recommended)

```bash
bun install -g scribbly
```

### Using npm

```bash
npm install -g scribbly
```

## Quick Start

### 1. Initialize Configuration

```bash
scribbly init
```

This creates a `scribbly.config.json` config file in your project.

### 2. Set Your OpenAI API Key

```bash
export OPENAI_API_KEY=sk_your_key_here
```

### 3. Generate Documentation

```bash
scribbly generate
```

## Usage

### Commands

#### `scribbly generate`
Generate all documentation based on your configuration.

```bash
scribbly generate
```

#### `scribbly api`
Generate API documentation from your codebase.

```bash
scribbly api --output docs/api.md
```

#### `scribbly readme`
Generate or update your project README.

```bash
scribbly readme --output README.md
```

#### `scribbly watch`
Watch for file changes and regenerate documentation in real-time.

```bash
scribbly watch
```

#### `scribbly init`
Initialize a new scribbly configuration file.

```bash
scribbly init
```

## Configuration

Create a `.scribblyrc.json` file in your project root:

```json
{
  "openai": {
    "apiKey": "${OPENAI_API_KEY}",
    "model": "gpt-4"
  },
  "input": {
    "include": ["src/**/*.ts", "src/**/*.tsx"],
    "exclude": ["**/*.test.ts", "**/*.spec.ts"]
  },
  "output": {
    "readme": "README.md",
    "api": "docs/api.md",
    "changelog": "CHANGELOG.md"
  },
  "templates": {
    "readme": "templates/readme.hbs",
    "api": "templates/api.hbs"
  }
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `openai.apiKey` | string | Your OpenAI API key (use env var: `${OPENAI_API_KEY}`) |
| `openai.model` | string | OpenAI model to use (default: `gpt-4`) |
| `input.include` | string[] | Glob patterns for files to document |
| `input.exclude` | string[] | Glob patterns for files to ignore |
| `output.readme` | string | Output path for README |
| `output.api` | string | Output path for API documentation |
| `output.changelog` | string | Output path for changelog |
| `templates.*` | string | Custom Handlebars template paths |

## Environment Variables

- `OPENAI_API_KEY` (required) - Your OpenAI API key for documentation generation

## Examples

### Generate API Documentation Only

```bash
scribbly api --output docs/api.md --template templates/custom-api.hbs
```

### Watch Mode with Custom Config

```bash
scribbly watch --config custom.scribblyrc.json
```

### Generate README from Specific Files

```bash
scribbly readme --include "src/index.ts" --include "src/types.ts"
```

## How It Works

1. **Scans** your codebase based on include/exclude patterns
2. **Analyzes** code structure, exports, and comments using OpenAI
3. **Generates** documentation using Handlebars templates
4. **Outputs** formatted markdown files to your specified locations

## Templates

Scribbly uses Handlebars for templating. Create custom templates in your project:

```handlebars
# {{projectName}}

{{description}}

## Installation

```bash
npm install {{packageName}}
```

## API

{{#each exports}}
### {{this.name}}

{{this.description}}

{{/each}}
```

See `templates/` directory for built-in template examples.

## Troubleshooting

### "OPENAI_API_KEY not found"

Make sure your OpenAI API key is set:

```bash
export OPENAI_API_KEY=sk_your_key_here
scribbly generate
```

### Documentation Not Updating

Check that your file patterns in `scribbly.config.json` match your source files:

```bash
scribbly generate --verbose
```

### Rate Limiting

If you hit OpenAI rate limits, scribbly will automatically retry with exponential backoff.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © 2026

---

## Keywords

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/cli-documentation-blue" alt="cli"></a>
  <a href="#"><img src="https://img.shields.io/badge/documentation-generator-blue" alt="documentation"></a>
  <a href="#"><img src="https://img.shields.io/badge/changelog-automation-blue" alt="changelog"></a>
  <a href="#"><img src="https://img.shields.io/badge/ai-powered-blue" alt="ai"></a>
  <a href="#"><img src="https://img.shields.io/badge/openai-integration-blue" alt="openai"></a>
  <a href="#"><img src="https://img.shields.io/badge/bun-runtime-blue" alt="bun"></a>
</p>
