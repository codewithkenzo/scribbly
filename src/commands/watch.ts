import { existsSync, watch, unwatchFile } from 'fs';
import { join } from 'path';
import { generateApiDocs } from './api';
import { generateReadme } from './readme';

const DEBOUNCE_MS = 500;
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let isGenerating = false;

/**
 * Debounced file watcher that regenerates docs on changes
 */
export async function watchMode(): Promise<void> {
  const sourceDir = './src';
  const configPath = './scribbly.config.json';

  if (!existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  console.log(`👀 Watching for changes in ${sourceDir}...`);
  console.log('Press Ctrl+C to stop.\n');

  // Initial generation
  await generateApiDocs();
  await generateReadme();

  // Watch source directory
  watch(sourceDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    const ext = filename.split('.').pop();
    if (ext !== 'ts' && ext !== 'js') return;

    // Debounce rapid changes
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      if (isGenerating) {
        console.log('Skipping - generation already in progress');
        return;
      }

      isGenerating = true;
      console.log(`\n📝 Detected change in ${filename}`);

      try {
        await generateApiDocs();
        await generateReadme();
        console.log('✅ Documentation updated');
      } catch (error) {
        console.error('❌ Error generating docs:', error);
      } finally {
        isGenerating = false;
      }
    }, DEBOUNCE_MS);
  });

  // Also watch config file
  if (existsSync(configPath)) {
    watch(configPath, () => {
      console.log('\n📝 Config file changed, regenerating...');
      generateApiDocs().then(() => generateReadme());
    });
  }

  // Keep the process running
  await new Promise(() => {
    // This promise never resolves, keeping the watcher alive
  });
}
