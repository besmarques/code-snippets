# Code Dictionary Commands

## Accepted Ids

- core entries: `>keyword.language`
- package entries: `keyword.package.language`

Examples:

- `>map.js`
- `>fetch.java`
- `post.express.js`
- `findmany.prisma.ts`

Completion stays `>`-gated even for package entries.

## Command Reference

### `codeDictionary.expandAtCursor`

Expands the id under the cursor.

Accepted forms:

- `>map.js`
- `>post.express.js`
- `post.express.js`

### `codeDictionary.translateSelection`

Replaces the selected text with a matching snippet.

Accepted selections:

- exact core ids such as `>loop.php`
- triggerless core ids such as `map.java`
- package ids such as `post.express.js`
- plain keywords such as `map`
- supported code patterns such as `items.map(...)`

### `codeDictionary.pickAndInsert`

Shows the current entry catalog and inserts the selected snippet.

### `codeDictionary.showAvailableEntries`

Opens a generated Markdown list of the current entries.

## Source Layout

Built-in entries live under:

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

## Custom Entry Limits

The sidebar form and `settings.json` custom entries:

- do not create source files
- do not create new package catalogs
- can target `core` or an existing built-in package for that language only

## Built-In Snippet Workflow

### Core entry

Add the snippet to the language root file such as `src/data/ecosystems/js/js.ts`.

### Package entry

Add the snippet to the package file such as `src/data/ecosystems/js/packages/express.ts`.

Rules:

- keep keywords lowercase and package-local
- do not repeat the package name in the keyword
- if you add a new package file, import its array into the language root file
- run `npm test`

## Dev Smoke Test

1. run `npm test`
2. run `npm run build:dev`
3. press `F5`
4. in the Extension Development Host, test:
   - `>map.js`
   - `>post`
   - `post.express.js`
   - sidebar catalog
