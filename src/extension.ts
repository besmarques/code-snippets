import * as vscode from 'vscode';

import { expandAtCursor } from './commands/expandAtCursor';
import { openSidebar } from './commands/openSidebar';
import { pickAndInsert } from './commands/pickAndInsert';
import { searchCatalog, searchCatalogAndCopyTrigger } from './commands/searchCatalog';
import { showAvailableEntries } from './commands/showAvailableEntries';
import { showExpansionGuide } from './commands/showExpansionGuide';
import { copyEntryTrigger, insertEntryFromSidebar } from './commands/sidebarEntryActions';
import { translateSelection } from './commands/translateSelection';
import { registerCompletionProvider } from './providers/completionProvider';
import { registerCustomEntryFormProvider } from './providers/customEntryFormProvider';
import { registerSidebarProvider } from './providers/sidebarProvider';

function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  callback: (...args: unknown[]) => Promise<void> | void,
): void {
  context.subscriptions.push(vscode.commands.registerCommand(command, (...args) => callback(...args)));
}

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('Code Dictionary');
  context.subscriptions.push(outputChannel);
  outputChannel.appendLine('[code-dictionary] activating');

  try {
    registerCommand(context, 'codeDictionary.openSidebar', openSidebar);
    registerCommand(context, 'codeDictionary.expandAtCursor', expandAtCursor);
    registerCommand(context, 'codeDictionary.translateSelection', translateSelection);
    registerCommand(context, 'codeDictionary.pickAndInsert', pickAndInsert);
    registerCommand(context, 'codeDictionary.searchCatalog', searchCatalog);
    registerCommand(context, 'codeDictionary.searchCatalogAndCopyTrigger', searchCatalogAndCopyTrigger);
    registerCommand(context, 'codeDictionary.insertEntryFromSidebar', insertEntryFromSidebar);
    registerCommand(context, 'codeDictionary.copyEntryTrigger', copyEntryTrigger);
    registerCommand(context, 'codeDictionary.showAvailableEntries', showAvailableEntries);
    registerCommand(context, 'codeDictionary.showExpansionGuide', showExpansionGuide);
    registerCompletionProvider(context);
    registerSidebarProvider(context);
    registerCustomEntryFormProvider(context);
    outputChannel.appendLine('[code-dictionary] activated');
  } catch (error) {
    outputChannel.appendLine(`[code-dictionary] activation failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
    throw error;
  }
}

export function deactivate(): void {}
