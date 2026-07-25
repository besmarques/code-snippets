import * as vscode from 'vscode';

import { pickEntry } from '../core/picks';
import { listEntries, sortEntriesForContext } from '../core/registry';
import { insertEntrySnippet } from '../core/snippets';

export async function pickAndInsert(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    void vscode.window.showInformationMessage('Open an editor before inserting a dictionary entry.');
    return;
  }

  const entries = sortEntriesForContext(listEntries(), editor.document.languageId);
  const entry = await pickEntry(entries, 'Choose a dictionary entry to insert.');

  if (!entry) {
    return;
  }

  await insertEntrySnippet(editor, editor.selection, entry);
}
