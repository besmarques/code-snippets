import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as vscode from 'vscode';

import { createTestDocument } from './support/editor';
import {
  findTriggerAtCursor,
  getTriggerPrefixAtPosition,
  parseTrigger,
} from '../src/core/triggers';

test('parseTrigger accepts canonical triggers', () => {
  assert.deepEqual(parseTrigger(' >map.js '), {
    raw: '>map.js',
    keyword: 'map',
    language: 'js',
  });
});

test('parseTrigger accepts package-scoped ids and rejects bare core ids', () => {
  assert.deepEqual(parseTrigger('post.express.js'), {
    raw: 'post.express.js',
    keyword: 'post',
    ecosystem: 'express',
    language: 'js',
  });
  assert.deepEqual(parseTrigger('>post.express.js'), {
    raw: '>post.express.js',
    keyword: 'post',
    ecosystem: 'express',
    language: 'js',
  });
  assert.equal(parseTrigger('map.js'), undefined);
});

test('parseTrigger rejects alias languages and invalid keywords', () => {
  assert.equal(parseTrigger('>map.javascript'), undefined);
  assert.equal(parseTrigger('>forEach.js'), undefined);
});

test('findTriggerAtCursor resolves a trigger under the cursor', () => {
  const text = 'const result = >map.react';
  const document = createTestDocument(text, 'javascriptreact');
  const match = findTriggerAtCursor(document as never, new vscode.Position(0, text.length));

  assert.ok(match);
  assert.equal(match.keyword, 'map');
  assert.equal(match.language, 'react');
  assert.equal(document.getText(match.range), '>map.react');
});

test('findTriggerAtCursor resolves a package-scoped id without a prefix', () => {
  const text = 'const route = post.express.js';
  const document = createTestDocument(text, 'javascript');
  const match = findTriggerAtCursor(document as never, new vscode.Position(0, text.length));

  assert.ok(match);
  assert.equal(match.keyword, 'post');
  assert.equal(match.ecosystem, 'express');
  assert.equal(match.language, 'js');
  assert.equal(document.getText(match.range), 'post.express.js');
});

test('getTriggerPrefixAtPosition returns a partial trigger prefix', () => {
  const text = 'const result = >map.';
  const document = createTestDocument(text, 'javascriptreact');
  const prefix = getTriggerPrefixAtPosition(document as never, new vscode.Position(0, text.length));

  assert.ok(prefix);
  assert.equal(prefix.raw, '>map.');
  assert.equal(document.getText(prefix.range), '>map.');
});
