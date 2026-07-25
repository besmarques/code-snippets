# Code Dictionary Roadmap

## Purpose

This file defines the future implementation path for the extension.

The current product direction is:

- core trigger format: `>keyword.language`
- package trigger format: `keyword.package.language`
- example triggers: `>map.js`, `post.express.js`, `findmany.prisma.ts`
- language root catalogs live in `src/data/ecosystems/<language>/<language>.ts`
- package catalogs live in `src/data/ecosystems/<language>/packages`

## Current Baseline

What already exists:

- extension manifest and build setup
- command registration
- completion provider
- trigger parsing for core and package ids
- language catalogs for `js`, `react`, `ts`, `java`, and `php`
- a much larger first-pass JavaScript catalog

## Step-By-Step Path

### ~~1. Stabilize The Core Trigger Model~~

~~Goal:~~

~~Make sure the core/package id model is final and consistent.~~

~~Tasks:~~

- ~~verify every command and doc assumes the final id model~~
- ~~remove any stale assumptions about old trigger formats~~
- ~~define a strict list of supported language suffixes~~
- ~~decide whether aliases like `>map.javascript` should be supported or rejected~~

~~Decision: core ids use `>keyword.language`, package ids use `keyword.package.language`, and canonical suffixes are `js`, `ts`, `react`, `java`, and `php`. Alias suffixes such as `javascript`, `typescript`, `jsx`, and `tsx` are rejected.~~

~~Done when:~~

- ~~parsing, completion, insertion, and docs all match one id model~~

### ~~2. Normalize The Keyword Naming Rules~~

~~Goal:~~

~~Make the keyword system predictable before the catalogs grow further.~~

~~Tasks:~~

- ~~define naming rules for keywords such as `map`, `promiseall`, `trycatch`, `queryall`~~
- ~~decide when to use one word versus multiple words~~
- ~~decide whether aliases should exist, for example `foreach` and `forEach`~~
- ~~create a small naming guide for future entries~~

~~Decision: canonical keywords are lowercase ASCII letters and digits only, multi-word concepts are collapsed into one word, and trigger aliases are rejected. The shortest unambiguous keyword wins.~~

~~Artifacts:~~

- ~~[KEYWORD_STYLE.md](C:\Users\besma\OneDrive\Documentos\vscode%20ext\KEYWORD_STYLE.md) defines the naming guide~~
- ~~trigger parsing now enforces canonical keyword shape~~

~~Done when:~~

- ~~new entries can be added without inventing inconsistent names~~

### ~~3. Expand The React Catalog~~

~~Goal:~~

~~Bring React closer to the size of the JavaScript catalog.~~

~~Tasks:~~

- ~~add common hooks like `useeffect`, `usestate`, `usememo`, `useref`~~
- ~~add component patterns like `component`, `props`, `context`, `provider`~~
- ~~add rendering patterns like `map`, `conditional`, `form`, `handler`~~
- ~~add event patterns like `onclick`, `onchange`, `onsubmit`~~
- ~~add async UI patterns like `loading`, `error`, `empty`, `fetch`~~

~~Decision: the React catalog now includes component patterns, rendering patterns, event/form patterns, standard hooks, and React 19 APIs including `use`, `useActionState`, `useOptimistic`, `useEffectEvent`, and `useFormStatus`.~~

~~Done when:~~

- ~~React has a practical starter library instead of a minimal demo set~~

### ~~4. Expand The TypeScript Catalog~~

~~Goal:~~

~~Make TypeScript useful as a first-class target, not only a small variation of JavaScript.~~

~~Tasks:~~

- ~~add `type`, `interface`, `enum`, `generic`, `union`, `guard`~~
- ~~add typed versions of `function`, `arrow`, `map`, `reduce`, `fetch`~~
- ~~add typed object and API response snippets~~
- ~~add class and utility patterns with explicit types~~

~~Decision: the TypeScript catalog now includes dedicated type-system entries, typed function/data patterns, typed fetch/response helpers, and utility types such as `record`, `partial`, `readonlyarray`, and `tuple`.~~

~~Done when:~~

- ~~TypeScript users can use the extension without falling back to JavaScript snippets~~

### ~~5. Expand The Java Catalog~~

~~Goal:~~

~~Turn Java into a meaningful library instead of a few proof-of-concept entries.~~

~~Tasks:~~

- ~~add `main`, `class`, `interface`, `record`, `enum`~~
- ~~add `list`, `map`, `stream`, `optional`, `builder`~~
- ~~add `trycatch`, `http`, `file`, `loop`, `switch`~~
- ~~add common Spring-style snippets later if that scope is wanted~~

