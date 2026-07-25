import * as vscode from 'vscode';

import {
  buildCompletionDetail,
  buildCompletionDocumentation,
  formatEntryId,
  formatEntryTrigger,
  searchEntriesByPrefix,
} from '../core/registry';
import { areCompletionsEnabled } from '../core/settings';
import { getTriggerPrefixAtPosition } from '../core/triggers';
import type { DictionaryEntry } from '../types';

function buildCompletionItem(
  entry: DictionaryEntry,
  range: vscode.Range,
  index: number,
): vscode.CompletionItem {
  const item = new vscode.CompletionItem(
    formatEntryId(entry),
    vscode.CompletionItemKind.Snippet,
  );

  item.detail = buildCompletionDetail(entry);
  item.documentation = new vscode.MarkdownString(buildCompletionDocumentation(entry));
  item.filterText = formatEntryTrigger(entry);
  item.insertText = new vscode.SnippetString(entry.snippet);
  item.range = range;
  item.sortText = String(index).padStart(4, '0');

  return item;
}

export function registerCompletionProvider(
  context: vscode.ExtensionContext,
): void {
  const provider = vscode.languages.registerCompletionItemProvider(
    [{ pattern: '**/*' }, { scheme: 'untitled' }],
    {
      provideCompletionItems(document, position) {
        if (!areCompletionsEnabled()) {
          return undefined;
        }

        const prefix = getTriggerPrefixAtPosition(document, position);

        if (!prefix) {
          return undefined;
        }

        const entries = searchEntriesByPrefix(
          prefix.raw,
          document.languageId,
        );

        if (!entries.length) {
          return undefined;
        }

        return entries.map((entry, index) => buildCompletionItem(entry, prefix.range, index));
      },
    },
    '>',
  );

  context.subscriptions.push(provider);
}
