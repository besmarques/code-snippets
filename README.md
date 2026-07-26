# Code Dictionary

Code Dictionary is a VS Code extension that expands short ids into code snippets across core languages and built-in package ecosystems.

## Id Model

There are two id shapes:

- core entries: `>keyword.language`
- package entries: `keyword.package.language`

Examples:

- `>map.js`
- `>map.react`
- `post.express.js`
- `findmany.prisma.ts`
- `card.tailwind.react`

Rules:

- completion suggestions only open after `>`
- core entries are shown with `>`
- package entries are shown without `>` in lists, but can still be discovered by typing `>`
- manual expansion accepts `>map.js`, `>post.express.js`, and `post.express.js`
- supported language suffixes are `js`, `ts`, `react`, `html`, `css`, `java`, and `php`
- suffix aliases such as `javascript`, `typescript`, `jsx`, and `tsx` are rejected

## What Lives Where

### Built-In Entries

Built-in entries ship with the extension and live in source files under `src/data/ecosystems`.

Pattern:

```text
src/data/ecosystems/<language>/
  <language>.ts
  packages/
    <package>.ts
```

Examples:

- `src/data/ecosystems/js/js.ts`
- `src/data/ecosystems/js/packages/express.ts`
- `src/data/ecosystems/ts/packages/prisma.ts`
- `src/data/ecosystems/react/packages/tailwind.ts`
- `src/data/ecosystems/html/packages/bootstrap.ts`
- `src/data/ecosystems/css/packages/sass.ts`

### Custom Entries

Custom entries live in `settings.json`.

Important:

- custom entries do not create source files
- custom entries do not create new package catalogs
- custom entries can target `core` or a built-in package that already exists for that language

## Built-In Package Groups

These are the current built-in package groups:

- JavaScript: `axios`, `dotenv`, `express`, `jsonwebtoken`, `sql`
- TypeScript: `drizzle`, `express`, `prisma`, `typeorm`, `zod`
- React: `chakra`, `mui`, `shadcn`, `tailwind`
- HTML: `bootstrap`, `tailwind`
- CSS: `sass`, `tailwind`
- Java: `jdbc`, `jpa`
- PHP: `eloquent`, `pdo`

If a package is not in that list for the selected language, the custom-entry form should not let you target it.

## Extension Commands

- `codeDictionary.openSidebar`
- `codeDictionary.expandAtCursor`
- `codeDictionary.searchCatalog`
- `codeDictionary.searchCatalogAndCopyTrigger`
- `codeDictionary.translateSelection`
- `codeDictionary.pickAndInsert`
- `codeDictionary.showAvailableEntries`
- `codeDictionary.showExpansionGuide`

## Using The Extension

### Completion

- type `>` and start a core id such as `>map`
- type `>` and start a package id such as `>post`, `>findmany`, or `>card`
- use language-only filters such as `>.js`, `>.ts`, `>.react`, `>.html`, `>.css`, `>.java`, or `>.php`

### Expand Trigger At Cursor

Type an id in the editor, put the cursor on it, and run `Code Dictionary: Expand Trigger`.

Default shortcut:

- Windows and Linux: `Ctrl+Alt+Enter`
- macOS: `Cmd+Alt+Enter`

Examples:

- `>map.js`
- `>post.express.js`
- `post.express.js`

### Composing Entries

There are two supported ways to make entries work together:

1. nested expansion
2. wrapping existing code

Nested expansion:

- expand a wrapper entry such as `>function.js`
- the first cursor stop is the wrapper body
- type another trigger inside its body, such as `>map.js`
- expand that trigger again with completion or `Code Dictionary: Expand Trigger`

Wrapping existing code:

- expand an inner entry first, such as `>map.js`
- select the generated code
- expand a wrapper entry such as `>function.js`

Wrapper-style entries now use `TM_SELECTED_TEXT`, so the selected code is inserted into the wrapper body when that pattern is used.
Core JS and TS function wrappers no longer inject a default `return` line.

If you want the short in-editor explanation, run `Code Dictionary: Show Expansion Guide`.

### Translate Selection

Select any of these and run `Code Dictionary: Translate Selection`:

- `>map.js`
- `map.java`
- `post.express.js`
- `map`
- `items.map(...)`

### Sidebar

After `F5`, open the `Code Dictionary` icon in the Activity Bar.

The sidebar gives you:

- command shortcuts
- shortcut guidance for expansion
- searchable catalog actions for insert and trigger-copy flows
- a catalog grouped by language and package
- direct click-to-insert on catalog entries
- right-click trigger-copy actions on catalog entries
- an expansion guide for wrapper and nested flows
- a `Custom Entries` view
- edit and delete actions for existing custom entries
- a quick action to open the relevant settings JSON

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
- package entries must target an existing built-in package for that language
- `disabledEntries` accept either the visible id or the prefixed form

## Adding Built-In Entries

### Add A Core Entry

Example: add `>debounce.ts` in `src/data/ecosystems/ts/ts.ts`

```ts
{
  keyword: 'debounce',
  description: 'Create a typed debounce helper.',
  snippet: `function debounce<T extends (...args: any[]) => void>(callback: T, delay = 250) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}
$0`,
},
```

### Add A Package Entry

Example: add `delete.express.js` in `src/data/ecosystems/js/packages/express.ts`

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

Checklist:

- keep `keyword` lowercase with letters and digits only
- for package entries, keep the keyword package-local
- do not repeat the package name inside the keyword
- if you create a new package file, place it under `src/data/ecosystems/<language>/packages`
- import the new package array into `src/data/ecosystems/<language>/<language>.ts`
- run `npm test`

## Local Testing

Use this flow while developing:

1. run `npm test`
2. run `npm run build:dev`
3. press `F5` in VS Code
4. in the Extension Development Host:
   - type `>map.js`
   - type `>post`
   - type `>.html` or `>.css`
   - use `Translate Selection`
   - use `Code Dictionary: Show Expansion Guide`
   - open the sidebar and inspect the catalog

## Validation And Build

- `npm run validate` checks catalog structure, invalid fields, duplicate trigger ids, and malformed placeholders
- `npm test` runs validation plus the test suite
- `npm run build:dev` builds the Node and browser bundles
- `npm run build` builds the production bundles

## Compatibility

The extension is structured to run in desktop, remote, and web-capable VS Code environments:

- `main` points to the Node bundle
- `browser` points to the web bundle
- runtime editor logic avoids Node-only APIs
