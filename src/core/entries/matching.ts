import { DEFAULT_ECOSYSTEM } from '../ecosystems';
import { inferPreferredLanguages } from '../languages';
import type { DictionaryEntry, ParsedTrigger } from '../../types';

import { getEntriesForKeyword, listEntries } from './catalog';
import { formatEntryKey } from './format';

function compareEntries(left: DictionaryEntry, right: DictionaryEntry): number {
  return formatEntryKey(left).localeCompare(formatEntryKey(right));
}

interface SearchQuery {
  ecosystemPrefix: string;
  keywordPrefix: string;
  languageOnly: boolean;
  languagePrefix: string;
  secondaryPrefix: string;
  segmentCount: 1 | 2 | 3;
}

function buildSearchQuery(rawToken: string): SearchQuery | undefined {
  const token = rawToken.trim().toLowerCase();

  if (!token.startsWith('>')) {
    return undefined;
  }

  const parts = token.slice(1).split('.');

  if (parts.length > 3) {
    return undefined;
  }

  if (parts.length === 1) {
    return {
      ecosystemPrefix: '',
      keywordPrefix: parts[0] ?? '',
      languageOnly: false,
      languagePrefix: '',
      secondaryPrefix: '',
      segmentCount: 1,
    };
  }

  if (parts.length === 2) {
    return {
      ecosystemPrefix: '',
      keywordPrefix: parts[0] ?? '',
      languageOnly: (parts[0] ?? '') === '',
      languagePrefix: '',
      secondaryPrefix: parts[1] ?? '',
      segmentCount: 2,
    };
  }

  return {
    ecosystemPrefix: parts[1] ?? '',
    keywordPrefix: parts[0] ?? '',
    languageOnly: false,
    languagePrefix: parts[2] ?? '',
    secondaryPrefix: '',
    segmentCount: 3,
  };
}

function getSecondaryMatchRank(entry: DictionaryEntry, prefix: string): number {
  if (!prefix) {
    return 0;
  }

  if (entry.ecosystem !== DEFAULT_ECOSYSTEM && entry.ecosystem === prefix) {
    return 0;
  }

  if (entry.language === prefix) {
    return 1;
  }

  if (entry.ecosystem !== DEFAULT_ECOSYSTEM && entry.ecosystem.startsWith(prefix)) {
    return 2;
  }

  if (entry.language.startsWith(prefix)) {
    return 3;
  }

  return 4;
}

function buildEntryComparator(query: SearchQuery, languageId: string | undefined) {
  const languageOrder = inferPreferredLanguages(languageId);
  const ranking = new Map(
    languageOrder.map((language, index) => [language, index]),
  );

  return (left: DictionaryEntry, right: DictionaryEntry): number => {
    if (query.keywordPrefix) {
      const leftKeywordExact = left.keyword === query.keywordPrefix ? 0 : 1;
      const rightKeywordExact = right.keyword === query.keywordPrefix ? 0 : 1;

      if (leftKeywordExact !== rightKeywordExact) {
        return leftKeywordExact - rightKeywordExact;
      }
    }

    if (query.segmentCount === 2 && !query.languageOnly && query.secondaryPrefix) {
      const leftSecondaryRank = getSecondaryMatchRank(left, query.secondaryPrefix);
      const rightSecondaryRank = getSecondaryMatchRank(right, query.secondaryPrefix);

      if (leftSecondaryRank !== rightSecondaryRank) {
        return leftSecondaryRank - rightSecondaryRank;
      }
    }

    if (query.ecosystemPrefix) {
      const leftEcosystemExact = left.ecosystem === query.ecosystemPrefix ? 0 : 1;
      const rightEcosystemExact = right.ecosystem === query.ecosystemPrefix ? 0 : 1;

      if (leftEcosystemExact !== rightEcosystemExact) {
        return leftEcosystemExact - rightEcosystemExact;
      }
    }

    if (query.languagePrefix) {
      const leftLanguageExact = left.language === query.languagePrefix ? 0 : 1;
      const rightLanguageExact = right.language === query.languagePrefix ? 0 : 1;

      if (leftLanguageExact !== rightLanguageExact) {
        return leftLanguageExact - rightLanguageExact;
      }
    }

    const leftRank = ranking.get(left.language) ?? languageOrder.length;
    const rightRank = ranking.get(right.language) ?? languageOrder.length;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    const leftKeywordDelta = query.keywordPrefix
      ? left.keyword.length - query.keywordPrefix.length
      : left.keyword.length;
    const rightKeywordDelta = query.keywordPrefix
      ? right.keyword.length - query.keywordPrefix.length
      : right.keyword.length;

    if (leftKeywordDelta !== rightKeywordDelta) {
      return leftKeywordDelta - rightKeywordDelta;
    }

    if (query.ecosystemPrefix) {
      const leftEcosystemDelta = left.ecosystem.length - query.ecosystemPrefix.length;
      const rightEcosystemDelta = right.ecosystem.length - query.ecosystemPrefix.length;

      if (leftEcosystemDelta !== rightEcosystemDelta) {
        return leftEcosystemDelta - rightEcosystemDelta;
      }
    }

    if (query.languagePrefix) {
      const leftLanguageDelta = left.language.length - query.languagePrefix.length;
      const rightLanguageDelta = right.language.length - query.languagePrefix.length;

      if (leftLanguageDelta !== rightLanguageDelta) {
        return leftLanguageDelta - rightLanguageDelta;
      }
    }

    return compareEntries(left, right);
  };
}

export function sortEntriesForContext(
  entries: readonly DictionaryEntry[],
  languageId: string | undefined,
): DictionaryEntry[] {
  const languageOrder = inferPreferredLanguages(languageId);
  const ranking = new Map(
    languageOrder.map((language, index) => [language, index]),
  );

  return [...entries].sort((left, right) => {
    const leftRank = ranking.get(left.language) ?? languageOrder.length;
    const rightRank = ranking.get(right.language) ?? languageOrder.length;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return compareEntries(left, right);
  });
}

export function resolveEntryFromTrigger(
  trigger: ParsedTrigger,
): DictionaryEntry | undefined {
  const targetEcosystem = trigger.ecosystem ?? DEFAULT_ECOSYSTEM;

  return listEntries().find(
    (entry) => entry.keyword === trigger.keyword
      && entry.language === trigger.language
      && entry.ecosystem === targetEcosystem,
  );
}

export function searchEntriesByPrefix(
  rawToken: string,
  languageId: string | undefined,
): DictionaryEntry[] {
  const query = buildSearchQuery(rawToken);

  if (!query) {
    return [];
  }

  const entries = listEntries().filter((entry) => {
    if (query.keywordPrefix && !entry.keyword.startsWith(query.keywordPrefix)) {
      return false;
    }

    if (query.segmentCount === 1) {
      return true;
    }

    if (query.segmentCount === 2) {
      if (query.languageOnly) {
        return entry.language.startsWith(query.secondaryPrefix);
      }

      if (!query.secondaryPrefix) {
        return true;
      }

      return entry.language.startsWith(query.secondaryPrefix)
        || (entry.ecosystem !== DEFAULT_ECOSYSTEM && entry.ecosystem.startsWith(query.secondaryPrefix));
    }

    if (query.ecosystemPrefix && !entry.ecosystem.startsWith(query.ecosystemPrefix)) {
      return false;
    }

    if (query.languagePrefix && !entry.language.startsWith(query.languagePrefix)) {
      return false;
    }

    return true;
  });

  return [...entries].sort(buildEntryComparator(query, languageId));
}

export { getEntriesForKeyword };
