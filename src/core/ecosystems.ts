import type { DictionaryEntry, TriggerLanguageKey } from '../types';

export const DEFAULT_ECOSYSTEM = 'core';

const ECOSYSTEM_LABELS: Readonly<Record<string, string>> = {
  axios: 'Axios',
  bootstrap: 'Bootstrap',
  chakra: 'Chakra UI',
  core: 'Core',
  dotenv: 'dotenv',
  drizzle: 'Drizzle',
  eloquent: 'Eloquent',
  express: 'Express',
  jdbc: 'JDBC',
  jsonwebtoken: 'jsonwebtoken',
  jpa: 'JPA',
  mui: 'Material UI',
  pdo: 'PDO',
  prisma: 'Prisma',
  sass: 'Sass',
  shadcn: 'shadcn/ui',
  sql: 'SQL',
  tailwind: 'Tailwind CSS',
  typeorm: 'TypeORM',
  zod: 'Zod',
};

const ECOSYSTEM_PATTERN = /^[a-z][a-z0-9-]*$/;

const LANGUAGE_LABELS: Readonly<Record<TriggerLanguageKey, string>> = {
  css: 'CSS',
  html: 'HTML',
  java: 'Java',
  js: 'JavaScript',
  php: 'PHP',
  react: 'React',
  ts: 'TypeScript',
};

export interface EcosystemOption {
  count: number;
  id: string;
  label: string;
}

function humanizeEcosystem(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function compareEcosystemIds(left: string, right: string): number {
  if (left === DEFAULT_ECOSYSTEM && right !== DEFAULT_ECOSYSTEM) {
    return -1;
  }

  if (right === DEFAULT_ECOSYSTEM && left !== DEFAULT_ECOSYSTEM) {
    return 1;
  }

  return getEcosystemLabel(left).localeCompare(getEcosystemLabel(right));
}

export function getEcosystemLabel(value: string): string {
  return ECOSYSTEM_LABELS[value] ?? humanizeEcosystem(value);
}

export function getEntryEcosystem(value: string | undefined): string {
  return normalizeEcosystem(value) ?? DEFAULT_ECOSYSTEM;
}

export function getLanguageLabel(language: TriggerLanguageKey): string {
  return LANGUAGE_LABELS[language];
}

export function listEcosystemOptionsByLanguage(
  entries: readonly Pick<DictionaryEntry, 'ecosystem' | 'language'>[],
): Readonly<Record<TriggerLanguageKey, readonly EcosystemOption[]>> {
  const counts = new Map<TriggerLanguageKey, Map<string, number>>();

  for (const entry of entries) {
    const languageCounts = counts.get(entry.language) ?? new Map<string, number>();
    const ecosystem = getEntryEcosystem(entry.ecosystem);

    languageCounts.set(ecosystem, (languageCounts.get(ecosystem) ?? 0) + 1);
    counts.set(entry.language, languageCounts);
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

export function normalizeEcosystem(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  return ECOSYSTEM_PATTERN.test(normalized) ? normalized : undefined;
}

function buildLanguageOptions(counts: Map<string, number> | undefined): readonly EcosystemOption[] {
  if (!counts || !counts.size) {
    return [{
      count: 0,
      id: DEFAULT_ECOSYSTEM,
      label: getEcosystemLabel(DEFAULT_ECOSYSTEM),
    }];
  }

  return [...counts.entries()]
    .sort(([left], [right]) => compareEcosystemIds(left, right))
    .map(([id, count]) => ({
      count,
      id,
      label: getEcosystemLabel(id),
    }));
}
