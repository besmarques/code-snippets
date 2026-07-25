import { DEFAULT_ECOSYSTEM, normalizeEcosystem } from './ecosystems';
import { normalizeTriggerLanguage } from './languages';
import { inferKeywordFromSelection } from './inferKeyword';
import { parseTrigger } from './triggers';
import type { TriggerLanguageKey } from '../types';

const KEYWORD_PATTERN = /^[a-z][a-z0-9]*$/;

export interface SelectionTranslationIntent {
  explicitEcosystem?: string;
  explicitLanguage?: TriggerLanguageKey;
  keyword: string;
}

function parseLooseTrigger(value: string): SelectionTranslationIntent | undefined {
  const trimmed = value.trim();
  const parts = trimmed.split('.');

  if (parts.length !== 2 && parts.length !== 3) {
    return undefined;
  }

  const keyword = parts[0]?.trim();

  if (!keyword || !KEYWORD_PATTERN.test(keyword)) {
    return undefined;
  }

  if (parts.length === 2) {
    const language = normalizeTriggerLanguage(parts[1]);

    if (!language) {
      return undefined;
    }

    return {
      explicitEcosystem: DEFAULT_ECOSYSTEM,
      explicitLanguage: language,
      keyword,
    };
  }

  const ecosystem = normalizeEcosystem(parts[1]);
  const language = normalizeTriggerLanguage(parts[2]);

  if (!ecosystem || !language) {
    return undefined;
  }

  return {
    explicitEcosystem: ecosystem,
    explicitLanguage: language,
    keyword,
  };
}

function parseKeywordOnly(value: string): SelectionTranslationIntent | undefined {
  const trimmed = value.trim();

  if (!KEYWORD_PATTERN.test(trimmed)) {
    return undefined;
  }

  return {
    keyword: trimmed,
  };
}

export function resolveSelectionTranslationIntent(
  value: string,
): SelectionTranslationIntent | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsedTrigger = parseTrigger(trimmed);

  if (parsedTrigger) {
    return {
      explicitEcosystem: parsedTrigger.ecosystem ?? DEFAULT_ECOSYSTEM,
      explicitLanguage: parsedTrigger.language,
      keyword: parsedTrigger.keyword,
    };
  }

  if (trimmed.startsWith('>')) {
    const triggerBody = trimmed.slice(1);
    return parseLooseTrigger(triggerBody) ?? parseKeywordOnly(triggerBody);
  }

  return parseLooseTrigger(trimmed)
    ?? parseKeywordOnly(trimmed)
    ?? (() => {
      const keyword = inferKeywordFromSelection(trimmed);

      return keyword
        ? { keyword }
        : undefined;
    })();
}
