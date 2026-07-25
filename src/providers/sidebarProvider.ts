import * as vscode from 'vscode';

import { compareEcosystemIds, getEcosystemLabel, getLanguageLabel } from '../core/ecosystems';
import { formatEntryId, listEntries } from '../core/registry';
import type { DictionaryEntry, TriggerLanguageKey } from '../types';

interface SidebarNode {
  children?: readonly SidebarNode[];
  command?: vscode.Command;
  description?: string;
  ecosystem?: string;
  entry?: DictionaryEntry;
  id: string;
  label: string;
  language?: TriggerLanguageKey;
  tooltip?: string;
}

const ROOT_NODES: readonly SidebarNode[] = [
  {
    id: 'commands',
    label: 'Commands',
    children: [
      {
        id: 'commands.expand',
        label: 'Expand Trigger at Cursor',
        description: '>map.js',
        tooltip: 'Replace a trigger like >map.js with its snippet.',
        command: {
          command: 'codeDictionary.expandAtCursor',
          title: 'Expand Trigger at Cursor',
        },
      },
      {
        id: 'commands.translate',
        label: 'Translate Selection',
        description: 'map or map.java',
        tooltip: 'Replace a selected keyword, trigger, or supported code pattern with a snippet.',
        command: {
          command: 'codeDictionary.translateSelection',
          title: 'Translate Selection',
        },
      },
      {
        id: 'commands.pick',
        label: 'Pick And Insert Entry',
        description: 'Browse all',
        tooltip: 'Browse the full catalog and insert any entry.',
        command: {
          command: 'codeDictionary.pickAndInsert',
          title: 'Pick And Insert Entry',
        },
      },
      {
        id: 'commands.show',
        label: 'Show Available Entries',
        description: 'Open list',
        tooltip: 'Open the full entry list in a markdown document.',
        command: {
          command: 'codeDictionary.showAvailableEntries',
          title: 'Show Available Entries',
        },
      },
    ],
  },
  {
    id: 'tips',
    label: 'Quick Start',
    children: [
      {
        id: 'tips.trigger',
        label: 'Core And Package IDs',
        description: '>map.js or post.express.js',
        tooltip: 'Core entries use >keyword.language. Package entries use keyword.package.language and can also be discovered by typing > in completion.',
      },
      {
        id: 'tips.catalog',
        label: 'Browse By Ecosystem',
        description: 'Language -> package',
        tooltip: 'Open a language and then an ecosystem such as Express, Prisma, SQL, or Tailwind in the sidebar catalog.',
      },
      {
        id: 'tips.selection',
        label: 'Translate Selection Replaces Text',
        description: 'In place',
        tooltip: 'Translate Selection replaces the selected text instead of inserting beside it.',
      },
    ],
  },
];

class CodeDictionarySidebarProvider implements vscode.TreeDataProvider<SidebarNode> {
  private readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<SidebarNode | undefined>();

  readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

  refresh(): void {
    this.onDidChangeTreeDataEmitter.fire(undefined);
  }

  getChildren(element?: SidebarNode): SidebarNode[] {
    if (!element) {
      return [
        ROOT_NODES[0],
        buildCatalogRootNode(),
        ROOT_NODES[1],
      ];
    }

    if (element.id === 'catalogs') {
      return buildLanguageNodes();
    }

    if (element.entry) {
      return [];
    }

    if (element.language && !element.ecosystem) {
      return buildEcosystemNodes(element.language);
    }

    if (element.language && element.ecosystem) {
      return buildEntryNodes(element.language, element.ecosystem);
    }

    return [...(element.children ?? [])];
  }

  getTreeItem(element: SidebarNode): vscode.TreeItem {
    const item = new vscode.TreeItem(
      element.label,
      hasChildren(element)
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None,
    );

    item.command = element.command;
    item.description = element.description;
    item.id = element.id;
    item.tooltip = element.tooltip;

    return item;
  }
}

export function registerSidebarProvider(context: vscode.ExtensionContext): void {
  const provider = new CodeDictionarySidebarProvider();
  const registration = vscode.window.registerTreeDataProvider('codeDictionary.sidebar', provider);
  const configurationChangeRegistration = vscode.workspace.onDidChangeConfiguration((event) => {
    if (
      event.affectsConfiguration('codeDictionary.customEntries')
      || event.affectsConfiguration('codeDictionary.disabledEntries')
    ) {
      provider.refresh();
    }
  });

  context.subscriptions.push(registration);
  context.subscriptions.push(configurationChangeRegistration);
}

function buildCatalogRootNode(): SidebarNode {
  const entries = listEntries();
  const languageCount = new Set(entries.map((entry) => entry.language)).size;

  return {
    id: 'catalogs',
    label: 'Catalog',
    description: `${languageCount} languages`,
    tooltip: 'Browse all entries grouped by language and ecosystem/package.',
  };
}

function buildLanguageNodes(): SidebarNode[] {
  const entries = listEntries();
  const grouped = new Map<TriggerLanguageKey, DictionaryEntry[]>();

  for (const entry of entries) {
    const group = grouped.get(entry.language) ?? [];
    group.push(entry);
    grouped.set(entry.language, group);
  }

  return (['js', 'ts', 'react', 'java', 'php'] as const)
    .filter((language) => grouped.has(language))
    .map((language) => {
      const languageEntries = grouped.get(language) ?? [];
      const ecosystemCount = new Set(languageEntries.map((entry) => entry.ecosystem)).size;

      return {
        id: `catalogs.language.${language}`,
        label: getLanguageLabel(language),
        language,
        description: `${ecosystemCount} ecosystems | ${languageEntries.length} entries`,
        tooltip: `Browse ${getLanguageLabel(language)} entries by ecosystem.`,
      };
    });
}

function buildEcosystemNodes(language: TriggerLanguageKey): SidebarNode[] {
  const entries = listEntries().filter((entry) => entry.language === language);
  const grouped = new Map<string, DictionaryEntry[]>();

  for (const entry of entries) {
    const group = grouped.get(entry.ecosystem) ?? [];
    group.push(entry);
    grouped.set(entry.ecosystem, group);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => compareEcosystemIds(left, right))
    .map(([ecosystem, groupEntries]) => ({
      id: `catalogs.language.${language}.ecosystem.${ecosystem}`,
      label: getEcosystemLabel(ecosystem),
      language,
      ecosystem,
      description: `${groupEntries.length} entries`,
      tooltip: `${getLanguageLabel(language)} | ${getEcosystemLabel(ecosystem)}`,
    }));
}

function buildEntryNodes(language: TriggerLanguageKey, ecosystem: string): SidebarNode[] {
  return listEntries()
    .filter((entry) => entry.language === language && entry.ecosystem === ecosystem)
    .sort((left, right) => left.keyword.localeCompare(right.keyword))
    .map((entry) => ({
      id: `catalogs.entry.${formatEntryId(entry)}`,
      label: entry.keyword,
      description: formatEntryId(entry),
      tooltip: `${entry.description}\n\n${getLanguageLabel(entry.language)} | ${getEcosystemLabel(entry.ecosystem)}`,
      entry,
    }));
}

function hasChildren(element: SidebarNode): boolean {
  return element.id === 'catalogs'
    || (!!element.language && !element.ecosystem && !element.entry)
    || (!!element.language && !!element.ecosystem && !element.entry)
    || !!element.children?.length;
}
