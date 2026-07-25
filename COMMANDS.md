# Code Dictionary Commands

## Trigger Shapes

- core entries: `>keyword.language`
- package entries: `keyword.package.language`

Examples:

- `>map.js`
- `>fetch.java`
- `post.express.js`
- `findmany.prisma.ts`

Completion remains `>`-gated, so package entries are still discovered by typing `>` first.

## Data Structure

Catalogs now live under `src/data/ecosystems`.

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
- `src/data/ecosystems/ts/ts.ts`
- `src/data/ecosystems/ts/packages/prisma.ts`
- `src/data/ecosystems/react/packages/tailwind.ts`

Each `<language>.ts` file is the language entrypoint and spreads package arrays into `commands`.

## Extension Commands

### `codeDictionary.expandAtCursor`

Expands the id under the cursor.

Examples:

- `>map.js`
- `>post.express.js`
- `post.express.js`

### `codeDictionary.translateSelection`

Replaces the selected text with the matching snippet.

Accepted selections:

- exact core ids such as `>loop.php`
- triggerless core ids such as `map.java`
- package ids such as `post.express.js`
- plain keywords such as `map`
- supported code patterns such as `items.map(...)`

### `codeDictionary.pickAndInsert`

Shows all available entries and inserts the selected snippet.

### `codeDictionary.showAvailableEntries`

Opens a generated Markdown list of all current entries.

## Adding A Snippet

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

- keep the keyword package-local and lowercase
- store it in the closest `packages/*.ts` file
- if needed, create a new package file under the language folder
- import that package array into the language root file
- run `npm test`

## Runtime Entry Shape

```ts
type DictionaryEntry = {
  ecosystem: string;
  keyword: string;
  language: 'js' | 'ts' | 'react' | 'java' | 'php';
  description: string;
  detail?: string;
  snippet: string;
};
```
