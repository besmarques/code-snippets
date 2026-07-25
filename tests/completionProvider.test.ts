import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as vscode from 'vscode';

import { registerCompletionProvider } from '../src/providers/completionProvider';
import { createTestDocument } from './support/editor';
import {
  __getCompletionProviders,
  __reset,
  __setConfigurationValue,
} from './support/vscode';

test('registerCompletionProvider returns snippet completions for trigger prefixes', () => {
  __reset();
  __setConfigurationValue('enableCompletions', true);

  const context = { subscriptions: [] as Array<{ dispose(): void }> };
  registerCompletionProvider(context as never);

  const provider = __getCompletionProviders()[0]?.provider;
  const text = 'const value = >map.';
  const document = createTestDocument(text, 'javascriptreact');
  const items = provider?.provideCompletionItems(document as never, new vscode.Position(0, text.length));

  assert.ok(Array.isArray(items));
  assert.equal(items[0]?.label, '>map.react');
  assert.equal(items[0]?.detail, 'Render a list in JSX with a key and inline element output.');
  assert.equal(items[0]?.sortText, '0000');
  assert.equal(items[0]?.filterText, '>map.react');
  assert.equal(items[0]?.documentation?.value.includes('Preview:'), true);
  assert.equal(items[0]?.documentation?.value.includes('```jsx'), true);
  assert.equal(items[0]?.insertText?.value.includes('map'), true);
});

test('registerCompletionProvider shows package labels and prefixed filter text', () => {
  __reset();
  __setConfigurationValue('enableCompletions', true);

  const context = { subscriptions: [] as Array<{ dispose(): void }> };
  registerCompletionProvider(context as never);

  const provider = __getCompletionProviders()[0]?.provider;
  const text = 'const route = >post';
  const document = createTestDocument(text, 'javascript');
  const items = provider?.provideCompletionItems(document as never, new vscode.Position(0, text.length));

  assert.ok(Array.isArray(items));
  const item = items.find((candidate) => candidate.label === 'post.express.js');

  assert.ok(item);
  assert.equal(item.filterText, '>post.express.js');
  assert.equal(item.detail, 'Create an Express POST route handler.');
});

test('registerCompletionProvider supports language-only trigger prefixes', () => {
  __reset();
  __setConfigurationValue('enableCompletions', true);

  const context = { subscriptions: [] as Array<{ dispose(): void }> };
  registerCompletionProvider(context as never);

  const provider = __getCompletionProviders()[0]?.provider;
  const text = 'const value = >.php';
  const document = createTestDocument(text, 'php');
  const items = provider?.provideCompletionItems(document as never, new vscode.Position(0, text.length));

  assert.ok(Array.isArray(items));
  assert.ok(items.length > 0);
  assert.ok(items.every((item) => typeof item.label === 'string' && item.label.endsWith('.php')));
});

test('registerCompletionProvider supports language-only trigger prefixes for CSS', () => {
  __reset();
  __setConfigurationValue('enableCompletions', true);

  const context = { subscriptions: [] as Array<{ dispose(): void }> };
  registerCompletionProvider(context as never);

  const provider = __getCompletionProviders()[0]?.provider;
  const text = 'const value = >.css';
  const document = createTestDocument(text, 'css');
  const items = provider?.provideCompletionItems(document as never, new vscode.Position(0, text.length));

  assert.ok(Array.isArray(items));
  assert.ok(items.length > 0);
  assert.ok(items.every((item) => typeof item.label === 'string' && item.label.endsWith('.css')));
});

test('registerCompletionProvider surfaces custom entries from settings', () => {
  __reset();
  __setConfigurationValue('enableCompletions', true);
  __setConfigurationValue('customEntries', [
    {
      keyword: 'slugify',
      language: 'js',
      description: 'Convert text into a URL slug.',
      snippet: "const slug = input.toLowerCase().replace(/\\s+/g, '-');\n$0",
    },
  ]);

  const context = { subscriptions: [] as Array<{ dispose(): void }> };
  registerCompletionProvider(context as never);

  const provider = __getCompletionProviders()[0]?.provider;
  const text = 'const value = >slug';
  const document = createTestDocument(text, 'javascript');
  const items = provider?.provideCompletionItems(document as never, new vscode.Position(0, text.length));

  assert.ok(Array.isArray(items));
  assert.equal(items[0]?.label, '>slugify.js');
  assert.equal(items[0]?.detail, 'Convert text into a URL slug.');
});

test('registerCompletionProvider respects disabled completions', () => {
  __reset();
  __setConfigurationValue('enableCompletions', false);

  const context = { subscriptions: [] as Array<{ dispose(): void }> };
  registerCompletionProvider(context as never);

  const provider = __getCompletionProviders()[0]?.provider;
  const text = 'const value = >map.';
  const document = createTestDocument(text, 'javascriptreact');
  const items = provider?.provideCompletionItems(document as never, new vscode.Position(0, text.length));

  assert.equal(items, undefined);
});
