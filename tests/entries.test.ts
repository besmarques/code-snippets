import assert from 'node:assert/strict';
import { test } from 'node:test';

import { __reset, __setConfigurationValue } from './support/vscode';
import { formatEntryKey } from '../src/core/registry';
import {
  getEntriesForKeyword,
  listEntries,
  resolveEntryFromTrigger,
  searchEntriesByPrefix,
  sortEntriesForContext,
} from '../src/core/registry';

test('resolveEntryFromTrigger returns the exact entry', () => {
  const entry = resolveEntryFromTrigger({
    raw: '>map.js',
    keyword: 'map',
    language: 'js',
  });

  assert.ok(entry);
  assert.equal(entry.language, 'js');
  assert.match(entry.snippet, /\.map\s*\(/);
});

test('resolveEntryFromTrigger returns the exact package entry', () => {
  const entry = resolveEntryFromTrigger({
    raw: 'post.express.js',
    keyword: 'post',
    ecosystem: 'express',
    language: 'js',
  });

  assert.ok(entry);
  assert.equal(entry.ecosystem, 'express');
  assert.match(entry.snippet, /app\.post/);
});

test('searchEntriesByPrefix filters and sorts completions for react context', () => {
  const entries = searchEntriesByPrefix('>map.', 'javascriptreact');

  assert.ok(entries.length >= 3);
  assert.equal(entries[0]?.language, 'react');
  assert.ok(entries.every((entry) => entry.keyword === 'map'));
  assert.ok(entries.some((entry) => entry.language === 'js'));
});

test('searchEntriesByPrefix prefers exact keyword matches before longer prefixes', () => {
  const entries = searchEntriesByPrefix('>use', 'javascriptreact');

  assert.ok(entries.length >= 3);
  assert.equal(entries[0]?.keyword, 'use');
  assert.equal(entries[0]?.language, 'react');
});

test('searchEntriesByPrefix prefers the shorter exact language match for partial suffixes', () => {
  const entries = searchEntriesByPrefix('>map.j', 'javascript');

  assert.ok(entries.length >= 2);
  assert.equal(entries[0]?.language, 'js');
  assert.equal(entries[1]?.language, 'java');
});

test('searchEntriesByPrefix supports language-only filtering for JavaScript', () => {
  const entries = searchEntriesByPrefix('>.js', 'javascript');

  assert.ok(entries.length > 0);
  assert.ok(entries.every((entry) => entry.language === 'js'));
});

test('searchEntriesByPrefix supports language-only filtering for PHP', () => {
  const entries = searchEntriesByPrefix('>.php', 'php');

  assert.ok(entries.length > 0);
  assert.ok(entries.every((entry) => entry.language === 'php'));
});

test('sortEntriesForContext prioritizes the active language', () => {
  const entries = getEntriesForKeyword('class');
  const sorted = sortEntriesForContext(entries, 'php');

  assert.ok(sorted.length >= 3);
  assert.equal(sorted[0]?.language, 'php');
});

test('listEntries includes valid custom entries from settings', () => {
  __reset();
  __setConfigurationValue('customEntries', [
    {
      ecosystem: 'express',
      keyword: 'slugify',
      language: 'js',
      description: 'Convert text into a URL slug.',
      snippet: "const slug = input.toLowerCase().replace(/\\s+/g, '-');\n$0",
    },
  ]);

  const entry = listEntries().find((candidate) => candidate.keyword === 'slugify' && candidate.language === 'js');

  assert.ok(entry);
  assert.equal(entry.description, 'Convert text into a URL slug.');
  assert.equal(entry.detail, 'Custom entry.');
  assert.equal(entry.ecosystem, 'express');
});

test('listEntries hides disabled built-in entries', () => {
  __reset();
  __setConfigurationValue('disabledEntries', ['>map.js']);

  const entries = getEntriesForKeyword('map');

  assert.ok(entries.length >= 2);
  assert.equal(entries.some((entry) => entry.language === 'js'), false);
  assert.equal(entries.some((entry) => entry.language === 'react'), true);
});

test('custom entries override built-in entries with the same id', () => {
  __reset();
  __setConfigurationValue('customEntries', [
    {
      ecosystem: 'core',
      keyword: 'map',
      language: 'js',
      description: 'Custom JavaScript map entry.',
      snippet: 'const customMap = true;\n$0',
    },
  ]);

  const entry = resolveEntryFromTrigger({
    raw: '>map.js',
    keyword: 'map',
    language: 'js',
  });

  assert.ok(entry);
  assert.equal(entry.description, 'Custom JavaScript map entry.');
  assert.equal(entry.snippet, 'const customMap = true;\n$0');
});

test('listEntries includes ecosystem snippets from every split package catalog file', () => {
  const entriesById = new Map(listEntries().map((entry) => [formatEntryKey(entry), entry]));

  assert.equal(entriesById.has('instance.axios.js'), true);
  assert.equal(entriesById.get('instance.axios.js')?.ecosystem, 'axios');
  assert.equal(entriesById.has('required.dotenv.js'), true);
  assert.equal(entriesById.get('required.dotenv.js')?.ecosystem, 'dotenv');
  assert.equal(entriesById.has('router.express.js'), true);
  assert.equal(entriesById.get('router.express.js')?.ecosystem, 'express');
  assert.equal(entriesById.has('middleware.jsonwebtoken.js'), true);
  assert.equal(entriesById.get('middleware.jsonwebtoken.js')?.ecosystem, 'jsonwebtoken');
  assert.equal(entriesById.has('join.sql.js'), true);
  assert.equal(entriesById.get('join.sql.js')?.ecosystem, 'sql');

  assert.equal(entriesById.has('transaction.drizzle.ts'), true);
  assert.equal(entriesById.get('transaction.drizzle.ts')?.ecosystem, 'drizzle');
  assert.equal(entriesById.has('router.express.ts'), true);
  assert.equal(entriesById.get('router.express.ts')?.ecosystem, 'express');
  assert.equal(entriesById.has('transaction.prisma.ts'), true);
  assert.equal(entriesById.get('transaction.prisma.ts')?.ecosystem, 'prisma');
  assert.equal(entriesById.has('querybuilder.typeorm.ts'), true);
  assert.equal(entriesById.get('querybuilder.typeorm.ts')?.ecosystem, 'typeorm');
  assert.equal(entriesById.has('refine.zod.ts'), true);
  assert.equal(entriesById.get('refine.zod.ts')?.ecosystem, 'zod');

  assert.equal(entriesById.has('dialog.chakra.react'), true);
  assert.equal(entriesById.get('dialog.chakra.react')?.ecosystem, 'chakra');
  assert.equal(entriesById.has('dialog.mui.react'), true);
  assert.equal(entriesById.get('dialog.mui.react')?.ecosystem, 'mui');
  assert.equal(entriesById.has('dialog.shadcn.react'), true);
  assert.equal(entriesById.get('dialog.shadcn.react')?.ecosystem, 'shadcn');
  assert.equal(entriesById.has('navbar.tailwind.react'), true);
  assert.equal(entriesById.get('navbar.tailwind.react')?.ecosystem, 'tailwind');

  assert.equal(entriesById.has('accordion.bootstrap.html'), true);
  assert.equal(entriesById.get('accordion.bootstrap.html')?.ecosystem, 'bootstrap');
  assert.equal(entriesById.has('stats.tailwind.html'), true);
  assert.equal(entriesById.get('stats.tailwind.html')?.ecosystem, 'tailwind');

  assert.equal(entriesById.has('media.sass.css'), true);
  assert.equal(entriesById.get('media.sass.css')?.ecosystem, 'sass');
  assert.equal(entriesById.has('surface.tailwind.css'), true);
  assert.equal(entriesById.get('surface.tailwind.css')?.ecosystem, 'tailwind');

  assert.equal(entriesById.has('call.jdbc.java'), true);
  assert.equal(entriesById.get('call.jdbc.java')?.ecosystem, 'jdbc');
  assert.equal(entriesById.has('manytomany.jpa.java'), true);
  assert.equal(entriesById.get('manytomany.jpa.java')?.ecosystem, 'jpa');

  assert.equal(entriesById.has('fetchall.pdo.php'), true);
  assert.equal(entriesById.get('fetchall.pdo.php')?.ecosystem, 'pdo');
  assert.equal(entriesById.has('belongsto.eloquent.php'), true);
  assert.equal(entriesById.get('belongsto.eloquent.php')?.ecosystem, 'eloquent');
});

test('wrapper snippets keep wrapper bodies at the first tab stop for composition', () => {
  const jsFunction = resolveEntryFromTrigger({
    raw: '>function.js',
    keyword: 'function',
    language: 'js',
  });
  const jsComponent = resolveEntryFromTrigger({
    raw: '>component.js',
    keyword: 'component',
    language: 'js',
  });
  const tsAsync = resolveEntryFromTrigger({
    raw: '>async.ts',
    keyword: 'async',
    language: 'ts',
  });
  const reactComponent = resolveEntryFromTrigger({
    raw: '>component.react',
    keyword: 'component',
    language: 'react',
  });
  const reactOnSubmit = resolveEntryFromTrigger({
    raw: '>onsubmit.react',
    keyword: 'onsubmit',
    language: 'react',
  });
  const reactForm = resolveEntryFromTrigger({
    raw: '>form.react',
    keyword: 'form',
    language: 'react',
  });
  const phpFunction = resolveEntryFromTrigger({
    raw: '>function.php',
    keyword: 'function',
    language: 'php',
  });
  const phpMiddleware = resolveEntryFromTrigger({
    raw: '>middleware.php',
    keyword: 'middleware',
    language: 'php',
  });

  assert.ok(jsFunction);
  assert.ok(jsComponent);
  assert.ok(tsAsync);
  assert.ok(reactComponent);
  assert.ok(reactOnSubmit);
  assert.ok(reactForm);
  assert.ok(phpFunction);
  assert.ok(phpMiddleware);

  assert.equal(jsFunction.snippet.includes('${1:${TM_SELECTED_TEXT}}'), true);
  assert.doesNotMatch(jsFunction.snippet, /return value;/);
  assert.equal(jsComponent.snippet.includes('${1:${TM_SELECTED_TEXT:<section>Content</section>}}'), true);
  assert.equal(tsAsync.snippet.includes('${1:${TM_SELECTED_TEXT}}'), true);
  assert.equal(reactComponent.snippet.includes('${1:${TM_SELECTED_TEXT:Content}}'), true);
  assert.equal(reactOnSubmit.snippet.includes('${1:${TM_SELECTED_TEXT:<button type="submit">Submit</button>}}'), true);
  assert.equal(reactForm.snippet.includes('${1:${TM_SELECTED_TEXT:<input type="text" name="${5:name}" />}}'), true);
  assert.equal(phpFunction.snippet.includes('function ${2:formatUser}'), true);
  assert.equal(phpFunction.snippet.includes("${1:${TM_SELECTED_TEXT:return $user['name'] ?? '';}}"), true);
  assert.equal(phpMiddleware.snippet.includes('function ${2:handle}'), true);
  assert.equal(phpMiddleware.snippet.includes("${1:${TM_SELECTED_TEXT:if (!$request->user()) {"), true);
});


