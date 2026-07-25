# Code Dictionary Roadmap

## Purpose

This roadmap should reflect the actual codebase on Saturday, July 25, 2026:

1. what is already working
2. what is still missing
3. what should be done next

## Current Baseline

Code Dictionary already has a solid functional base.

Implemented:

- canonical id model
  - core entries: `>keyword.language`
  - package entries: `keyword.package.language`
- supported trigger suffixes: `js`, `ts`, `react`, `html`, `css`, `java`, `php`
- split catalog structure under `src/data/ecosystems/<language>/packages`
- completion provider gated by `>`
- language-only filtering such as `>.js`
- direct trigger expansion
- selection translation from:
  - exact ids
  - triggerless ids such as `map.java`
  - plain keywords such as `map`
  - inferred code patterns such as `items.map(...)`
- sidebar catalog grouped by language and ecosystem
- sidebar webview for adding custom entries
- custom entries and disabled built-ins stored in settings
- restriction that custom entries can only target `core` or an existing built-in package for that language
- catalog validation and logic-level tests
- browser and desktop bundles
- wrapper snippet composition support using `TM_SELECTED_TEXT`

Current catalog footprint:

- JavaScript: 54 entries
- React: 40 entries
- TypeScript: 26 entries
- Java: 21 entries
- PHP: 18 entries
- HTML: 9 entries
- CSS: 9 entries

Current built-in package files:

- JavaScript: 5
- TypeScript: 5
- React: 4
- HTML: 2
- CSS: 2
- Java: 2
- PHP: 2

Current validation state:

- `npm test` passes
- `npm run build:dev` passes
- `tsc --noEmit` passes

## Confirmed Gaps In The Current Codebase

These are not guesses. They are visible in the current source.

### 1. Custom Entry Maintenance Is Still Incomplete

What exists:

- the sidebar form can create and update a custom entry
- the webview lists current custom entries

What is missing:

- no edit button to load an existing custom entry back into the form
- no delete action for custom entries
- no override badge showing that a custom entry replaces a built-in entry
- no quick action to open the relevant `settings.json` location

### 2. Sidebar Catalog Is Browse-Only

What exists:

- language grouping
- ecosystem grouping
- entry listing

What is missing:

- clicking an entry does not insert it
- there is no copy-trigger action
- there is no search or filter inside the sidebar
- there is no richer preview beyond tooltip text

### 3. Expansion UX Still Depends Too Much On VS Code Defaults

What exists:

- completion suggestions
- explicit `Expand Trigger at Cursor`
- wrapper snippets that can accept selected code

What is missing:

- no dedicated keybinding for expansion
- no clearer compose/expand workflow in the command surface
- nested wrapper flows still depend on how VS Code accepts completion items with `Enter` or `Tab`

### 4. Catalog Coverage Is Uneven

The catalog is already decent in `js`, `react`, and `ts`.

The thinner areas are:

- `html`
- `css`
- `java` package coverage
- `php` package coverage

There is still room for more high-value package ecosystems in:

- JavaScript server/runtime work
- TypeScript API, validation, and ORM patterns
- React forms, state, data, and design-system patterns

### 5. Contributor Workflow Is Still Mostly Manual

What exists:

- file layout is documented
- naming rules are documented
- catalog validation catches malformed entries and duplicates

What is missing:

- no contributor script to list ecosystems and package files by language
- no contributor helper for adding a new package file
- no single maintenance checklist focused on source-package additions

### 6. Test Coverage Is Strong At Logic Level But Weak At Real VS Code Level

What exists:

- parser tests
- registry tests
- completion tests
- translation tests
- settings tests
- integration-style command tests using stubs

What is missing:

- no real extension-host smoke tests
- no activation test in a real VS Code host
- no real webview/sidebar smoke test
- no packaged install smoke test

### 7. Release Readiness Is Not Finished

What exists:

- manifest basics
- icon
- build outputs for node and browser

What is missing:

- no `.vsix` packaging flow
- no install-from-package test
- no release checklist
- no marketplace-ready validation pass

## Next Steps

This section replaces the duplicated old roadmap steps.

### ~~12. Sidebar Custom Entry Maintenance~~

Completed on July 25, 2026.

Delivered:

- edit support from the current custom-entry list
- delete support from the current custom-entry list
- override visibility for custom entries that replace built-ins
- a quick action to open the relevant settings JSON

### ~~13. Sidebar Catalog Actions And Search~~

Completed on July 25, 2026.

Delivered:

- clickable catalog entries that insert snippets into the active editor
- trigger-copy actions for catalog entries
- searchable sidebar actions for insert and trigger-copy flows
- richer entry previews in catalog tooltips
- more readable default grouping through collapsed catalog sections

### 14. Snippet Expansion UX Polish

Goal:

Reduce friction around expansion and composition.

Tasks:

- add a default keybinding for `codeDictionary.expandAtCursor`
- document the exact wrapper/composition workflow more clearly
- review wrapper snippets for consistent body-first behavior
- make nested expansion feel less dependent on VS Code defaults

Done when:

- users do not need trial and error to understand how to expand or compose snippets

### 15. Catalog Coverage Expansion

Goal:

Increase usefulness without lowering naming quality.

Priority order:

1. HTML and CSS core/package coverage
2. Java and PHP package coverage
3. more JavaScript and TypeScript server/data packages
4. more React package and UI patterns

Rules:

- keep keywords canonical
- keep package keywords package-local
- avoid filler snippets
- prefer high-frequency patterns only

Done when:

- the thin languages stop feeling underpowered compared with `js`, `react`, and `ts`

### 16. Real Extension-Host Smoke Tests

Goal:

Verify that the extension works in a real VS Code runtime, not only in stubs.

Tasks:

- add activation smoke tests
- add completion registration smoke tests
- add sidebar registration smoke tests
- add settings-driven custom-entry smoke tests

Done when:

- the highest-risk runtime wiring is covered outside the stubbed test harness

### 17. Packaging And Release Readiness

Goal:

Make the extension installable outside the dev workspace.

Tasks:

- add `.vsix` packaging flow
- test install from the packaged artifact
- review manifest metadata and marketplace presentation
- add a release checklist

Done when:

- the extension can be packaged, installed, and sanity-tested end to end

### 18. Contributor Tooling

Goal:

Make source-catalog maintenance faster and less error-prone.

Tasks:

- add a contributor script to list languages, ecosystems, and package files
- add a tighter checklist for adding new package catalogs
- consider validation for missing package imports into language root files

Done when:

- adding new built-in package entries is straightforward for someone who did not build the original structure

## Not Planned Right Now

Avoid these until the roadmap above is complete:

- generating source files from the sidebar
- allowing arbitrary new ecosystems from the UI
- adding alias trigger formats
- adding AI generation before the catalog and release flow are stable

