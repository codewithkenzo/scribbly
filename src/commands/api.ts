import Handlebars from 'handlebars';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig } from '../config.js';
import { parseTypeScript, type ParsedModule } from '../parsers/typescript.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultTemplate = "# API Reference\n\n{{#if summary}}\n## Summary\n{{summary}}\n{{/if}}\n\n{{#if modules}}\n{{#each modules}}\n## Module: {{moduleName}}\n\n{{#if exports.length}}\n{{#each exports}}\n### {{name}}\n\n{{#if comment.summary}}\n{{comment.summary}}\n{{/if}}\n\n{{#if signature}}\n```typescript\n{{signature}}\n```\n{{/if}}\n\n{{#if comment.params.length}}\n**Parameters:**\n{{#each comment.params}}\n- `{{name}}` (`{{type}}`): {{description}}\n{{/each}}\n{{/if}}\n\n{{#if comment.returns}}\n**Returns:** `{{comment.returns.type}}` - {{comment.returns.description}}\n{{/if}}\n\n{{#if comment.examples.length}}\n**Examples:**\n{{#each comment.examples}}\n```typescript\n{{this}}\n```\n{{/each}}\n{{/if}}\n\n{{#if comment.deprecated}}\n> ⚠️ **Deprecated:** {{comment.deprecated}}\n{{/if}}\n\n---\n{{/each}}\n{{/if}}\n{{/each}}\n{{/if}}\n\n---\n*Generated on {{date}}*\n";

export async function generateApiDocs(): Promise<void> {
  const config = loadConfig();

  // Load template
  let templateContent: string;
  const templatePath = join(__dirname, '..', '..', 'templates', 'api.hbs');
  if (existsSync(templatePath)) {
    templateContent = readFileSync(templatePath, 'utf-8');
  } else {
    templateContent = defaultTemplate;
  }

  // Determine source directory (default to src)
  const sourceDir = config.sourceDir || './src';

  if (!existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  // Parse TypeScript files
  const modules = parseTypeScript(sourceDir);

  if (modules.length === 0) {
    console.log('No exports found to generate API docs.');
    return;
  }

  // Compile template
  const template = Handlebars.compile(templateContent);
  const output = template({
    modules,
    date: new Date().toISOString().split('T')[0],
  });

  // Write output
  // Use apiOutputPath if set, otherwise use API.md as default
  const apiOutputPath = config.apiOutputPath || './API.md';
  writeFileSync(apiOutputPath, output);
  console.log(`API documentation generated at ${apiOutputPath}`);
}
