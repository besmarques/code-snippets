import * as vscode from 'vscode';

import { formatEntryTrigger } from '../core/registry';
import { insertEntrySnippet } from '../core/snippets';
import type { DictionaryEntry } from '../types';

function isDictionaryEntry(value: unknown): value is DictionaryEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<DictionaryEntry>;

  return typeof candidate.keyword === 'string'
    && typeof candidate.ecosystem === 'string'
    && typeof candidate.language === 'string'
    && typeof candidate.description === 'string'
    && typeof candidate.snippet === 'string';
}

function resolveEntry(value: unknown): DictionaryEntry | undefined {
  if (isDictionaryEntry(value)) {
    return value;
  }

  if (!value || typeof value !== 'object' || !('entry' in value)) {
    return undefined;
  }

  return isDictionaryEntry((value as { entry?: unknown }).entry)
    ? (value as { entry: DictionaryEntry }).entry
    : undefined;
}

export async function insertEntryFromSidebar(value: unknown): Promise<void> {
  const entry = resolveEntry(value);

  if (!entry) {
    void vscode.window.showWarningMessage('The selected sidebar item is not a dictionary entry.');
    return;
  }

  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    void vscode.window.showInformationMessage('Open an editor before inserting a dictionary entry.');
    return;
  }

  await insertEntrySnippet(editor, editor.selection, entry);
}

export async function copyEntryTrigger(value: unknown): Promise<void> {
  const entry = resolveEntry(value);

  if (!entry) {
    void vscode.window.showWarningMessage('The selected sidebar item is not a dictionary entry.');
    return;
  }

  const trigger = formatEntryTrigger(entry);
  await vscode.env.clipboard.writeText(trigger);
  void vscode.window.showInformationMessage(`Copied ${trigger} to the clipboard.`);
}
