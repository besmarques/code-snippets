import * as vscode from 'vscode';

import { expandAtCursor } from './commands/expandAtCursor';
import { pickAndInsert } from './commands/pickAndInsert';
import { showAvailableEntries } from './commands/showAvailableEntries';
import { translateSelection } from './commands/translateSelection';
import { registerCompletionProvider } from './providers/completionProvider';
import { registerCustomEntryFormProvider } from './providers/customEntryFormProvider';
import { registerSidebarProvider } from './providers/sidebarProvider';

function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  callback: () => Promise<void>,
): void {
  context.subscriptions.push(vscode.commands.registerCommand(command, callback));
}

export function activate(context: vscode.ExtensionContext): void {
  registerCommand(context, 'codeDictionary.expandAtCursor', expandAtCursor);
  registerCommand(context, 'codeDictionary.translateSelection', translateSelection);
  registerCommand(context, 'codeDictionary.pickAndInsert', pickAndInsert);
  registerCommand(context, 'codeDictionary.showAvailableEntries', showAvailableEntries);
  registerCompletionProvider(context);
  registerSidebarProvider(context);
  registerCustomEntryFormProvider(context);
}

export function deactivate(): void {}
