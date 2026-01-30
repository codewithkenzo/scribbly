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
      breaking: false,
    };
  }

  const [, type, scope, message] = match;
  const breaking = line.includes('!');

  const parsedType = type as Commit['type'];
  const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci'];

  if (!validTypes.includes(parsedType)) {
    return {
      type: 'chore',
      scope,
      message: line,
      breaking,
    };
  }

  return {
    type: parsedType,
    scope,
    message,
    breaking,
  };
}

export function parseCommitsFromGit(): Commit[] {
  // Get git log output
  const result = Bun.spawnSync(['git', 'log', '--pretty=format:%s', '--no-merges'], {
    cwd: process.cwd(),
  });

  const output = result.stdout.toString().trim();
  if (!output) return [];

  const lines = output.split('\n');
  const commits: Commit[] = [];

  for (const line of lines) {
    const commit = parseCommitLine(line.trim());
    if (commit) {
      commits.push(commit);
    }
  }

  return commits;
}

export function groupCommitsByType(commits: Commit[]): Record<string, Commit[]> {
  const grouped: Record<string, Commit[]> = {};
  const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci'];

  for (const type of validTypes) {
    grouped[type] = [];
  }

  for (const commit of commits) {
    if (grouped[commit.type]) {
      grouped[commit.type].push(commit);
    }
  }

  return grouped;
}
