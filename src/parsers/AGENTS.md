# parsers/ Module

Code parsers for documentation generation.

## Files

| File | Purpose |
|------|---------|
| `commits.ts` | Parse conventional commits with Zod |

## Commit Schema

```typescript
const commitSchema = z.object({
  type: z.enum(['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci']),
  scope: z.string().optional(),
  message: z.string(),
  breaking: z.boolean().default(false),
});
```

## Functions

| Function | Description |
|----------|-------------|
| `parseCommitLine(line)` | Parse single commit message |
| `parseCommitsFromGit()` | Get commits from `git log` |
| `groupCommitsByType(commits)` | Group by type (feat, fix, etc.) |

## Notes

- Uses conventional commits format
- Falls back to `chore` for unrecognized types
- Handles breaking changes (`!` in header)
