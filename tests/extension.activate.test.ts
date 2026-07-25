import assert from 'node:assert/strict';
import { test } from 'node:test';

import { activate } from '../src/extension';
import {
  __getCompletionProviders,
  __getRegisteredCommands,
  __getRegisteredTreeViews,
  __getRegisteredWebviewViews,
  __reset,
} from './support/vscode';

test('activate registers commands, the explorer tree view, the custom entry view, and completions', () => {
  __reset();

  const context = {
    subscriptions: [],
  };

  activate(context as never);

  assert.deepEqual(__getRegisteredTreeViews().map((view) => view.viewId), [
    'codeDictionary.sidebar',
  ]);
  assert.deepEqual(__getRegisteredWebviewViews().map((view) => view.viewId), [
    'codeDictionary.customEntries',
  ]);
  assert.equal(__getCompletionProviders().length, 1);
  assert.deepEqual(__getRegisteredCommands(), [
    'codeDictionary.copyEntryTrigger',
    'codeDictionary.expandAtCursor',
    'codeDictionary.insertEntryFromSidebar',
    'codeDictionary.openSidebar',
    'codeDictionary.pickAndInsert',
    'codeDictionary.searchCatalog',
    'codeDictionary.searchCatalogAndCopyTrigger',
    'codeDictionary.showAvailableEntries',
    'codeDictionary.translateSelection',
  ]);
  assert.equal(context.subscriptions.length, 14);
});

