import * as vscode from 'vscode';

const CONTAINER_COMMAND = 'workbench.view.extension.codeDictionary';
const SIDEBAR_FOCUS_COMMAND = 'codeDictionary.sidebar.focus';

export async function openSidebar(): Promise<void> {
  let opened = false;

  try {
    await vscode.commands.executeCommand(CONTAINER_COMMAND);
    opened = true;
  } catch {}

  try {
    await vscode.commands.executeCommand(SIDEBAR_FOCUS_COMMAND);
    opened = true;
  } catch {}

  if (!opened) {
    void vscode.window.showWarningMessage(
      'Could not open the Code Dictionary sidebar. Run View: Reset View Locations in the Extension Development Host.',
    );
  }
}
