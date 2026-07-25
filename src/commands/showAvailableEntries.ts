import * as vscode from 'vscode';

import { buildEntriesMarkdown, listEntries } from '../core/registry';

export async function showAvailableEntries(): Promise<void> {
  const document = await vscode.workspace.openTextDocument({
    content: buildEntriesMarkdown(listEntries()),
    language: 'markdown',
  });

  await vscode.window.showTextDocument(document, {
    preview: false,
  });
}
