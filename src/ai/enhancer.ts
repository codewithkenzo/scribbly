import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { Commit } from '../parsers/commits.js';

const summarySchema = z.object({
  summary: z.string(),
});

export async function enhanceCommitSummary(commits: Commit[], apiKey?: string): Promise<string> {
  const commitList = commits
    .filter((c) => c.type !== 'chore' || c.message.length > 10)
    .map((c) => `- **${c.type}**${c.scope ? ` (\`${c.scope}\`)` : ''}: ${c.message}`)
    .join('\n');

  if (!commitList) {
    return 'Minor updates and maintenance';
  }

  const prompt = `Generate a concise one-sentence summary for these commits:\n\n${commitList}\n\nKeep it brief and professional, suitable for a changelog header.`;

  try {
    // Set API key in environment if provided
    if (apiKey) {
      process.env.OPENAI_API_KEY = apiKey;
    }

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: summarySchema,
      prompt,
    });

    return (object as { summary: string }).summary;
  } catch (error) {
    console.warn('AI enhancement failed, using default summary:', error);
    return `Changes include ${commits.length} commits`;
  }
}
