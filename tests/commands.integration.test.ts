import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as vscode from 'vscode';

import { expandAtCursor } from '../src/commands/expandAtCursor';
import { searchCatalog, searchCatalogAndCopyTrigger } from '../src/commands/searchCatalog';
import { copyEntryTrigger, insertEntryFromSidebar } from '../src/commands/sidebarEntryActions';
import { translateSelection } from '../src/commands/translateSelection';
import { formatEntryId, listEntries } from '../src/core/registry';
import type { DictionaryEntry } from '../src/types';
import {
  createCursorSelection,
  createSelection,
  createTestEditor,
} from './support/editor';
import {
  __getClipboardText,
  __getInformationMessages,
  __getQuickPickCalls,
  __reset,
  __setQuickPickHandler,
} from './support/vscode';

function getEntry(entryId: string): DictionaryEntry {
  const entry = listEntries().find((candidate) => formatEntryId(candidate) === entryId);

  assert.ok(entry, `Expected to find ${entryId} in the built-in catalog.`);
  return entry;
}

test('expandAtCursor inserts the matching snippet at the trigger range', async () => {
  __reset();

  const text = 'const result = >map.js';
  const editor = createTestEditor(text, 'javascript', createCursorSelection(0, text.length));
  vscode.window.activeTextEditor = editor as never;

  await expandAtCursor();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /\.map\s*\(/);
  assert.equal(editor.document.getText(editor.insertions[0]?.range), '>map.js');
});

test('translateSelection expands a selected trigger directly', async () => {
  __reset();

  const text = '>fetch.java';
  const editor = createTestEditor(text, 'java', createSelection(0, 0, 0, text.length));
  vscode.window.activeTextEditor = editor as never;

  await translateSelection();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /\bHttpClient\b/);
});

test('translateSelection infers a keyword and inserts the chosen translation', async () => {
  __reset();
  __setQuickPickHandler((items) => items.find((item) => item.label === 'React') ?? items[0]);

  const text = 'items.map((item) => item.name)';
  const editor = createTestEditor(
    text,
    'javascriptreact',
    createSelection(0, 0, 0, text.length),
  );
  vscode.window.activeTextEditor = editor as never;

  await translateSelection();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /key=\{/);
  assert.equal(__getQuickPickCalls().length, 1);
  assert.equal(editor.document.getText(editor.insertions[0]?.range), text);
});

test('translateSelection asks for a target language before inserting an ambiguous keyword', async () => {
  __reset();
  __setQuickPickHandler((items) => items.find((item) => item.label === 'JavaScript') ?? items[0]);

  const text = 'map';
  const editor = createTestEditor(
    text,
    'javascriptreact',
    createSelection(0, 0, 0, text.length),
  );
  vscode.window.activeTextEditor = editor as never;

  await translateSelection();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /\.map\s*\(/);
  assert.equal(__getQuickPickCalls().length, 1);
  assert.equal(__getQuickPickCalls()[0]?.items.map((item) => item.label).includes('JavaScript'), true);
});

test('translateSelection accepts triggerless keyword-language selections', async () => {
  __reset();

  const text = 'map.java';
  const editor = createTestEditor(text, 'java', createSelection(0, 0, 0, text.length));
  vscode.window.activeTextEditor = editor as never;

  await translateSelection();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /\bMap</);
});

test('translateSelection accepts package-scoped selections', async () => {
  __reset();

  const text = 'post.express.js';
  const editor = createTestEditor(text, 'javascript', createSelection(0, 0, 0, text.length));
  vscode.window.activeTextEditor = editor as never;

  await translateSelection();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /app\.post/);
});

test('searchCatalog inserts the selected catalog entry', async () => {
  __reset();
  __setQuickPickHandler((items) => items.find((item) => item.label === '>map.js') ?? items[0]);

  const editor = createTestEditor('', 'javascript', createCursorSelection(0, 0));
  vscode.window.activeTextEditor = editor as never;

  await searchCatalog();

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /\.map\s*\(/);
  assert.equal(__getQuickPickCalls().length, 1);
});

test('searchCatalogAndCopyTrigger copies the selected trigger', async () => {
  __reset();
  __setQuickPickHandler((items) => items.find((item) => item.label === 'post.express.js') ?? items[0]);

  await searchCatalogAndCopyTrigger();

  assert.equal(__getClipboardText(), '>post.express.js');
  assert.equal(__getInformationMessages().includes('Copied >post.express.js to the clipboard.'), true);
});

test('insertEntryFromSidebar accepts a sidebar node and inserts its entry', async () => {
  __reset();

  const editor = createTestEditor('', 'javascript', createCursorSelection(0, 0));
  vscode.window.activeTextEditor = editor as never;

  await insertEntryFromSidebar({ entry: getEntry('>map.js') });

  assert.equal(editor.insertions.length, 1);
  assert.match(editor.insertions[0]?.snippet ?? '', /\.map\s*\(/);
});

test('copyEntryTrigger copies the trigger for a direct entry', async () => {
  __reset();

  await copyEntryTrigger(getEntry('post.express.js'));

  assert.equal(__getClipboardText(), '>post.express.js');
  assert.equal(__getInformationMessages().includes('Copied >post.express.js to the clipboard.'), true);
});
