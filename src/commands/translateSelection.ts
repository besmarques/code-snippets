import * as vscode from 'vscode';

import { DEFAULT_ECOSYSTEM } from '../core/ecosystems';
import { pickEntry, pickTargetLanguage } from '../core/picks';
import {
  getEntriesForKeyword,
  sortEntriesForContext,
} from '../core/registry';
import { insertEntrySnippet } from '../core/snippets';
import { resolveSelectionTranslationIntent } from '../core/translation';

function formatExplicitSelection(
  keyword: string,
  language: string,
  ecosystem: string,
): string {
  return ecosystem === DEFAULT_ECOSYSTEM
    ? `>${keyword}.${language}`
    : `${keyword}.${ecosystem}.${language}`;
}

export async function translateSelection(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    void vscode.window.showInformationMessage('Open an editor before translating a selection.');
    return;
  }

  const selection = editor.selection;

  if (selection.isEmpty) {
    void vscode.window.showInformationMessage(
      'Select a trigger, keyword, or supported code pattern before translating.',
    );
    return;
  }

  const selectedText = editor.document.getText(selection).trim();

  if (!selectedText) {
    void vscode.window.showInformationMessage('The current selection is empty.');
    return;
  }

  const intent = resolveSelectionTranslationIntent(selectedText);

  if (!intent) {
    void vscode.window.showWarningMessage(
      'The selection does not match a known keyword or supported code pattern yet.',
    );
    return;
  }

  const entries = sortEntriesForContext(
    getEntriesForKeyword(intent.keyword),
    editor.document.languageId,
  );

  if (!entries.length) {
    const targetLabel = intent.explicitLanguage
      ? formatExplicitSelection(
          intent.keyword,
          intent.explicitLanguage,
          intent.explicitEcosystem ?? DEFAULT_ECOSYSTEM,
        )
      : intent.keyword;
    void vscode.window.showWarningMessage(`No dictionary entry matches "${targetLabel}".`);
    return;
  }

  if (intent.explicitLanguage) {
    const explicitEcosystem = intent.explicitEcosystem ?? DEFAULT_ECOSYSTEM;
    const explicitLabel = formatExplicitSelection(
      intent.keyword,
      intent.explicitLanguage,
      explicitEcosystem,
    );
    const entry = entries.find((candidate) =>
      candidate.language === intent.explicitLanguage
      && candidate.ecosystem === explicitEcosystem
    );

    if (!entry) {
      void vscode.window.showWarningMessage(`No dictionary entry matches "${explicitLabel}".`);
      return;
    }

    await insertEntrySnippet(editor, selection, entry);
    return;
  }

  const distinctLanguages = new Set(entries.map((entry) => entry.language));
  let filteredEntries = entries;

  if (distinctLanguages.size > 1) {
    const targetLanguage = await pickTargetLanguage(
      entries,
      `Choose a target language for "${intent.keyword}".`,
    );

    if (!targetLanguage) {
      return;
    }

    filteredEntries = entries.filter((entry) => entry.language === targetLanguage);
  }

  const entry = filteredEntries.length === 1
    ? filteredEntries[0]
    : await pickEntry(
        filteredEntries,
        `Choose a translation for "${intent.keyword}".`,
      );

  if (!entry) {
    return;
  }

  await insertEntrySnippet(editor, selection, entry);
}
