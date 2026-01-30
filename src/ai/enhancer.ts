import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { Commit } from '../parsers/commits.js';

const summarySchema = z.object({
  summary: z.string(),
  details: z.string().optional(),
});

export async function enhanceCommitSummary(commits: Commit[]): Promise<string> {
  const commitList = commits
    .map((c) => `- **${c.type}**${c.scope ? ` (\`${c.scope}\`)` : ''}: ${c.message}`)
    .join('\n');

  const prompt = `Generate a concise changelog summary for these commits:\n\n${commitList}\n\nFormat the output as a brief, professional changelog entry. Group by type and provide meaningful summaries.`;

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: summarySchema,
      prompt,
    });

    return object.summary;
  } catch (error) {
    console.error('Failed to enhance commit summary:', error);
    return `Generated changelog from ${commits.length} commits`;
  }
}
