import * as vscode from 'vscode';

import { resolveEntryFromTrigger } from '../core/registry';
import { insertEntrySnippet } from '../core/snippets';
import { findTriggerAtCursor } from '../core/triggers';

export async function expandAtCursor(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    void vscode.window.showInformationMessage('Open an editor, type a trigger such as >map.js, and then run Code Dictionary: Expand Trigger.');
    return;
  }

  const trigger = findTriggerAtCursor(editor.document, editor.selection.active);

  if (!trigger) {
    void vscode.window.showInformationMessage('No valid dictionary trigger was found at the cursor. Try >map.js or >post.express.js and run Code Dictionary: Expand Trigger again.');
    return;
  }

  const entry = resolveEntryFromTrigger(trigger);

  if (!entry) {
    void vscode.window.showWarningMessage(`No dictionary entry matches "${trigger.raw}".`);
    return;
  }

  await insertEntrySnippet(editor, trigger.range, entry);
}
