import { LANGUAGE_CATALOGS } from '../data/ecosystems';
import type { TriggerLanguageKey } from '../types';

import {
  compareEcosystemIds,
  getEntryEcosystem,
  getEcosystemLabel,
  type EcosystemOption,
} from './ecosystems';

const BUILT_IN_ECOSYSTEM_OPTIONS_BY_LANGUAGE = buildBuiltInEcosystemOptionsByLanguage();

function buildBuiltInEcosystemOptionsByLanguage(): Readonly<Record<TriggerLanguageKey, readonly EcosystemOption[]>> {
  const counts = new Map<TriggerLanguageKey, Map<string, number>>();

  for (const catalog of LANGUAGE_CATALOGS) {
    const languageCounts = counts.get(catalog.language) ?? new Map<string, number>();

    for (const command of catalog.commands) {
      const ecosystem = getEntryEcosystem(command.ecosystem);
      languageCounts.set(ecosystem, (languageCounts.get(ecosystem) ?? 0) + 1);
    }

    counts.set(catalog.language, languageCounts);
  }

  return {
    css: buildLanguageOptions(counts.get('css')),
    html: buildLanguageOptions(counts.get('html')),
    java: buildLanguageOptions(counts.get('java')),
    js: buildLanguageOptions(counts.get('js')),
    php: buildLanguageOptions(counts.get('php')),
    react: buildLanguageOptions(counts.get('react')),
    ts: buildLanguageOptions(counts.get('ts')),
  };
}

function buildLanguageOptions(counts: Map<string, number> | undefined): readonly EcosystemOption[] {
  if (!counts || !counts.size) {
    return [];
  }

  return [...counts.entries()]
    .sort(([left], [right]) => compareEcosystemIds(left, right))
    .map(([id, count]) => ({
      count,
      id,
      label: getEcosystemLabel(id),
    }));
}

export function getBuiltInEcosystemOptionsByLanguage(): Readonly<Record<TriggerLanguageKey, readonly EcosystemOption[]>> {
  return BUILT_IN_ECOSYSTEM_OPTIONS_BY_LANGUAGE;
}

export function isBuiltInEcosystemForLanguage(
  language: TriggerLanguageKey,
  ecosystem: string,
): boolean {
  return (BUILT_IN_ECOSYSTEM_OPTIONS_BY_LANGUAGE[language] ?? []).some((option) => option.id === ecosystem);
}
