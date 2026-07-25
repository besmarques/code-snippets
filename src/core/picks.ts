import * as vscode from 'vscode';

import { getLanguageLabel } from './ecosystems';
import { formatEntryId, formatEntrySummary } from './registry';
import type { DictionaryEntry, TriggerLanguageKey } from '../types';

interface EntryQuickPickItem extends vscode.QuickPickItem {
  entry: DictionaryEntry;
}

interface LanguageQuickPickItem extends vscode.QuickPickItem {
  language: TriggerLanguageKey;
}

export async function pickEntry(
  entries: readonly DictionaryEntry[],
  placeHolder: string,
): Promise<DictionaryEntry | undefined> {
  const items: EntryQuickPickItem[] = entries.map((entry) => ({
    label: formatEntryId(entry),
    description: formatEntrySummary(entry),
    detail: entry.description,
    entry,
  }));

  const selection = await vscode.window.showQuickPick(items, {
    placeHolder,
    matchOnDescription: true,
    matchOnDetail: true,
  });

  return selection?.entry;
}

export async function pickTargetLanguage(
  entries: readonly DictionaryEntry[],
  placeHolder: string,
): Promise<TriggerLanguageKey | undefined> {
  const items: LanguageQuickPickItem[] = [];
  const seen = new Set<TriggerLanguageKey>();

  for (const entry of entries) {
    if (seen.has(entry.language)) {
      continue;
    }

    seen.add(entry.language);
    items.push({
      label: getLanguageLabel(entry.language),
      description: formatEntryId(entry),
      detail: entry.description,
      language: entry.language,
    });
  }

  const selection = await vscode.window.showQuickPick(items, {
    placeHolder,
    matchOnDescription: true,
    matchOnDetail: true,
  });

  return selection?.language;
}
