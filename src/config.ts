import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface ScribblyConfig {
  openaiApiKey?: string;
  model?: string;
  outputPath?: string;
  templatePath?: string;
  repoUrl?: string;
}

const defaultConfig: ScribblyConfig = {
  model: 'gpt-4o',
  outputPath: './CHANGELOG.md',
  templatePath: './templates/changelog.hbs',
};

export function loadConfig(): ScribblyConfig {
  const configPaths = [
    './scribbly.config.json',
    './.scribblyrc.json',
    join(process.cwd(), 'scribbly.config.json'),
  ];

  for (const path of configPaths) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        const config = JSON.parse(content);
        return {
          ...defaultConfig,
          ...config,
          // Fallback to environment variable if not in config
          openaiApiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
        };
      } catch (error) {
        console.warn(`Failed to load config from ${path}`);
      }
    }
  }

  return {
    ...defaultConfig,
    openaiApiKey: process.env.OPENAI_API_KEY,
  };
}

export function initConfig(): void {
  const configPath = './scribbly.config.json';
  const defaultConfigJson = JSON.stringify(defaultConfig, null, 2);
  writeFileSync(configPath, defaultConfigJson);
  console.log(`Created default config at ${configPath}`);
}

export function saveConfig(config: ScribblyConfig): void {
  const configPath = './scribbly.config.json';
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}
