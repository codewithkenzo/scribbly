import Handlebars from 'handlebars';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig } from './config.js';
import { parseCommitsFromGit, groupCommitsByType, type Commit } from './parsers/commits.js';
import { enhanceCommitSummary } from './ai/enhancer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultTemplate = `# Changelog

{{#each groups}}
## {{@key}}
{{#each this}}
- {{type}}{{#if scope}} (\`{{scope}}\`){{/if}}: {{message}}{{/if}}
{{/each}}
{{/each}}
`;

export async function generateChangelog(): Promise<void> {
  const config = loadConfig();

  // Load template
  let templateContent: string;
  if (config.templatePath && existsSync(config.templatePath)) {
    templateContent = readFileSync(config.templatePath, 'utf-8');
  } else {
    // Use default template
    templateContent = defaultTemplate;
  }

  // Parse commits from git
  const commits = parseCommitsFromGit();

  if (commits.length === 0) {
    console.log('No commits found to generate changelog.');
    return;
  }

  // Group commits by type
  const groupedCommits = groupCommitsByType(commits);

  // Remove empty groups
  Object.keys(groupedCommits).forEach((key) => {
    if (groupedCommits[key].length === 0) {
      delete groupedCommits[key];
    }
  });

  // Optionally enhance with AI
  let aiSummary: string | undefined;
  if (config.openaiApiKey) {
    process.env.OPENAI_API_KEY = config.openaiApiKey;
    aiSummary = await enhanceCommitSummary(commits);
  }

  // Compile template
  const template = Handlebars.compile(templateContent);
  const output = template({
    groups: groupedCommits,
    summary: aiSummary,
    date: new Date().toISOString().split('T')[0],
  });

  // Write output
  const outputPath = config.outputPath || './CHANGELOG.md';
  writeFileSync(outputPath, output);
  console.log(`Changelog generated at ${outputPath}`);
}
