import { z } from 'zod';

export const commitSchema = z.object({
  type: z.enum(['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci']),
  scope: z.string().optional(),
  message: z.string(),
  breaking: z.boolean().default(false),
});

export type Commit = z.infer<typeof commitSchema>;

export function parseCommitLine(line: string): Commit | null {
  // Parse conventional commit format: type(scope): message
  const pattern = /^(\w+)(?:\(([^)]+)\))?!?: (.+)$/;
  const match = line.match(pattern);

  if (!match) {
    // Fallback: treat as a simple message
    return {
      type: 'chore',
      message: line,
    };
  }

  const [, type, scope, message] = match;
  const breaking = line.includes('!');

  return {
    type: type as Commit['type'],
    scope,
    message,
    breaking,
  };
}

export function parseCommitsFromGit(): Commit[] {
  // This would typically parse git log output
  // For now, this is a placeholder
  return [];
}

export function groupCommitsByType(commits: Commit[]): Record<string, Commit[]> {
  const grouped: Record<string, Commit[]> = {
    feat: [],
    fix: [],
    docs: [],
    style: [],
    refactor: [],
    test: [],
    chore: [],
    perf: [],
    ci: [],
  };

  for (const commit of commits) {
    grouped[commit.type].push(commit);
  }

  return grouped;
}
