import * as vscode from 'vscode';

import { ALL_ENTRIES } from '../data';
import { getBuiltInEcosystemOptionsByLanguage } from '../core/builtInEcosystems';
import { getEcosystemLabel, getLanguageLabel } from '../core/ecosystems';
import { formatEntryId, formatEntryKey, formatEntrySummary } from '../core/registry';
import { deleteCustomEntry, getCustomEntries, saveCustomEntry } from '../core/settings';
import { TRIGGER_LANGUAGE_KEYS, type DictionaryEntry, type TriggerLanguageKey } from '../types';

const VIEW_ID = 'codeDictionary.customEntries';
const LANGUAGE_OPTIONS = TRIGGER_LANGUAGE_KEYS;
const BUILT_IN_ENTRY_KEYS = new Set(ALL_ENTRIES.map((entry) => formatEntryKey(entry)));

interface CustomEntryListItem {
  description: string;
  ecosystem: string;
  id: string;
  keyword: string;
  language: TriggerLanguageKey;
  overridesBuiltIn: boolean;
  snippet: string;
  summary: string;
  trigger: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toWebviewJson(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function getNonce(): string {
  return Math.random().toString(36).slice(2, 12);
}

function buildCustomEntryListItems(): CustomEntryListItem[] {
  return getCustomEntries()
    .map((entry) => {
      const id = formatEntryKey(entry);

      return {
        id,
        trigger: formatEntryId(entry),
        keyword: entry.keyword,
        language: entry.language,
        ecosystem: entry.ecosystem,
        description: entry.description,
        snippet: entry.snippet,
        summary: formatEntrySummary(entry),
        overridesBuiltIn: BUILT_IN_ENTRY_KEYS.has(id),
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

function buildEntryListMarkup(items: readonly CustomEntryListItem[]): string {
  if (!items.length) {
    return '<p class="empty-state">No custom entries yet. Add one above.</p>';
  }

  return [
    '<ul id="custom-entry-list" class="entry-list">',
    ...items.map((item) => {
      const overrideLabel = item.overridesBuiltIn ? 'Overrides built-in' : 'Custom';
      const badgeClassName = item.overridesBuiltIn ? 'badge warning' : 'badge muted';

      return [
        '<li>',
        '<div class="entry-header">',
        `<code>${escapeHtml(item.trigger)}</code>`,
        `<span class="${badgeClassName}">${escapeHtml(overrideLabel)}</span>`,
        '</div>',
        `<span class="entry-summary">${escapeHtml(item.summary)}</span>`,
        `<span>${escapeHtml(item.description)}</span>`,
        '<div class="entry-actions">',
        `<button type="button" class="secondary-button" data-action="edit" data-entry-id="${escapeHtml(item.id)}">Edit</button>`,
        `<button type="button" class="danger-button" data-action="delete" data-entry-id="${escapeHtml(item.id)}">Delete</button>`,
        '</div>',
        '</li>',
      ].join('');
    }),
    '</ul>',
  ].join('');
}

function getWebviewHtml(webview: vscode.Webview, statusMessage?: { kind: 'error' | 'success'; text: string }): string {
  const nonce = getNonce();
  const ecosystemsByLanguage = getBuiltInEcosystemOptionsByLanguage();
  const customEntries = buildCustomEntryListItems();
  const defaultLanguage = LANGUAGE_OPTIONS[0];
  const defaultPackage = getDefaultPackageId(defaultLanguage, ecosystemsByLanguage);
  const statusMarkup = statusMessage
    ? `<div class="status ${statusMessage.kind}">${escapeHtml(statusMessage.text)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Custom Entries</title>
  <style>
    :root {
      color-scheme: light dark;
    }

    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      margin: 0;
      padding: 16px;
    }

    .layout {
      display: grid;
      gap: 16px;
    }

    h2, h3 {
      margin: 0 0 8px;
      font-size: 13px;
      font-weight: 600;
    }

    p {
      margin: 0;
      line-height: 1.45;
    }

    form {
      display: grid;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 12px;
    }

    input, select, textarea, button {
      font: inherit;
    }

    input, select, textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--vscode-input-border, transparent);
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      padding: 8px 10px;
      border-radius: 6px;
    }

    textarea {
      min-height: 140px;
      resize: vertical;
    }

    button {
      border: 0;
      border-radius: 999px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      padding: 9px 14px;
      cursor: pointer;
    }

    button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .secondary-button {
      background: var(--vscode-button-secondaryBackground, var(--vscode-button-background));
      color: var(--vscode-button-secondaryForeground, var(--vscode-button-foreground));
    }

    .secondary-button:hover {
      background: var(--vscode-button-secondaryHoverBackground, var(--vscode-button-hoverBackground));
    }

    .danger-button {
      background: transparent;
      color: var(--vscode-errorForeground);
      border: 1px solid color-mix(in srgb, var(--vscode-errorForeground) 35%, transparent);
    }

    .danger-button:hover {
      background: color-mix(in srgb, var(--vscode-errorForeground) 12%, transparent);
    }

    .help {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }

    .field-group {
      display: grid;
      gap: 12px;
    }

    .field-group[hidden] {
      display: none;
    }

    .button-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .editing-state {
      min-height: 18px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }

    .status {
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
    }

    .status.success {
      background: color-mix(in srgb, var(--vscode-testing-iconPassed) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--vscode-testing-iconPassed) 35%, transparent);
    }

    .status.error {
      background: color-mix(in srgb, var(--vscode-errorForeground) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--vscode-errorForeground) 35%, transparent);
    }

    .entry-list {
      display: grid;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .entry-list li {
      display: grid;
      gap: 6px;
      padding: 10px 12px;
      border: 1px solid var(--vscode-sideBarSectionHeader-border, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--vscode-editor-background) 55%, transparent);
    }

    .entry-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .entry-summary {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }

    .entry-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .badge.warning {
      background: color-mix(in srgb, var(--vscode-editorWarning-foreground) 14%, transparent);
      color: var(--vscode-editorWarning-foreground);
    }

    .badge.muted {
      background: color-mix(in srgb, var(--vscode-descriptionForeground) 12%, transparent);
      color: var(--vscode-descriptionForeground);
    }

    code {
      font-family: var(--vscode-editor-font-family);
      font-size: 11px;
    }

    .empty-state {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }

    .preview {
      display: grid;
      gap: 6px;
      padding: 10px 12px;
      border: 1px solid var(--vscode-sideBarSectionHeader-border, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--vscode-editor-background) 55%, transparent);
    }
  </style>
</head>
<body>
  <div class="layout">
    <section>
      <h2>Custom Entries</h2>
      <p class="help">Add a core trigger like <code>&gt;map.js</code> or a package trigger like <code>post.express.js</code>. Entries save to workspace settings when a folder is open. Otherwise they save to your user settings.</p>
    </section>
    ${statusMarkup}
    <form id="custom-entry-form">
      <input id="previous-entry-id" name="previousEntryId" type="hidden" value="" />
      <label>
        Entry Type
        <select id="entry-type" name="entryType">
          <option value="core">Core snippet</option>
          <option value="package">Package snippet</option>
        </select>
      </label>
      <label>
        Keyword
        <input id="keyword" name="keyword" placeholder="slugify" pattern="^[a-z][a-z0-9]*$" required />
      </label>
      <label>
        Language
        <select id="language" name="language">
          ${LANGUAGE_OPTIONS.map((language) => `<option value="${language}">${language}</option>`).join('')}
        </select>
      </label>
      <div id="ecosystem-field" class="field-group" hidden>
        <label>
          Package
          <select id="ecosystem-select" name="ecosystemSelect">
            ${buildPackageOptionMarkup(defaultLanguage, ecosystemsByLanguage)}
          </select>
        </label>
        <input id="ecosystem" name="ecosystem" type="hidden" value="${escapeHtml(defaultPackage)}" />
      </div>
      <label>
        Description
        <input id="description" name="description" placeholder="Short description for this snippet." required />
      </label>
      <label>
        Snippet
        <textarea id="snippet" name="snippet" placeholder="const slug = input.toLowerCase();&#10;$0" required></textarea>
      </label>
      <div class="preview">
        <span class="help">Trigger Preview</span>
        <code id="entry-id-preview">&gt;slugify.js</code>
      </div>
      <div id="editing-state" class="editing-state"></div>
      <div class="button-row">
        <button id="submit-button" type="submit">Save Entry</button>
        <button id="cancel-edit" type="button" class="secondary-button" hidden>Cancel Edit</button>
        <button id="open-settings" type="button" class="secondary-button">Open Settings</button>
      </div>
      <p id="ecosystem-help" class="help">${buildPackageHelp(defaultLanguage, ecosystemsByLanguage)}</p>
      <p class="help">Package snippets can only target built-in package files that already exist for that language. Use <code>post</code> plus <code>express</code>, not <code>expresspost</code>. If a custom entry reuses a built-in trigger id, your custom version wins.</p>
    </form>
    <section>
      <h3>Saved Entries</h3>
      ${buildEntryListMarkup(customEntries)}
    </section>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const form = document.getElementById('custom-entry-form');
    const entryTypeInput = document.getElementById('entry-type');
    const keywordInput = document.getElementById('keyword');
    const languageInput = document.getElementById('language');
    const descriptionInput = document.getElementById('description');
    const snippetInput = document.getElementById('snippet');
    const previousEntryIdInput = document.getElementById('previous-entry-id');
    const ecosystemField = document.getElementById('ecosystem-field');
    const ecosystemSelect = document.getElementById('ecosystem-select');
    const ecosystemInput = document.getElementById('ecosystem');
    const ecosystemHelp = document.getElementById('ecosystem-help');
    const entryIdPreview = document.getElementById('entry-id-preview');
    const editingState = document.getElementById('editing-state');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit');
    const openSettingsButton = document.getElementById('open-settings');
    const entryList = document.getElementById('custom-entry-list');
    const ecosystemsByLanguage = ${toWebviewJson(ecosystemsByLanguage)};
    const customEntries = ${toWebviewJson(customEntries)};

    function getDefaultPackage(language) {
      const options = ecosystemsByLanguage[language] ?? [];
      return options.find((option) => option.id !== 'core')?.id ?? '';
    }

    function buildPackageHelpText(language) {
      const options = (ecosystemsByLanguage[language] ?? []).filter((option) => option.id !== 'core');

      if (!options.length) {
        return 'No package files exist for ' + language + ' yet. Use a core entry instead.';
      }

      return 'Built-in package ids for ' + language + ': ' + options.map((option) => option.id).join(', ');
    }

    function renderPackageOptions() {
      const language = String(languageInput.value || '${defaultLanguage}');
      const options = (ecosystemsByLanguage[language] ?? []).filter((option) => option.id !== 'core');

      ecosystemSelect.innerHTML = options
        .map((option) => '<option value="' + option.id + '">' + option.label + '</option>')
        .join('');

      ecosystemHelp.textContent = buildPackageHelpText(language);

      if (entryTypeInput.value !== 'package') {
        return;
      }

      const knownIds = new Set(options.map((option) => option.id));
      const currentPackage = String(ecosystemInput.value || '');
      const nextPackage = knownIds.has(currentPackage)
        ? currentPackage
        : (options[0]?.id ?? '');

      ecosystemSelect.value = nextPackage;
      ecosystemInput.value = nextPackage;
    }

    function renderEntryMode() {
      const isPackageEntry = entryTypeInput.value === 'package';
      ecosystemField.hidden = !isPackageEntry;
      ecosystemSelect.required = isPackageEntry;

      if (!isPackageEntry) {
        ecosystemInput.value = 'core';
        ecosystemHelp.textContent = 'Core snippets use >keyword.language.';
        return;
      }

      const defaultPackage = getDefaultPackage(String(languageInput.value || '${defaultLanguage}'));
      ecosystemInput.value = String(ecosystemSelect.value || defaultPackage);
      ecosystemHelp.textContent = buildPackageHelpText(String(languageInput.value || '${defaultLanguage}'));
    }

    function renderEntryIdPreview() {
      const keyword = String(keywordInput.value || 'slugify').trim() || 'slugify';
      const language = String(languageInput.value || '${defaultLanguage}');
      const isPackageEntry = entryTypeInput.value === 'package';
      const ecosystem = String(ecosystemInput.value || '').trim() || 'package';

      entryIdPreview.textContent = isPackageEntry
        ? keyword + '.' + ecosystem + '.' + language
        : '>' + keyword + '.' + language;
    }

    function resetFormState() {
      entryTypeInput.value = 'core';
      keywordInput.value = '';
      languageInput.value = '${defaultLanguage}';
      descriptionInput.value = '';
      snippetInput.value = '';
      previousEntryIdInput.value = '';
      ecosystemInput.value = 'core';
      editingState.textContent = '';
      submitButton.textContent = 'Save Entry';
      cancelEditButton.hidden = true;
      renderPackageOptions();
      renderEntryMode();
      renderEntryIdPreview();
    }

    function loadEntryForEditing(entryId) {
      const entry = customEntries.find((candidate) => candidate.id === entryId);

      if (!entry) {
        return;
      }

      entryTypeInput.value = entry.ecosystem === 'core' ? 'core' : 'package';
      keywordInput.value = entry.keyword;
      languageInput.value = entry.language;
      descriptionInput.value = entry.description;
      snippetInput.value = entry.snippet;
      previousEntryIdInput.value = entry.id;
      ecosystemInput.value = entry.ecosystem;
      renderPackageOptions();

      if (entry.ecosystem !== 'core') {
        ecosystemSelect.value = entry.ecosystem;
        ecosystemInput.value = entry.ecosystem;
      }

      renderEntryMode();
      renderEntryIdPreview();
      editingState.textContent = 'Editing ' + entry.trigger;
      submitButton.textContent = 'Update Entry';
      cancelEditButton.hidden = false;
      keywordInput.focus();
    }

    languageInput.addEventListener('change', () => {
      const language = String(languageInput.value || '${defaultLanguage}');
      const options = (ecosystemsByLanguage[language] ?? []).filter((option) => option.id !== 'core');
      const knownIds = new Set(options.map((option) => option.id));

      if (entryTypeInput.value === 'package' && !knownIds.has(String(ecosystemInput.value || ''))) {
        ecosystemInput.value = options[0]?.id ?? '';
      }

      renderPackageOptions();
      renderEntryMode();
      renderEntryIdPreview();
    });

    entryTypeInput.addEventListener('change', () => {
      renderPackageOptions();
      renderEntryMode();
      renderEntryIdPreview();
    });

    ecosystemSelect.addEventListener('change', () => {
      ecosystemInput.value = String(ecosystemSelect.value || '');
      renderEntryMode();
      renderEntryIdPreview();
    });

    keywordInput.addEventListener('input', renderEntryIdPreview);

    cancelEditButton.addEventListener('click', () => {
      resetFormState();
    });

    openSettingsButton.addEventListener('click', () => {
      vscode.postMessage({ type: 'openCustomEntrySettings' });
    });

    if (entryList) {
      entryList.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action][data-entry-id]');

        if (!button) {
          return;
        }

        const action = String(button.getAttribute('data-action') || '');
        const entryId = String(button.getAttribute('data-entry-id') || '');

        if (!entryId) {
          return;
        }

        if (action === 'edit') {
          loadEntryForEditing(entryId);
          return;
        }

        if (action === 'delete') {
          vscode.postMessage({
            type: 'deleteCustomEntry',
            value: {
              entryId,
            },
          });
        }
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const isPackageEntry = String(formData.get('entryType') ?? 'core') === 'package';

      vscode.postMessage({
        type: 'saveCustomEntry',
        value: {
          keyword: String(formData.get('keyword') ?? ''),
          language: String(formData.get('language') ?? ''),
          ecosystem: isPackageEntry
            ? String(formData.get('ecosystemSelect') ?? '')
            : 'core',
          description: String(formData.get('description') ?? ''),
          snippet: String(formData.get('snippet') ?? ''),
          previousEntryId: String(formData.get('previousEntryId') ?? ''),
        },
      });
    });

    resetFormState();
  </script>
</body>
</html>`;
}

function getDefaultPackageId(
  language: TriggerLanguageKey,
  ecosystemsByLanguage: Readonly<Record<TriggerLanguageKey, readonly { id: string; label: string }[]>>,
): string {
  return (ecosystemsByLanguage[language] ?? []).find((option) => option.id !== 'core')?.id ?? '';
}

function buildPackageHelp(
  language: TriggerLanguageKey,
  ecosystemsByLanguage: Readonly<Record<TriggerLanguageKey, readonly { id: string; label: string }[]>>,
): string {
  const options = (ecosystemsByLanguage[language] ?? []).filter((option) => option.id !== 'core');
  const label = getLanguageLabel(language);

  if (!options.length) {
    return `No package files exist for ${label} yet. Use a core entry instead.`;
  }

  return `Built-in package ids for ${label}: ${options.map((option) => option.id).join(', ')}`;
}

function buildPackageOptionMarkup(
  language: TriggerLanguageKey,
  ecosystemsByLanguage: Readonly<Record<TriggerLanguageKey, readonly { id: string; label: string }[]>>,
): string {
  return (ecosystemsByLanguage[language] ?? [])
    .filter((option) => option.id !== 'core')
    .map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</option>`)
    .join('');
}

async function openCustomEntrySettings(): Promise<'global' | 'workspace'> {
  if ((vscode.workspace.workspaceFolders?.length ?? 0) > 0) {
    await vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile');
    return 'workspace';
  }

  await vscode.commands.executeCommand('workbench.action.openSettingsJson');
  return 'global';
}

class CustomEntryFormProvider implements vscode.WebviewViewProvider {
  private view: vscode.WebviewView | undefined;

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    this.view = webviewView;
    webviewView.onDidDispose(() => {
      if (this.view === webviewView) {
        this.view = undefined;
      }
    });
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = getWebviewHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (!message || typeof message !== 'object') {
        return;
      }

      if (message.type === 'saveCustomEntry') {
        const result = await saveCustomEntry(message.value);

        if (!result) {
          const errorMessage = 'The custom entry is invalid. Use lowercase keywords, a supported language, and either core or an existing package for that language.';
          void vscode.window.showWarningMessage(errorMessage);
          this.refresh('error', errorMessage);
          return;
        }

        const infoMessage = `${result.mode === 'created' ? 'Added' : 'Updated'} ${formatEntryId(result.entry)} (${getEcosystemLabel(result.entry.ecosystem)}) in ${result.target} settings.`;
        void vscode.window.showInformationMessage(infoMessage);
        this.refresh('success', infoMessage);
        return;
      }

      if (message.type === 'deleteCustomEntry') {
        const entryId = (message as { value?: { entryId?: string } }).value?.entryId;
        const entry = getCustomEntries().find((candidate) => formatEntryKey(candidate) === String(entryId ?? ''));

        if (!entry) {
          const errorMessage = 'The custom entry could not be deleted because it no longer exists in settings.';
          void vscode.window.showWarningMessage(errorMessage);
          this.refresh('error', errorMessage);
          return;
        }

        const confirmed = await vscode.window.showWarningMessage(
          `Delete ${formatEntryId(entry)}?`,
          { modal: true },
          'Delete',
        );

        if (confirmed !== 'Delete') {
          return;
        }

        const result = await deleteCustomEntry(entryId);

        if (!result) {
          const errorMessage = 'The custom entry could not be deleted because it no longer exists in settings.';
          void vscode.window.showWarningMessage(errorMessage);
          this.refresh('error', errorMessage);
          return;
        }

        const infoMessage = `Deleted ${formatEntryId(result.entry)} from ${result.target} settings.`;
        void vscode.window.showInformationMessage(infoMessage);
        this.refresh('success', infoMessage);
        return;
      }

      if (message.type === 'openCustomEntrySettings') {
        const target = await openCustomEntrySettings();
        void vscode.window.showInformationMessage(`Opened ${target} settings JSON. Look for codeDictionary.customEntries if you want to edit entries directly.`);
      }
    });
  }

  private refresh(kind: 'error' | 'success', text: string): void {
    if (this.view) {
      this.view.webview.html = getWebviewHtml(this.view.webview, { kind, text });
    }
  }
}

export function registerCustomEntryFormProvider(context: vscode.ExtensionContext): void {
  const provider = new CustomEntryFormProvider();
  const registration = vscode.window.registerWebviewViewProvider(VIEW_ID, provider);

  context.subscriptions.push(registration);
}







