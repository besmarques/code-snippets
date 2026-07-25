# Code Dictionary VS Code Extension

## Goal

Code Dictionary expands short ids into code snippets across multiple languages and ecosystems.

## Trigger Model

There are two id shapes:

- core entries: `>keyword.language`
- package entries: `keyword.package.language`

Examples:

- `>map.js`
- `>map.react`
- `post.express.js`
- `findmany.prisma.ts`
- `card.tailwind.react`

Notes:

- completion suggestions only open after `>`
- core entries are always shown with `>`
- package entries are shown without `>` in lists, but can still be discovered by typing `>` in completion
- manual expansion accepts `>map.js`, `>post.express.js`, and `post.express.js`

Supported language suffixes:

- `js`
- `ts`
- `react`
- `java`
- `php`

Alias suffixes such as `javascript`, `typescript`, `jsx`, and `tsx` are rejected.

## Current File Structure

```text
src/
  data/
    ecosystems/
      index.ts
      js/
        js.ts
        packages/
          axios.ts
          dotenv.ts
          express.ts
          jsonwebtoken.ts
          sql.ts
      ts/
        ts.ts
        packages/
          drizzle.ts
          express.ts
          prisma.ts
          typeorm.ts
          zod.ts
      react/
        react.ts
        packages/
          chakra.ts
          mui.ts
          shadcn.ts
          tailwind.ts
      java/
        java.ts
        packages/
          jdbc.ts
          jpa.ts
      php/
        php.ts
        packages/
          eloquent.ts
          pdo.ts
```

How it works:

- each language has one root catalog file such as `src/data/ecosystems/js/js.ts`
- package files live under that language in `packages/*.ts`
- the root file imports those package arrays and spreads them into its `commands` array
- `src/data/index.ts` flattens everything into runtime dictionary entries

## Extension Commands

- `codeDictionary.expandAtCursor`
- `codeDictionary.translateSelection`
- `codeDictionary.pickAndInsert`
- `codeDictionary.showAvailableEntries`

## How To Use It

Completion:

- type `>` and start a core id such as `>map`
- type `>` and start a package id such as `>post`, `>findmany`, or `>card`
- use language-only filters such as `>.js`, `>.ts`, `>.react`, `>.java`, or `>.php`

Manual expansion:

- type an id in the editor
- run `Code Dictionary: Expand Trigger at Cursor`

Translate selection:

- select `>map.js`
- or select `map.java`
- or select `post.express.js`
- or select normal code such as `items.map(...)`
- run `Code Dictionary: Translate Selection`

Sidebar:

- after `F5`, open the `Code Dictionary` Activity Bar icon
- browse the catalog by language and ecosystem
- use the `Add Custom Entry` view to save custom entries without editing JSON by hand

## User Configuration

Custom entries and disabled built-ins live in normal VS Code settings.

Example:

```json
{
  "codeDictionary.customEntries": [
    {
      "ecosystem": "core",
      "keyword": "slugify",
      "language": "js",
      "description": "Convert text into a URL slug.",
      "snippet": "const slug = input.toLowerCase().replace(/\\s+/g, '-');\n$0"
    },
    {
      "ecosystem": "express",
      "keyword": "delete",
      "language": "js",
      "description": "Create an Express DELETE route handler.",
      "snippet": "app.delete('/users/:id', async (req, res) => {\n  res.status(204).end();\n  $0\n});"
    }
  ],
  "codeDictionary.disabledEntries": [
    "map.js",
    ">fetch.php",
    "post.express.js"
  ]
}
```

Rules:

- `keyword`, `language`, `description`, and `snippet` are required
- `ecosystem` is optional for backward compatibility and defaults to `core`
- custom entries override built-ins by full trigger id
- different ecosystems can reuse the same keyword safely
- `disabledEntries` accept either the visible id or the prefixed form

## Adding A Built-In Snippet

Built-in snippets should be added to the closest language and package file, not to one monolithic catalog.

Example: adding `delete.express.js` inside `src/data/ecosystems/js/packages/express.ts`

```ts
{
  keyword: 'delete',
  ecosystem: 'express',
  description: 'Create an Express DELETE route handler.',
  snippet: `app.delete('/${1:users}/:${2:id}', async (req, res) => {
  try {
    await ${3:userService}.remove(req.params.${2});
    res.status(204).end();
  } catch (${4:error}) {
    res.status(500).json({ message: ${4}.message });
  }
});
$0`,
},
```

Rules:

- keep `keyword` lowercase with letters and digits only
- do not repeat the package name inside the keyword when the ecosystem already scopes it
- if you need a new package file, create it under `src/data/ecosystems/<language>/packages`
- import the new array into `src/data/ecosystems/<language>/<language>.ts`
- run `npm test` after edits

## Validation And Tests

- `npm run validate` checks catalog structure, invalid fields, duplicate trigger ids, and malformed placeholders
- `npm test` runs the validation plus the test suite
- `npm run build:dev` builds both the Node and browser bundles

## Compatibility

The extension is structured to run in desktop, remote, and web-capable VS Code environments:

- `main` points to the Node bundle
- `browser` points to the web bundle
- runtime editor logic avoids Node-only APIs
