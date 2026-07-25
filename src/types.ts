export const LANGUAGE_KEYS = ['js', 'ts', 'react', 'tsx', 'java', 'php'] as const;
export const TRIGGER_LANGUAGE_KEYS = ['js', 'ts', 'react', 'java', 'php'] as const;

export type LanguageKey = (typeof LANGUAGE_KEYS)[number];
export type TriggerLanguageKey = (typeof TRIGGER_LANGUAGE_KEYS)[number];

export interface LanguageCommandDefinition {
  keyword: string;
  description: string;
  ecosystem?: string;
  snippet: string;
}

export interface LanguageCatalog {
  language: TriggerLanguageKey;
  commands: readonly LanguageCommandDefinition[];
}

export interface DictionaryEntry {
  keyword: string;
  ecosystem: string;
  language: TriggerLanguageKey;
  description: string;
  detail?: string;
  languages?: string[];
  snippet: string;
}

export interface ParsedTrigger {
  raw: string;
  ecosystem?: string;
  keyword: string;
  language: TriggerLanguageKey;
}
