import { LANGUAGE_KEYS, TRIGGER_LANGUAGE_KEYS, type LanguageKey, type TriggerLanguageKey } from '../types';

const LANGUAGE_ALIASES: Readonly<Record<string, LanguageKey>> = {
  javascript: 'js',
  js: 'js',
  jsx: 'react',
  php: 'php',
  react: 'react',
  ts: 'ts',
  tsx: 'tsx',
  typescript: 'ts',
  java: 'java',
};

function dedupeLanguages(values: readonly LanguageKey[]): LanguageKey[] {
  const seen = new Set<LanguageKey>();
  const result: LanguageKey[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}

export function normalizeLanguage(value: string | undefined): LanguageKey | undefined {
  if (!value) {
    return undefined;
  }

  return LANGUAGE_ALIASES[value.trim().toLowerCase()];
}

export function normalizeTriggerLanguage(value: string | undefined): TriggerLanguageKey | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  return TRIGGER_LANGUAGE_KEYS.find((language) => language === normalized);
}

export function inferPreferredLanguages(languageId: string | undefined): LanguageKey[] {
  const normalizedId = languageId?.toLowerCase();

  let inferred: LanguageKey[];

  switch (normalizedId) {
    case 'javascript':
      inferred = ['js', 'ts'];
      break;
    case 'javascriptreact':
      inferred = ['react', 'js', 'tsx', 'ts'];
      break;
    case 'typescript':
      inferred = ['ts', 'js'];
      break;
    case 'typescriptreact':
      inferred = ['tsx', 'react', 'ts', 'js'];
      break;
    case 'php':
      inferred = ['php', 'js'];
      break;
    case 'java':
      inferred = ['java', 'js'];
      break;
    default: {
      const normalizedLanguage = normalizeLanguage(languageId);
      inferred = normalizedLanguage ? [normalizedLanguage] : [];
      break;
    }
  }

  return dedupeLanguages([...inferred, ...LANGUAGE_KEYS]);
}
