# Scribbly

<p align="center">
  <a href="https://github.com/codewithkenzo/scribbly"><img src="https://img.shields.io/github/license/codewithkenzo/scribbly" alt="License"></a>
  <img src="https://img.shields.io/badge/bun-runtime-fbf0df?logo=bun" alt="Bun">
</p>

AI-powered documentation CLI that generates curated docs from your terminal.

## Features

- **⚡ Fast** — Built with Bun for lightning-fast performance
- **📝 Templates** — Customizable documentation templates
- **🔧 CLI** — Simple, intuitive command-line interface
- **🤖 AI-Powered** — Leverages OpenAI for intelligent content generation

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

# Generate documentation for a topic
scribbly generate "project docs"

# Show help
scribbly --help
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
scribbly generate "API reference"
```

---

MIT © [codewithkenzo](https://github.com/codewithkenzo)
