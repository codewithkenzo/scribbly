import { readFileSync, existsSync, lstatSync, readdirSync } from 'fs';
import { join, relative } from 'path';

export interface TypeDocComment {
  summary: string;
  params: Array<{ name: string; type: string; description: string }>;
  returns?: { type: string; description: string };
  examples: string[];
  deprecated?: string;
}

export interface ExportItem {
  name: string;
  kind: 'function' | 'interface' | 'type' | 'class' | 'const' | 'enum' | 'export';
  location: { file: string; line: number };
  signature?: string;
  comment?: TypeDocComment;
  children?: ExportItem[];
}

export interface ParsedModule {
  filePath: string;
  moduleName: string;
  exports: ExportItem[];
}

/**
 * Parse TSDoc comment block
 */
function parseTsDocComment(commentBlock: string): TypeDocComment {
  const comment: TypeDocComment = {
    summary: '',
    params: [],
    examples: [],
  };

  const commentMatch = commentBlock.match(/\/\*\*([\s\S]*?)\*\//);
  if (!commentMatch) return comment;
  
  const content = commentMatch[1]
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();

  const summaryMatch = content.match(/^([^@]*)/);
  if (summaryMatch && summaryMatch[1].trim()) {
    comment.summary = summaryMatch[1].trim();
  }

  const paramMatches = content.matchAll(/@param\s+(\w+)(?:\s+\{([^}]+)\})?\s*-?\s*([^\n@]*)/g);
  for (const match of paramMatches) {
    comment.params.push({
      name: match[1],
      type: match[2] || 'unknown',
      description: match[3].trim(),
    });
  }

  const returnsMatch = content.match(/@returns?\s*\{([^}]+)\}\s*-?\s*([^\n@]*)/);
  if (returnsMatch) {
    comment.returns = {
      type: returnsMatch[1],
      description: returnsMatch[2].trim(),
    };
  }

  const exampleMatches = content.matchAll(/@example\s*([\s\S]*?)(?=@\w|$)/g);
  for (const match of exampleMatches) {
    const example = match[1].trim();
    if (example) comment.examples.push(example);
  }

  const deprecatedMatch = content.match(/@deprecated\s*([^\n@]*)/);
  if (deprecatedMatch) {
    comment.deprecated = deprecatedMatch[1].trim();
  }

  return comment;
}

/**
 * Extract export kind from comment/keyword
 */
function detectExportKind(content: string, precedingText: string): ExportItem['kind'] {
  if (/\/\*\*\s*@class\b/.test(content) || /class\s+/.test(precedingText)) return 'class';
  if (/\/\*\*\s*@interface\b/.test(content) || /interface\s+/.test(precedingText)) return 'interface';
  if (/\/\*\*\s*@type\b/.test(content) || /type\s+\w+\s*=/.test(precedingText)) return 'type';
  if (/\/\*\*\s*@enum\b/.test(content) || /enum\s+\w+/.test(precedingText)) return 'enum';
  if (/function\s+\w+/.test(precedingText)) return 'function';
  if (/export\s+const\s+/.test(precedingText)) return 'const';
  if (/export\s+function\s+/.test(precedingText)) return 'function';
  if (/export\s+\{/.test(precedingText)) return 'export';
  return 'function';
}

/**
 * Parse TypeScript file and extract exports with TSDoc comments
 */
export function parseTypeScriptFile(filePath: string, baseDir: string): ParsedModule | null {
  if (!existsSync(filePath) || !filePath.endsWith('.ts')) {
    return null;
  }

  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(baseDir, filePath);

  // Pattern to match /** ... */ followed by export
  const exportPattern = /\/\*\*([\s\S]*?)\*\/\s*(export\s+(?:async\s+)?(?:function|const|class|interface|type|enum|default)\s+(\w+)|export\s+\{[^}]+\})/g;

  const exports: ExportItem[] = [];
  let match;

  while ((match = exportPattern.exec(content)) !== null) {
    const fullComment = match[0];
    const commentContent = match[1];
    const exportMatch = match[2];
    
    const nameMatch = exportMatch.match(/(?:function|const|class|interface|type|enum|default)\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : 'anonymous';
    
    // Find line number
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Get export match for context
    const comment = parseTsDocComment(fullComment);
    const kind = detectExportKind(fullComment, exportMatch);

    // Extract signature
    let signature = exportMatch;
    if (kind === 'function') {
      const funcMatch = exportMatch.match(/(?:async\s+)?function\s+(\w+)\s*(\([^)]*\))/);
      if (funcMatch) {
        signature = `function ${name}${funcMatch[2]}`;
      }
    }

    exports.push({
      name,
      kind,
      location: { file: relativePath, line: lineNumber },
      signature,
      comment,
    });
  }

  // Also capture named exports without comments
  const namedExportPattern = /export\s+\{\s*([^}]+)\s*\}/g;
  while ((match = namedExportPattern.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim());
    for (const name of names) {
      if (!exports.find(e => e.name === name)) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        exports.push({
          name,
          kind: 'export',
          location: { file: relativePath, line: lineNumber },
        });
      }
    }
  }

  return {
    filePath: relativePath,
    moduleName: relativePath.replace('.ts', '').replace(/\/index$/, ''),
    exports,
  };
}

/**
 * Recursively find all TypeScript files in directory
 */
function findTypeScriptFiles(dir: string, baseDir: string): string[] {
  const files: string[] = [];

  if (!existsSync(dir)) return files;

  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch (error) {
    return files;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    
    try {
      const stat = lstatSync(fullPath);

      if (stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        files.push(...findTypeScriptFiles(fullPath, baseDir));
      } else if (fullPath.endsWith('.ts') && !fullPath.includes('.d.ts')) {
        files.push(fullPath);
      }
    } catch (error) {
      // Skip files that can't be accessed
    }
  }

  return files;
}

/**
 * Parse all TypeScript files in a directory
 */
export function parseTypeScriptDirectory(dir: string): ParsedModule[] {
  const files = findTypeScriptFiles(dir, dir);
  const modules: ParsedModule[] = [];

  for (const file of files) {
    const parsed = parseTypeScriptFile(file, dir);
    if (parsed && parsed.exports.length > 0) {
      modules.push(parsed);
    }
  }

  return modules;
}

/**
 * Parse a single module or directory
 */
export function parseTypeScript(source: string): ParsedModule[] {
  if (existsSync(source) && lstatSync(source).isDirectory()) {
    return parseTypeScriptDirectory(source);
  } else if (source.endsWith('.ts')) {
    const parsed = parseTypeScriptFile(source, process.cwd());
    return parsed ? [parsed] : [];
  }

  return [];
}