~~Decision: the Java catalog now covers entry points, types, collections, Stream API, Optional, builder patterns, control flow, file IO, and HTTP requests. Framework-specific Java patterns are still deferred.~~

~~Done when:~~

- ~~Java has a broad enough catalog for day-to-day use~~

### ~~6. Expand The PHP Catalog~~

~~Goal:~~

~~Bring PHP up to the same maturity level as JavaScript.~~

~~Tasks:~~

- ~~add `function`, `class`, `trait`, `interface`, `namespace`~~
- ~~add `arraymap`, `foreach`, `match`, `trycatch`~~
- ~~add `request`, `json`, `pdo`, `session`, `middleware` if needed~~
- ~~decide whether framework-specific entries belong in core or in a later expansion~~

~~Decision: the PHP catalog now covers core language structures, array helpers, control flow, HTTP and JSON handling, PDO database access, sessions, and middleware-style patterns. Framework-specific PHP entries are still deferred.~~

~~Done when:~~

- ~~PHP has a real catalog instead of a starter subset~~

### ~~7. Add Catalog Validation~~

~~Goal:~~

~~Prevent broken entries as the catalogs grow.~~

~~Tasks:~~

- ~~add a validator that checks for duplicate trigger ids~~
- ~~detect invalid language values~~
- ~~detect empty descriptions or snippet bodies~~
- ~~detect malformed snippet placeholders where possible~~
- ~~surface validation errors in a developer command or build step~~

~~Decision: `npm run validate` now parses the catalog source files with the TypeScript AST and fails on duplicate entries, invalid language values, empty descriptions or snippets, invalid keyword shapes, and malformed numeric snippet placeholders. The same validation runs automatically before every build and watch rebuild.~~

~~Done when:~~

- ~~bad catalog data fails early instead of surfacing inside VS Code~~

### ~~8. Add Automated Tests~~

~~Goal:~~

~~Stop relying only on manual extension-host testing.~~

~~Tasks:~~

- ~~add unit tests for trigger parsing~~
- ~~add unit tests for entry resolution~~
- ~~add unit tests for completion filtering~~
- ~~add unit tests for keyword inference~~
- ~~add integration tests for command execution in a test editor document~~

~~Decision: `npm test` now bundles TypeScript tests with `esbuild`, aliases `vscode` to a local stub, and runs them with Node's built-in test runner. The suite covers trigger parsing, entry resolution, completion filtering, keyword inference, completion provider behavior, and command execution against in-memory editor documents.~~

~~Done when:~~

- ~~core behavior is protected against regressions~~

### ~~9. Improve Completion UX~~

~~Goal:~~

~~Make completions faster and easier to understand.~~

~~Tasks:~~

- ~~show better detail text for each completion item~~
- ~~sort results more intentionally~~
- ~~decide whether completions should appear only after `>`~~
- ~~consider preview text or documentation examples~~
- ~~make sure completion behavior does not fight normal editor usage~~

~~Decision: completions remain strictly scoped to `>`-prefixed triggers. Results are now ranked by exact keyword match, typed language suffix, active editor language, and prefix closeness. Each item shows a readable language label, a clearer detail line, and a short snippet preview in the documentation panel.~~

~~Done when:~~

- ~~users can discover entries without friction~~

### ~~9.1. Tighten Language-Only Completion Filtering~~

~~Goal:~~

~~Make language-only prefixes and completion detail text more precise.~~

~~Tasks:~~

- ~~make `>.js`, `>.ts`, `>.react`, `>.java`, and `>.php` show only that language's entries~~
- ~~remove redundant `JavaScript snippet` and similar labels from the one-line completion detail~~
- ~~keep the interesting information in the detail line and leave preview text to the documentation panel~~

~~Decision: language-only prefixes now filter strictly by suffix across every supported trigger language, and completion detail text now shows the entry description directly instead of repeating the language plus the word `snippet`.~~

~~Done when:~~

- ~~language-only filtering works consistently and completion rows waste less space~~

### ~~10. Improve Translate Selection~~

~~Goal:~~

~~Make `translateSelection` useful beyond a small regex demo.~~

~~Tasks:~~

- ~~expand keyword inference coverage~~
- ~~add better matching for real code selections~~
- ~~allow the command to ask for a target language when needed~~
- ~~decide whether selected code should be replaced or inserted beside the selection~~

