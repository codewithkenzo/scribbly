# templates/ Directory

Handlebars templates for documentation generation.

## Files

| File | Purpose |
|------|---------|
| `changelog.hbs` | Template for CHANGELOG.md |

## Variables

```handlebars
{{#each groups}}
  {{@key}}       // Commit type (feat, fix, etc.)
  {{this}}       // Array of commits
{{/each}}
{{summary}}      // AI-generated summary
{{date}}         // ISO date
```

## Default Template

See `src/generator.ts` for built-in default template.

## Custom Templates

Point `templatePath` in `scribbly.config.json` to custom template.
