import { DEFAULT_ECOSYSTEM, compareEcosystemIds, getEcosystemLabel, getLanguageLabel } from '../ecosystems';
import type { DictionaryEntry, TriggerLanguageKey } from '../../types';

const MARKDOWN_LANGUAGE_IDS: Readonly<Record<TriggerLanguageKey, string>> = {
  css: 'css',
  html: 'html',
  java: 'java',
  js: 'javascript',
  php: 'php',
  react: 'jsx',
  ts: 'typescript',
};

const PREVIEW_LINE_LIMIT = 6;

export function formatEntryId(entry: DictionaryEntry): string {
  return entry.ecosystem === DEFAULT_ECOSYSTEM
    ? `>${entry.keyword}.${entry.language}`
    : `${entry.keyword}.${entry.ecosystem}.${entry.language}`;
}

export function formatEntryKey(entry: Pick<DictionaryEntry, 'keyword' | 'language' | 'ecosystem'>): string {
  return entry.ecosystem === DEFAULT_ECOSYSTEM
    ? `${entry.keyword}.${entry.language}`
    : `${entry.keyword}.${entry.ecosystem}.${entry.language}`;
}

export function formatEntrySummary(entry: DictionaryEntry): string {
  return `${getLanguageLabel(entry.language)} | ${getEcosystemLabel(entry.ecosystem)}`;
}

export function formatEntryTrigger(entry: Pick<DictionaryEntry, 'keyword' | 'language' | 'ecosystem'>): string {
  return `>${formatEntryKey(entry)}`;
}

export function buildCompletionDetail(entry: DictionaryEntry): string {
  return entry.description;
}

function stripSnippetPlaceholders(snippet: string): string {
  let result = '';

  for (let index = 0; index < snippet.length; index += 1) {
    const character = snippet[index];

    if (character !== '$') {
      result += character;
      continue;
    }

    const next = snippet[index + 1];

    if (next === '{') {
      let cursor = index + 2;
      let depth = 1;

      while (cursor < snippet.length && depth > 0) {
        if (snippet[cursor] === '{') {
          depth += 1;
        } else if (snippet[cursor] === '}') {
          depth -= 1;
        }

        cursor += 1;
      }

      if (depth > 0) {
        result += character;
        continue;
      }

      const content = snippet.slice(index + 2, cursor - 1);
      const separatorIndex = content.indexOf(':');

      if (separatorIndex >= 0 && /^\d+$/.test(content.slice(0, separatorIndex))) {
        result += content.slice(separatorIndex + 1);
      } else if (!/^\d+$/.test(content)) {
        result += `\${${content}}`;
      }

      index = cursor - 1;
      continue;
    }

    if (next !== undefined && /\d/.test(next)) {
      let cursor = index + 2;

      while (cursor < snippet.length && /\d/.test(snippet[cursor])) {
        cursor += 1;
      }

      index = cursor - 1;
      continue;
    }

    result += character;
  }

  return result;
}

export function buildSnippetPreview(entry: DictionaryEntry): string {
  const cleaned = stripSnippetPlaceholders(entry.snippet).trim();

  if (!cleaned) {
    return '';
  }

  const lines = cleaned.split('\n');
  const visibleLines = lines.slice(0, PREVIEW_LINE_LIMIT);

  if (lines.length > PREVIEW_LINE_LIMIT) {
    visibleLines.push('...');
  }

  return visibleLines.join('\n');
}

export function buildCompletionDocumentation(entry: DictionaryEntry): string {
  const lines = [
    `**${formatEntryId(entry)}**`,
    '',
    entry.description,
    '',
    `Trigger: ${formatEntryTrigger(entry)}`,
    `Language: ${getLanguageLabel(entry.language)}`,
    `Ecosystem: ${getEcosystemLabel(entry.ecosystem)}`,
  ];
  const preview = buildSnippetPreview(entry);

  if (preview) {
    lines.push('', 'Preview:', '', `\`\`\`${MARKDOWN_LANGUAGE_IDS[entry.language]}`, preview, '```');
  }

  return lines.join('\n');
}

export function buildEntriesMarkdown(entries: readonly DictionaryEntry[]): string {
  const lines = ['# Code Dictionary Entries', ''];
  const languageGroups = new Map<TriggerLanguageKey, Map<string, DictionaryEntry[]>>();

  for (const entry of entries) {
    const ecosystemGroups = languageGroups.get(entry.language) ?? new Map<string, DictionaryEntry[]>();
    const entryGroup = ecosystemGroups.get(entry.ecosystem) ?? [];

    entryGroup.push(entry);
    ecosystemGroups.set(entry.ecosystem, entryGroup);
    languageGroups.set(entry.language, ecosystemGroups);
  }

  for (const language of ['js', 'ts', 'react', 'html', 'css', 'java', 'php'] as const) {
    const ecosystemGroups = languageGroups.get(language);

    if (!ecosystemGroups) {
      continue;
    }

    lines.push(`## ${getLanguageLabel(language)}`, '');

    const ecosystems = [...ecosystemGroups.entries()].sort(([left], [right]) => compareEcosystemIds(left, right));

    for (const [ecosystem, groupEntries] of ecosystems) {
      lines.push(`### ${getEcosystemLabel(ecosystem)}`, '');

      for (const entry of [...groupEntries].sort((left, right) => left.keyword.localeCompare(right.keyword))) {
        const detail = entry.detail ? ` - ${entry.detail}` : '';
        lines.push(`- \`${formatEntryId(entry)}\` - ${entry.description}${detail}`);
      }

      lines.push('');
    }
  }

  return lines.join('\n');
}
