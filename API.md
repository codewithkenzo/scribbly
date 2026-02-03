# API Reference

## Module: parsers/typescript

### `parseTypeScriptFile`

Parse TSDoc comment block

```typescript
export function parseTypeScriptFile(filePath: string, baseDir: string): ParsedModule | null
```

---

### `parseTypeScriptDirectory`

...

```typescript
export function parseTypeScriptDirectory(dir: string): ParsedModule[]
```

---

### `parseTypeScript`

Parse a single module or directory

```typescript
export function parseTypeScript(source: string): ParsedModule[]
```

---

## Module: commands/watch

### `watchMode`

Debounced file watcher that regenerates docs on changes

```typescript
export async function watchMode(): Promise<void>
```

---
*Generated on 2026-02-01*
