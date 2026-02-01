# ai/ Module

AI-powered commit enhancement using @ai-sdk/openai.

## Files

| File | Purpose |
|------|---------|
| `enhancer.ts` | Generate commit summaries with AI |

## Usage

```typescript
import { enhanceCommitSummary } from './ai/enhancer.js';

const summary = await enhanceCommitSummary(commits, apiKey);
```

## Dependencies

- `@ai-sdk/openai` - OpenAI provider
- `ai` - Core AI SDK
- `zod` - Response validation

## Config

Requires `openaiApiKey` in config or `OPENAI_API_KEY` env var.
