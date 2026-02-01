import Handlebars from 'handlebars';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultTemplate = `# {{{projectName}}}

{{#if description}}
{{{description}}}
{{/if}}

{{#if badges.length}}
{{#each badges}}
![{{{name}}}]({{{url}}})
{{/each}}
{{/if}}

## Installation

\`\`\`bash
{{{installCommand}}}
\`\`\`

{{#if usage}}
## Usage

{{{usage}}}
{{/if}}

{{#if features.length}}
## Features

{{#each features}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if commands.length}}
## Commands

{{#each commands}}
- \`{{{command}}}\`: {{{description}}}
{{/each}}
{{/if}}

{{#if apiReference}}
## API Reference

See [API.md](API.md) for detailed documentation.

{{/if}}

{{#if contributing}}
## Contributing

{{{contributing}}}
{{/if}}

{{#if license}}
## License

{{{license}}}
{{/if}}

---
{{#if author}}
*Author:* {{{author}}}
{{/if}}
{{#if version}}
*Version:* {{{version}}}
{{/if}}
*Generated on {{{date}}}*
`;

interface ProjectInfo {
  projectName: string;
  version?: string;
  description?: string;
  author?: string;
  license?: string;
  installCommand?: string;
  usage?: string;
  features?: string[];
  commands?: Array<{ command: string; description: string }>;
  contributing?: string;
  badges?: Array<{ name: string; url: string }>;
  apiReference?: boolean;
}

export async function generateReadme(): Promise<void> {
  const config = loadConfig();

  // Load template
  let templateContent: string;
  const templatePath = join(__dirname, '..', '..', 'templates', 'readme.hbs');
  if (existsSync(templatePath)) {
    templateContent = readFileSync(templatePath, 'utf-8');
  } else {
    templateContent = defaultTemplate;
  }

  // Gather project information
  const packageJsonPath = join(process.cwd(), 'package.json');
  let packageInfo: Record<string, unknown> = {};
  
  if (existsSync(packageJsonPath)) {
    try {
      const content = readFileSync(packageJsonPath, 'utf-8');
      packageInfo = JSON.parse(content);
    } catch (error) {
      console.warn('Failed to read package.json');
    }
  }

  // Try to read git config for repo URL
  let repoUrl = '';
  const gitConfigPath = join(process.cwd(), '.git', 'config');
  if (existsSync(gitConfigPath)) {
    try {
      const gitConfig = readFileSync(gitConfigPath, 'utf-8');
      const urlMatch = gitConfig.match(/url\s*=\s*(.+)/);
      if (urlMatch) {
        repoUrl = urlMatch[1].trim();
      }
    } catch (error) {
      // Ignore git config read errors
    }
  }

  const projectInfo: ProjectInfo = {
    projectName: (packageInfo.name as string) || 'My Project',
    version: packageInfo.version as string,
    description: packageInfo.description as string,
    author: packageInfo.author as string,
    license: packageInfo.license as string,
    installCommand: `bun install` + (packageInfo.name ? ` && bun run ${packageInfo.name}` : ''),
    usage: 'See documentation for usage examples.',
    features: [
      'TypeScript support',
      'Handlebars templates',
      'CLI interface',
    ],
    commands: [
      { command: 'bun run cli', description: 'Run the CLI' },
      { command: 'bun run build', description: 'Build the project' },
    ],
    contributing: 'Contributions are welcome! Please read the contributing guidelines first.',
    badges: [],
    apiReference: true,
  };

  // Add badges if we have repo info
  if (repoUrl.includes('github.com')) {
    const ownerRepo = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (ownerRepo) {
      const [, owner, repo] = ownerRepo;
      projectInfo.badges = [
        { name: 'GitHub stars', url: `https://img.shields.io/github/stars/${owner}/${repo}?style=flat` },
        { name: 'License', url: `https://img.shields.io/github/license/${owner}/${repo}?style=flat` },
        { name: 'Version', url: `https://img.shields.io/github/v/tag/${owner}/${repo}?style=flat` },
      ];
    }
  }

  // Compile template
  const template = Handlebars.compile(templateContent);
  const output = template({
    ...projectInfo,
    date: new Date().toISOString().split('T')[0],
  });

  // Write output
  const outputPath = './README.md';
  writeFileSync(outputPath, output);
  console.log(`README generated at ${outputPath}`);
}
