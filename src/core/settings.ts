import * as vscode from 'vscode';

import { isBuiltInEcosystemForLanguage } from './builtInEcosystems';
import { DEFAULT_ECOSYSTEM, getEntryEcosystem, normalizeEcosystem } from './ecosystems';
import { formatEntryKey } from './entries/format';
import { TRIGGER_LANGUAGE_KEYS, type DictionaryEntry, type TriggerLanguageKey } from '../types';

const CONFIG_NAMESPACE = 'codeDictionary';
const KEYWORD_PATTERN = /^[a-z][a-z0-9]*$/;

export function areCompletionsEnabled(): boolean {
  return vscode.workspace
    .getConfiguration(CONFIG_NAMESPACE)
    .get<boolean>('enableCompletions', true);
}

function getConfiguration() {
  return vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
}

export interface CustomEntryDraft {
  description: string;
  ecosystem: string;
  keyword: string;
  language: TriggerLanguageKey;
  snippet: string;
}

export interface SaveCustomEntryResult {
  entry: DictionaryEntry;
  mode: 'created' | 'updated';
  target: 'global' | 'workspace';
}

function isTriggerLanguage(value: unknown): value is TriggerLanguageKey {
  return typeof value === 'string' && TRIGGER_LANGUAGE_KEYS.includes(value as TriggerLanguageKey);
}

function normalizeKeyword(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return KEYWORD_PATTERN.test(normalized) ? normalized : undefined;
}

function normalizeEntryId(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim().replace(/^>/, '');
  const parts = trimmed.split('.');

  if (parts.length !== 2 && parts.length !== 3) {
    return undefined;
  }

  const keyword = normalizeKeyword(parts[0]);

  if (!keyword) {
    return undefined;
  }

  if (parts.length === 2) {
    const language = parts[1]?.trim();

    if (!isTriggerLanguage(language)) {
      return undefined;
    }

    return formatEntryKey({
      keyword,
      ecosystem: DEFAULT_ECOSYSTEM,
      language,
    });
  }

  const ecosystem = normalizeEcosystem(parts[1]);
  const language = parts[2]?.trim();

  if (!ecosystem || !isTriggerLanguage(language)) {
    return undefined;
  }

  return formatEntryKey({
    keyword,
    ecosystem,
    language,
  });
}

function parseCustomEntryCandidate(value: unknown): DictionaryEntry | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const candidate = value as Record<string, unknown>;
  const keyword = normalizeKeyword(candidate.keyword);
  const language = candidate.language;
  const ecosystem = candidate.ecosystem === undefined
    ? DEFAULT_ECOSYSTEM
    : normalizeEcosystem(candidate.ecosystem);
  const description = typeof candidate.description === 'string'
    ? candidate.description.trim()
    : undefined;
  const snippet = typeof candidate.snippet === 'string'
    ? candidate.snippet
    : undefined;

  if (!keyword || !isTriggerLanguage(language) || !ecosystem || !description || !snippet) {
    return undefined;
  }

  if (!isBuiltInEcosystemForLanguage(language, ecosystem)) {
    return undefined;
  }

  return {
    keyword,
    ecosystem,
    language,
    description,
    detail: 'Custom entry.',
    snippet,
  };
}

function serializeCustomEntry(entry: DictionaryEntry): CustomEntryDraft {
  return {
    keyword: entry.keyword,
    ecosystem: getEntryEcosystem(entry.ecosystem),
    language: entry.language,
    description: entry.description,
    snippet: entry.snippet,
  };
}

function getConfigurationTarget(): {
  label: 'global' | 'workspace';
  value: vscode.ConfigurationTarget;
} {
  if ((vscode.workspace.workspaceFolders?.length ?? 0) > 0) {
    return {
      label: 'workspace',
      value: vscode.ConfigurationTarget.Workspace,
    };
  }

  return {
    label: 'global',
    value: vscode.ConfigurationTarget.Global,
  };
}

export function getDisabledEntryIds(): Set<string> {
  const configured = getConfiguration().get<unknown[]>('disabledEntries', []);
  const result = new Set<string>();

  if (!Array.isArray(configured)) {
    return result;
  }

  for (const value of configured) {
    const normalized = normalizeEntryId(value);

    if (normalized) {
      result.add(normalized);
    }
  }

  return result;
}

export function getCustomEntries(): DictionaryEntry[] {
  const configured = getConfiguration().get<unknown[]>('customEntries', []);
  const entries = new Map<string, DictionaryEntry>();

  if (!Array.isArray(configured)) {
    return [];
  }

  for (const value of configured) {
    const entry = parseCustomEntryCandidate(value);

    if (!entry) {
      continue;
    }

    entries.set(formatEntryKey(entry), entry);
  }

  return [...entries.values()];
}

export async function saveCustomEntry(value: unknown): Promise<SaveCustomEntryResult | undefined> {
  const entry = parseCustomEntryCandidate(value);

  if (!entry) {
    return undefined;
  }

  const currentEntries = getCustomEntries();
  const entryId = formatEntryKey(entry);
  const existingEntryIndex = currentEntries.findIndex((candidate) => formatEntryKey(candidate) === entryId);
  const nextEntries = [...currentEntries];

  if (existingEntryIndex >= 0) {
    nextEntries[existingEntryIndex] = entry;
  } else {
    nextEntries.push(entry);
  }

  const target = getConfigurationTarget();

  await getConfiguration().update(
    'customEntries',
    nextEntries.map(serializeCustomEntry),
    target.value,
  );

  return {
    entry,
    mode: existingEntryIndex >= 0 ? 'updated' : 'created',
    target: target.label,
  };
}
