import { ALL_ENTRIES } from '../../data';
import type { DictionaryEntry } from '../../types';
import { getCustomEntries, getDisabledEntryIds } from '../settings';

import { formatEntryKey } from './format';

function compareEntries(left: DictionaryEntry, right: DictionaryEntry): number {
  return formatEntryKey(left).localeCompare(formatEntryKey(right));
}

export function listEntries(): DictionaryEntry[] {
  const customEntries = getCustomEntries();
  const customEntryIds = new Set(customEntries.map((entry) => formatEntryKey(entry)));
  const disabledEntryIds = getDisabledEntryIds();
  const builtInEntries = ALL_ENTRIES.filter((entry) => {
    const entryId = formatEntryKey(entry);
    return !disabledEntryIds.has(entryId) && !customEntryIds.has(entryId);
  });

  return [...builtInEntries, ...customEntries].sort(compareEntries);
}

export function getEntriesForKeyword(keyword: string): DictionaryEntry[] {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return listEntries().filter((entry) => entry.keyword === normalizedKeyword);
}
