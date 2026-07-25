import * as vscode from 'vscode';

import { pickEntry } from '../core/picks';
import { formatEntryTrigger, listEntries, sortEntriesForContext } from '../core/registry';
import { insertEntrySnippet } from '../core/snippets';

function getSortedCatalogEntries(languageId: string | undefined) {
  return sortEntriesForContext(listEntries(), languageId);
}

export async function searchCatalog(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    void vscode.window.showInformationMessage('Open an editor before inserting a dictionary entry.');
    return;
  }

  const entry = await pickEntry(
    getSortedCatalogEntries(editor.document.languageId),
    'Search the catalog and choose an entry to insert.',
  );

  if (!entry) {
    return;
  }

  await insertEntrySnippet(editor, editor.selection, entry);
}

export async function searchCatalogAndCopyTrigger(): Promise<void> {
  const entry = await pickEntry(
    getSortedCatalogEntries(vscode.window.activeTextEditor?.document.languageId),
    'Search the catalog and choose a trigger to copy.',
  );

  if (!entry) {
    return;
  }

  const trigger = formatEntryTrigger(entry);
  await vscode.env.clipboard.writeText(trigger);
  void vscode.window.showInformationMessage(`Copied ${trigger} to the clipboard.`);
}
