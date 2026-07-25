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

test('listEntries includes ecosystem snippets from split catalog files', () => {
  const entriesById = new Map(listEntries().map((entry) => [formatEntryKey(entry), entry]));

  assert.equal(entriesById.has('post.express.js'), true);
  assert.equal(entriesById.get('post.express.js')?.ecosystem, 'express');
  assert.equal(entriesById.get('findmany.prisma.ts')?.ecosystem, 'prisma');
  assert.equal(entriesById.get('card.tailwind.react')?.ecosystem, 'tailwind');
  assert.equal(entriesById.get('navbar.bootstrap.html')?.ecosystem, 'bootstrap');
  assert.equal(entriesById.get('mixin.sass.css')?.ecosystem, 'sass');
  assert.equal(entriesById.get('query.jdbc.java')?.ecosystem, 'jdbc');
  assert.equal(entriesById.get('model.eloquent.php')?.ecosystem, 'eloquent');
});

test('wrapper snippets support selected-text composition without forcing a default body', () => {
  const jsFunction = resolveEntryFromTrigger({
    raw: '>function.js',
    keyword: 'function',
    language: 'js',
  });
  const javaLoop = resolveEntryFromTrigger({
    raw: '>loop.java',
    keyword: 'loop',
    language: 'java',
  });
  const phpFunction = resolveEntryFromTrigger({
    raw: '>function.php',
    keyword: 'function',
    language: 'php',
  });

  assert.ok(jsFunction);
  assert.ok(javaLoop);
  assert.ok(phpFunction);
  assert.match(jsFunction.snippet, /\$\{1:\\?\$\{TM_SELECTED_TEXT\}\}/);
  assert.doesNotMatch(jsFunction.snippet, /return value;/);
  assert.match(javaLoop.snippet, /TM_SELECTED_TEXT/);
  assert.match(phpFunction.snippet, /TM_SELECTED_TEXT/);
});
