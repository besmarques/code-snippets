import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  __getConfigurationValue,
  __reset,
  __setConfigurationValue,
  __setWorkspaceFolders,
} from './support/vscode';
import { getCustomEntries, saveCustomEntry } from '../src/core/settings';

test('saveCustomEntry appends a new custom entry to settings', async () => {
  __reset();
  __setWorkspaceFolders([{}]);

  const result = await saveCustomEntry({
    ecosystem: 'core',
    keyword: 'slugify',
    language: 'js',
    description: 'Convert text into a URL slug.',
    snippet: "const slug = input.toLowerCase().replace(/\\s+/g, '-');\n$0",
  });

  assert.ok(result);
  assert.equal(result.mode, 'created');
  assert.equal(result.target, 'workspace');

  const stored = __getConfigurationValue('customEntries');
  assert.ok(Array.isArray(stored));
  assert.equal(stored[0]?.keyword, 'slugify');
  assert.equal(stored[0]?.ecosystem, 'core');
});

test('saveCustomEntry updates an existing custom entry with the same trigger id', async () => {
  __reset();
  __setConfigurationValue('customEntries', [
    {
      ecosystem: 'core',
      keyword: 'slugify',
      language: 'js',
      description: 'Old description.',
      snippet: 'const before = true;\n$0',
    },
  ]);

  const result = await saveCustomEntry({
    ecosystem: 'core',
    keyword: 'slugify',
    language: 'js',
    description: 'New description.',
    snippet: 'const after = true;\n$0',
  });

  assert.ok(result);
  assert.equal(result.mode, 'updated');

  const entries = getCustomEntries();
  assert.equal(entries.length, 1);
  assert.equal(entries[0]?.description, 'New description.');
  assert.equal(entries[0]?.ecosystem, 'core');
  assert.equal(entries[0]?.snippet, 'const after = true;\n$0');
});

test('saveCustomEntry keeps different ecosystems as separate ids', async () => {
  __reset();
  __setConfigurationValue('customEntries', [
    {
      ecosystem: 'core',
      keyword: 'slugify',
      language: 'js',
      description: 'Core entry.',
      snippet: 'const core = true;\n$0',
    },
  ]);

  const result = await saveCustomEntry({
    ecosystem: 'express',
    keyword: 'slugify',
    language: 'js',
    description: 'Express entry.',
    snippet: 'const expressRoute = true;\n$0',
  });

  assert.ok(result);
  assert.equal(result.mode, 'created');

  const entries = getCustomEntries();
  assert.equal(entries.length, 2);
  assert.equal(entries.some((entry) => entry.ecosystem === 'core'), true);
  assert.equal(entries.some((entry) => entry.ecosystem === 'express'), true);
});

test('saveCustomEntry rejects invalid sidebar form payloads', async () => {
  __reset();

  const result = await saveCustomEntry({
    ecosystem: 'Bad Ecosystem',
    keyword: 'Slugify',
    language: 'ruby',
    description: '',
    snippet: '',
  });

  assert.equal(result, undefined);
});

test('saveCustomEntry rejects package ids that do not exist for the selected language', async () => {
  __reset();

  const unknownPackage = await saveCustomEntry({
    ecosystem: 'sequelize',
    keyword: 'connect',
    language: 'js',
    description: 'Connect with Sequelize.',
    snippet: 'const db = true;\n$0',
  });

  const wrongLanguagePackage = await saveCustomEntry({
    ecosystem: 'tailwind',
    keyword: 'button',
    language: 'js',
    description: 'Wrong language package.',
    snippet: 'const button = true;\n$0',
  });

  assert.equal(unknownPackage, undefined);
  assert.equal(wrongLanguagePackage, undefined);
});

test('getCustomEntries defaults legacy custom entries to the core ecosystem', () => {
  __reset();
  __setConfigurationValue('customEntries', [
    {
      keyword: 'slugify',
      language: 'js',
      description: 'Convert text into a URL slug.',
      snippet: "const slug = input.toLowerCase().replace(/\\s+/g, '-');\n$0",
    },
  ]);

  const entries = getCustomEntries();

  assert.equal(entries.length, 1);
  assert.equal(entries[0]?.ecosystem, 'core');
});

test('getCustomEntries ignores orphaned custom package entries', () => {
  __reset();
  __setConfigurationValue('customEntries', [
    {
      ecosystem: 'sequelize',
      keyword: 'connect',
      language: 'js',
      description: 'Connect with Sequelize.',
      snippet: 'const db = true;\n$0',
    },
  ]);

  const entries = getCustomEntries();

  assert.equal(entries.length, 0);
});