~~Decision: `translateSelection` now accepts exact core and package ids, triggerless core ids such as `map.java`, plain keywords, and a wider set of real code patterns. When a keyword maps to multiple languages, the command asks for the target language first. The chosen insertion model is replace-in-place: the selected text is replaced by the snippet instead of inserting a translation beside it.~~

~~Done when:~~

- ~~the command is predictably useful for real workflows~~

### ~~11. Add User Configuration And Extensibility~~

~~Goal:~~

~~Make the extension customizable without editing source code.~~

~~Tasks:~~

- ~~add a setting for custom entries~~
- ~~decide whether custom entries live in JSON or workspace settings~~
- ~~allow users to disable built-in entries they do not want~~
- ~~consider workspace-local catalogs later~~

~~Decision: extensibility now lives in standard VS Code settings. `codeDictionary.customEntries` accepts custom catalog objects in `settings.json`, and `codeDictionary.disabledEntries` removes built-in entries by id. Custom entries override built-in entries with the same trigger id. Separate workspace-local catalog files are still deferred.~~

~~Done when:~~

- ~~teams can adapt the extension without forking it~~

### ~~11.1. Add A Sidebar Form For Custom Entries~~

~~Goal:~~

~~Make custom entry creation visible and usable without hand-editing JSON settings.~~

~~Tasks:~~

- ~~add a sidebar form for `keyword`, `language`, `description`, and `snippet`~~
- ~~save valid submissions into `codeDictionary.customEntries`~~
- ~~upsert entries when the same trigger id already exists~~
- ~~show enough feedback that the user knows where the entry was saved~~

~~Decision: the Activity Bar sidebar now includes an `Add Custom Entry` webview form. Valid submissions are saved into `codeDictionary.customEntries`, existing custom entries with the same trigger id are updated in place, and the save feedback tells the user whether the entry went to workspace or user settings.~~

~~Done when:~~

- ~~users can add custom entries from the sidebar instead of editing JSON manually~~

### ~~11.2. Add Ecosystem Catalog Files~~

~~Goal:~~

~~Expand the built-in catalog structure to cover the most common ecosystems beyond the current core languages.~~

~~Tasks:~~

- ~~add dedicated ecosystem section files inside the current supported languages~~
- ~~add catalog files for common SQL families and dialects~~
- ~~add catalog files for popular ORM patterns and query builders~~
- ~~add catalog files for common Node packages and server-side utility libraries~~
- ~~add catalog files for major design systems and UI component ecosystems~~
- ~~decide which ecosystems belong in core and which should stay out of scope~~
- ~~define naming rules so package, ORM, SQL, and design-system triggers stay consistent~~

~~Decision: ecosystem snippets now live under `src/data/ecosystems/<language>/packages`, and each language now uses `src/data/ecosystems/<language>/<language>.ts` as its root catalog entrypoint. The initial coverage includes SQL sections for JavaScript and Java, ORM sections for TypeScript, Java, and PHP, Node package sections for JavaScript and TypeScript, and design-system sections for React.~~

~~Artifacts:~~

- ~~[src/data/ecosystems](C:\Users\besma\OneDrive\Documentos\vscode%20ext\src\data\ecosystems) contains the new split catalog files~~
- ~~[README.md](C:\Users\besma\OneDrive\Documentos\vscode%20ext\README.md) and [COMMANDS.md](C:\Users\besma\OneDrive\Documentos\vscode%20ext\COMMANDS.md) now show an exact snippet-add example~~

~~Done when:~~

- ~~the project has a clear file structure and initial catalog coverage for the most common languages, SQLs, ORMs, Node packages, and design systems~~

### 12. Improve Documentation

Goal:

Keep the docs useful as the feature set grows.

Tasks:

- add a catalog reference by language
- document naming conventions
- document how to test the extension locally
- document how to add new catalog entries safely
- document what is intentionally out of scope

Done when:

- a new contributor can understand the project without reverse-engineering the code

### 13. Package And Publish

Goal:

Prepare the extension for real distribution.

Tasks:

- review `package.json` metadata
- add icon, license confirmation, and marketplace polish
- package a `.vsix`
- test install from packaged output
- publish only after the core catalog and tests are in good shape

Done when:

- the extension is installable outside the development workspace

## Recommended Order

The best implementation order from here is:

1. stabilize trigger model and naming rules
2. expand React and TypeScript
3. expand Java and PHP
4. add validation
5. add automated tests
6. improve completion and selection workflows
7. add custom user entries
8. package and publish

## What Not To Do Yet

Avoid these until the catalogs and tests are stronger:

- adding AI generation
- adding framework-specific catalogs everywhere
- supporting multiple competing trigger formats
- publishing before validation and tests exist
