import * as vscode from 'vscode';

import type { DictionaryEntry } from '../types';

export async function insertEntrySnippet(
  editor: vscode.TextEditor,
  range: vscode.Range,
  entry: DictionaryEntry,
): Promise<boolean> {
  return editor.insertSnippet(new vscode.SnippetString(entry.snippet), range);
}
