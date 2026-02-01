# API Reference


## Module: parsers/typescript

### `parseTypeScriptFile`

Parse TSDoc comment block

```typescript
export function parseTypeScriptFile
```

**Parameters:**
- `tags` (`unknown`): const paramRegex &#x3D; /@param\s+(\w+)(?:\s+\{([^}]+)\})?\s*-?\s*(.*)/g;


**Examples:**
```typescript
tags
  const exampleRegex &#x3D; /
```
```typescript
\s*([\s\S]*?)(?&#x3D;\*\/|
```

> ⚠️ **Deprecated:** tag

---
### `parseTypeScriptDirectory`

...

```typescript
export function parseTypeScriptDirectory
```





---
### `parseTypeScript`

Parse a single module or directory

```typescript
export function parseTypeScript
```





---
## Module: commands/watch

### `watchMode`

Debounced file watcher that regenerates docs on changes

```typescript
export async function watchMode
```





---

---
*Generated on 2026-01-30*
