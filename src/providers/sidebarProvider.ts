import * as vscode from 'vscode';

import { compareEcosystemIds, getEcosystemLabel, getLanguageLabel } from '../core/ecosystems';
import { buildSnippetPreview } from '../core/entries/format';
import { formatEntryId, formatEntryTrigger, listEntries } from '../core/registry';
import type { DictionaryEntry, TriggerLanguageKey } from '../types';

interface SidebarNode {
  children?: readonly SidebarNode[];
  command?: vscode.Command;
  contextValue?: string;
  description?: string;
  ecosystem?: string;
  entry?: DictionaryEntry;
  id: string;
  label: string;
  language?: TriggerLanguageKey;
  tooltip?: string | vscode.MarkdownString;
}

const TREE_VIEW_ID = 'codeDictionary.sidebar';

const ROOT_NODES: readonly SidebarNode[] = [
  {
    id: 'commands',
    label: 'Commands',
    children: [
      {
        id: 'commands.searchInsert',
        label: 'Search And Insert Entry',
        description: 'Quick search',
        tooltip: 'Search the full catalog and insert any entry into the active editor.',
        command: {
          command: 'codeDictionary.searchCatalog',
          title: 'Search And Insert Entry',
        },
      },
      {
        id: 'commands.searchCopy',
        label: 'Search And Copy Trigger',
        description: 'Copy >trigger',
        tooltip: 'Search the full catalog and copy the trigger for any entry.',
        command: {
          command: 'codeDictionary.searchCatalogAndCopyTrigger',
          title: 'Search And Copy Trigger',
        },
      },
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
        tooltip: 'Core entries use >keyword.language. Package entries use keyword.package.language. Manual expansion accepts both >post.express.js and post.express.js.',
      },
      {
        id: 'tips.insert',
        label: 'Click Catalog Entries To Insert',
        description: 'Direct insert',
        tooltip: 'Selecting a catalog entry inserts its snippet into the active editor at the current selection.',
      },
      {
        id: 'tips.copy',
        label: 'Right-Click To Copy Trigger',
        description: 'Context action',
        tooltip: 'Use the context menu on any catalog entry to copy the canonical trigger to your clipboard.',
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
    const item = new vscode.TreeItem(element.label, getCollapsibleState(element));

    item.command = element.command;
    item.contextValue = element.contextValue;
    item.description = element.description;
    item.id = element.id;
    item.tooltip = element.tooltip;

    return item;
  }
}

export function registerSidebarProvider(context: vscode.ExtensionContext): void {
  const provider = new CodeDictionarySidebarProvider();
  const registration = vscode.window.registerTreeDataProvider(TREE_VIEW_ID, provider);
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
    description: `${languageCount} languages | ${entries.length} entries`,
    tooltip: 'Browse all entries grouped by language and ecosystem/package. Click an entry to insert it or use the sidebar search actions to find it faster.',
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

  return (['js', 'ts', 'react', 'html', 'css', 'java', 'php'] as const)
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
      tooltip: buildEntryTooltip(entry),
      command: {
        command: 'codeDictionary.insertEntryFromSidebar',
        title: 'Insert Entry',
        arguments: [entry],
      },
      contextValue: 'codeDictionaryEntry',
      entry,
    }));
}

function buildEntryTooltip(entry: DictionaryEntry): vscode.MarkdownString {
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
    lines.push('', 'Preview:', '', '```', preview, '```');
  }

  return new vscode.MarkdownString(lines.join('\n'));
}

function getCollapsibleState(element: SidebarNode): vscode.TreeItemCollapsibleState {
  if (!hasChildren(element)) {
    return vscode.TreeItemCollapsibleState.None;
  }

  if (element.id === 'commands' || element.id === 'catalogs') {
    return vscode.TreeItemCollapsibleState.Expanded;
  }

  return vscode.TreeItemCollapsibleState.Collapsed;
}

function hasChildren(element: SidebarNode): boolean {
  return element.id === 'catalogs'
    || (!!element.language && !element.ecosystem && !element.entry)
    || (!!element.language && !!element.ecosystem && !element.entry)
    || !!element.children?.length;
}
