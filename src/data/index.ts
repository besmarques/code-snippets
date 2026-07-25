import type { DictionaryEntry } from '../types';
import { getEntryEcosystem } from '../core/ecosystems';

import { LANGUAGE_CATALOGS } from './ecosystems';

export const ALL_ENTRIES: readonly DictionaryEntry[] = LANGUAGE_CATALOGS.flatMap((catalog) =>
  catalog.commands.map((command) => {
    const ecosystem = getEntryEcosystem(command.ecosystem);

    return {
      keyword: command.keyword,
      ecosystem,
      language: catalog.language,
      description: command.description,
      snippet: command.snippet,
    };
  }),
);
