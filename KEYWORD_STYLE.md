# Keyword Naming Guide

## Purpose

This file defines the canonical naming rules for entry keywords.

The keyword is the first segment of both id shapes:

- core entries: `>keyword.language`
- package entries: `keyword.package.language`

Examples:

- `>map.js`
- `>promiseall.js`
- `post.express.js`
- `findmany.prisma.ts`

## Canonical Rules

### 1. Keywords are lowercase only

Allowed:

- `map`
- `fetch`
- `promiseall`

Rejected:

- `Map`
- `forEach`
- `tryCatch`

### 2. Keywords use letters and digits only

Allowed:

- `jsonparse`
- `urlparams`
- `findmany`

Rejected:

- `json-parse`
- `json_parse`
- `find-many`

### 3. One concept gets one canonical keyword

Examples:

- use `foreach`, not `forEach`
- use `promiseall`, not `promiseAll`
- use `trycatch`, not `tryCatch`

This extension does not support trigger aliases for the same concept.

### 4. Multi-word concepts are collapsed into one word

Examples:

- `promiseall`
- `trycatch`
- `queryall`
- `localstorage`
- `sessionstorage`

### 5. Prefer the shortest unambiguous keyword

Examples:

- use `query`, not `queryselector`
- use `queryall`, not `queryselectorall`
- use `urlparams`, not `urlsearchparams`

The goal is predictable and ergonomic ids, not full API-name transcription.

### 6. For package entries, keep the keyword package-local

Good:

- `post.express.js`
- `get.axios.js`
- `findmany.prisma.ts`
- `card.tailwind.react`

Rejected:

- `expresspost.express.js`
- `axiosget.axios.js`
- `prismafindmany.prisma.ts`
- `tailwindcard.tailwind.react`

If the package already scopes the concept, do not repeat the package name in the keyword.

### 7. Prefer plain concept names over implementation details

Examples:

- `map`
- `filter`
- `reduce`
- `fetch`
- `loop`

If a shorter concept name is obvious and unambiguous, prefer it over a longer technical label.

## Alias Policy

Trigger aliases are rejected.

Rejected examples:

- `>forEach.js`
- `>promiseAll.js`
- `>json-parse.js`
- `>query_selector.js`

Users should type the canonical keyword exactly as documented.

## Future Entry Checklist

Before adding a new keyword, verify:

1. it is lowercase
2. it uses only letters and digits
3. it does not duplicate an existing concept under another spelling
4. it is the shortest unambiguous name
5. for package entries, it does not repeat the package name
6. it matches the naming style already used in the catalog
