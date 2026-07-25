# Code Dictionary Roadmap

## Purpose

This roadmap should answer three things clearly:

1. what the extension already does
2. what still needs work
3. what order makes the most sense next

## Product Direction

Code Dictionary is a VS Code extension that expands short ids into code snippets across core languages and built-in package ecosystems.

Current id model:

- core entries: `>keyword.language`
- package entries: `keyword.package.language`

Examples:

- `>map.js`
- `>map.react`
- `post.express.js`
- `findmany.prisma.ts`
- `card.tailwind.react`

Current data structure:

```text
src/data/ecosystems/<language>/
  <language>.ts
  packages/
    <package>.ts
```

## Completed

These foundations are already in place:

- core and package id parsing
- canonical language suffixes: `js`, `ts`, `react`, `html`, `css`, `java`, `php`
- canonical keyword rules, including package-local keyword naming
- built-in catalogs for JavaScript, TypeScript, React, HTML, CSS, Java, and PHP
- package catalogs split by language under `src/data/ecosystems/<language>/packages`
- completion provider with `>`-gated suggestions
- language-only completion filtering such as `>.js`
- exact entry resolution for both core and package ids
- `translateSelection` support for exact ids, keyword-language ids, keywords, and inferred code patterns
- sidebar catalog and command shortcuts
- sidebar custom-entry form
- custom entries and disabled built-ins in `settings.json`
- restriction that custom entries can only target `core` or an existing built-in package for that language
- validation for catalog structure and duplicate trigger ids
- test suite for parser, registry, completion, inference, and command flows
- browser and desktop bundle targets
- cleaned and aligned documentation across user and contributor docs

## Current Constraints

These are deliberate and should remain explicit:

- completion only opens after `>`
- alias suffixes such as `javascript`, `typescript`, `jsx`, and `tsx` are rejected
- custom entries can target `core` or an existing built-in package for that language only
- the sidebar form does not create new source files or new package catalogs
- built-in package files are still maintained in source, not through the UI

## What Needs Improvement

The project is functional, but there are still clear gaps.

### 1. Custom Entry Management

Why it matters:

- users can add and override entries, but managing them is still rough

Needed work:

- add delete support for custom entries from the sidebar
- add edit/load-existing-entry support in the sidebar form
- show whether an entry overrides a built-in entry
- add a quick action to open the exact `settings.json` location if needed

### 2. Catalog Coverage Expansion

Why it matters:

- the structure is strong enough now that snippet breadth is the main value driver

Needed work:

- review weak areas by language
- expand built-in package coverage where the current ecosystem list is thin
- keep package-local keywords clean and non-redundant
- decide which ecosystems are important enough to include by default

High-value likely candidates:

- JavaScript: more server/runtime packages
- TypeScript: more validation, ORM, and API patterns
- React: more UI/data-fetch/form patterns
- Java: more framework-level patterns if the project wants them
- PHP: more framework/database/http patterns if the project wants them

### 3. Contributor Workflow For Built-In Packages

Why it matters:

- contributors still need to understand the file layout manually before adding source entries

Needed work:

- add a documented checklist for creating a new built-in package file
- validate that package files are imported into the matching language root file
- consider a small contributor script for listing built-in packages by language

### 4. Better Sidebar Discovery

Why it matters:

- the catalog is growing, so browsing needs to stay fast

Needed work:

- consider a search box or filtered quick action for entries
- consider showing snippet previews or more helpful descriptions in the sidebar
- consider better grouping labels for large languages with many package files

### 5. Stronger End-To-End Testing

Why it matters:

- the current tests are good at logic-level coverage, but still stub VS Code heavily

Needed work:

- add real extension-host smoke tests for:
  - activation
  - completion registration
  - sidebar registration
  - settings-driven custom entries
- add one packaging/install smoke test before publishing

### 6. Release And Packaging

Why it matters:

- the extension works locally, but release readiness is still incomplete

Needed work:

- review manifest metadata
- confirm icon and marketplace presentation
- produce a `.vsix`
- test install from the packaged artifact
- add a release checklist

## Recommended Next Order

The best order from here is:

1. improve custom-entry management
2. expand built-in catalog coverage
3. strengthen contributor workflow for built-in package files
4. improve sidebar discovery
5. add extension-host smoke tests
6. package and test a real `.vsix`

## Immediate Next Step

### 12. Custom Entry Management

Goal:

Make custom entries maintainable from inside VS Code.

Tasks:

- support editing an existing custom entry from the sidebar
- support deleting a custom entry from the sidebar
- show override state clearly
- keep the built-in-package restriction intact

Done when:

- users do not need to hand-edit settings for normal custom-entry maintenance

## After That

### 13. Catalog Coverage Review

Goal:

Increase snippet usefulness without damaging naming quality.

Tasks:

- review each language for missing high-frequency patterns
- add entries only where the keyword and package naming remain clean
- avoid noisy or low-value snippets

Done when:

- the catalog feels intentionally curated rather than just larger

### 14. Release Readiness

Goal:

Prepare the extension for distribution.

Tasks:

- validate metadata and install flow
- build and test a `.vsix`
- add a release checklist and versioning discipline

Done when:

- the extension is installable and testable outside the dev workspace

## What Not To Do Yet

Avoid these until custom-entry management and release flow are cleaner:

- generating source package files from the sidebar
- adding AI generation
- supporting multiple competing id formats
- publishing before packaged install testing exists
