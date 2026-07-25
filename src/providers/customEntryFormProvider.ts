import * as vscode from 'vscode';

import { getBuiltInEcosystemOptionsByLanguage } from '../core/builtInEcosystems';
import { getEcosystemLabel, getLanguageLabel } from '../core/ecosystems';
import { formatEntryId, formatEntrySummary } from '../core/registry';
import { getCustomEntries, saveCustomEntry } from '../core/settings';
import { TRIGGER_LANGUAGE_KEYS, type TriggerLanguageKey } from '../types';

const VIEW_ID = 'codeDictionary.customEntryForm';
const LANGUAGE_OPTIONS = TRIGGER_LANGUAGE_KEYS;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getNonce(): string {
  return Math.random().toString(36).slice(2, 12);
}

function buildEntryListMarkup(): string {
  const entries = getCustomEntries();

  if (!entries.length) {
    return '<p class="empty-state">No custom entries yet.</p>';
  }

  return [
    '<ul class="entry-list">',
    ...entries.map((entry) => (
      `<li><code>${escapeHtml(formatEntryId(entry))}</code><span>${escapeHtml(formatEntrySummary(entry))}</span><span>${escapeHtml(entry.description)}</span></li>`
    )),
    '</ul>',
  ].join('');
}

function getWebviewHtml(webview: vscode.Webview, statusMessage?: { kind: 'error' | 'success'; text: string }): string {
  const nonce = getNonce();
  const ecosystemsByLanguage = getBuiltInEcosystemOptionsByLanguage();
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
  <title>Add Custom Entry</title>
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
      justify-self: start;
    }

    button:hover {
      background: var(--vscode-button-hoverBackground);
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
      gap: 4px;
      padding: 10px 12px;
      border: 1px solid var(--vscode-sideBarSectionHeader-border, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--vscode-editor-background) 55%, transparent);
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
      <h2>Add Custom Entry</h2>
      <p class="help">Create either a core entry like <code>&gt;map.js</code> or a package entry like <code>post.express.js</code>. It saves to workspace settings when a workspace is open. Otherwise it saves to your user settings.</p>
    </section>
    ${statusMarkup}
    <form id="custom-entry-form">
      <label>
        Entry Type
        <select id="entry-type" name="entryType">
          <option value="core">Core entry</option>
          <option value="package">Package entry</option>
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
        <input id="description" name="description" placeholder="Convert text into a URL slug." required />
      </label>
      <label>
        Snippet
        <textarea id="snippet" name="snippet" placeholder="const slug = input.toLowerCase();&#10;$0" required></textarea>
      </label>
      <div class="preview">
        <span class="help">Generated Id</span>
        <code id="entry-id-preview">&gt;slugify.js</code>
      </div>
      <button type="submit">Save Custom Entry</button>
      <p id="ecosystem-help" class="help">${buildPackageHelp(defaultLanguage, ecosystemsByLanguage)}</p>
      <p class="help">Package entries only target package files that already exist in the built-in catalog. Use <code>post</code> plus <code>express</code>, not <code>expresspost</code>. If a custom entry uses the same trigger id as a built-in one, the custom entry overrides it.</p>
    </form>
    <section>
      <h3>Current Custom Entries</h3>
      ${buildEntryListMarkup()}
    </section>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const form = document.getElementById('custom-entry-form');
    const entryTypeInput = document.getElementById('entry-type');
    const keywordInput = document.getElementById('keyword');
    const languageInput = document.getElementById('language');
    const ecosystemField = document.getElementById('ecosystem-field');
    const ecosystemSelect = document.getElementById('ecosystem-select');
    const ecosystemInput = document.getElementById('ecosystem');
    const ecosystemHelp = document.getElementById('ecosystem-help');
    const entryIdPreview = document.getElementById('entry-id-preview');
    const ecosystemsByLanguage = ${JSON.stringify(ecosystemsByLanguage)};

    function getDefaultPackage(language) {
      const options = ecosystemsByLanguage[language] ?? [];
      return options.find((option) => option.id !== 'core')?.id ?? '';
    }

    function renderPackageOptions() {
      const language = String(languageInput.value || '${defaultLanguage}');
      const options = (ecosystemsByLanguage[language] ?? []).filter((option) => option.id !== 'core');

      ecosystemSelect.innerHTML = options
        .map((option) => \`<option value="\${option.id}">\${option.label}</option>\`)
        .join('');

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

      ecosystemHelp.textContent = options.length
        ? 'Common package ids for ' + language + ': ' + options.map((option) => option.id).join(', ')
        : 'No package files exist for ' + language + ' yet. Use a core entry instead.';
    }

    function renderEntryMode() {
      const isPackageEntry = entryTypeInput.value === 'package';
      ecosystemField.hidden = !isPackageEntry;
      ecosystemSelect.required = isPackageEntry;

      if (!isPackageEntry) {
        ecosystemInput.value = 'core';
        return;
      }

      const defaultPackage = getDefaultPackage(String(languageInput.value || '${defaultLanguage}'));
      ecosystemInput.value = String(ecosystemSelect.value || defaultPackage);
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

    renderPackageOptions();
    renderEntryMode();
    renderEntryIdPreview();

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
        },
      });
    });
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

  return `Common package ids for ${label}: ${options.map((option) => option.id).join(', ')}`;
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

class CustomEntryFormProvider implements vscode.WebviewViewProvider {
  private view: vscode.WebviewView | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = getWebviewHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (!message || typeof message !== 'object' || message.type !== 'saveCustomEntry') {
        return;
      }

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
    });
  }

  private refresh(kind: 'error' | 'success', text: string): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = getWebviewHtml(this.view.webview, { kind, text });
  }
}

export function registerCustomEntryFormProvider(context: vscode.ExtensionContext): void {
  const provider = new CustomEntryFormProvider(context);
  const registration = vscode.window.registerWebviewViewProvider(VIEW_ID, provider);

  context.subscriptions.push(registration);
}
