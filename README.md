# Scribbly

<p align="center">
  <a href="https://github.com/codewithkenzo/scribbly"><img src="https://img.shields.io/github/license/codewithkenzo/scribbly" alt="License"></a>
  <img src="https://img.shields.io/badge/bun-runtime-fbf0df?logo=bun" alt="Bun">
  <img src="https://img.shields.io/github/v/tag/codewithkenzo/scribbly?style=flat" alt="Version">
</p>

AI-powered documentation CLI that generates curated docs from your terminal.

## Features

- **⚡ Fast** — Built with Bun for lightning-fast performance
- **📝 Templates** — Customizable documentation templates
- **🔧 CLI** — Simple, intuitive command-line interface
- **🤖 AI-Powered** — Leverages OpenAI for intelligent content generation
- **📖 API Docs** — Auto-generate API.md from TypeScript exports
- **🔄 Watch Mode** — Auto-regenerate docs on file changes

## Installation

```bash
bun install -g scribbly
```

## Configuration

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your-key-here
```

## Usage

```bash
# Initialize a new documentation project
scribbly init

# Generate changelog from commits
scribbly generate

# Generate API.md from TypeScript exports
scribbly api

# Scaffold README.md from package.json
scribbly readme

# Watch mode - auto-regenerate on changes
scribbly watch

# Show help
scribbly help
```

## Quick Start

```bash
# 1. Install globally
bun install -g scribbly

# 2. Set your API key
export OPENAI_API_KEY=sk-...

# 3. Initialize your project
scribbly init

# 4. Generate documentation
scribbly generate
```

## API Reference

See [API.md](API.md) for detailed documentation.

---

MIT © [codewithkenzo](https://github.com/codewithkenzo)
