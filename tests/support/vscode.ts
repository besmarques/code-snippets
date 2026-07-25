type QuickPickHandler = ((items: any[], options: unknown) => any | Promise<any>) | undefined;
type CommandHandler = (...args: any[]) => any;

interface CompletionProviderRegistration {
  provider: { provideCompletionItems(document: unknown, position: Position): unknown };
  selector: unknown;
  triggerCharacters: string[];
}

interface StubState {
  commands: Map<string, CommandHandler>;
  completionProviders: CompletionProviderRegistration[];
  configuration: Map<string, unknown>;
  informationMessages: string[];
  quickPickCalls: Array<{ items: any[]; options: unknown }>;
  quickPickHandler: QuickPickHandler;
  quickPickResult: unknown;
  warningMessages: string[];
}

const state: StubState = {
  commands: new Map(),
  completionProviders: [],
  configuration: new Map(),
  informationMessages: [],
  quickPickCalls: [],
  quickPickHandler: undefined,
  quickPickResult: undefined,
  warningMessages: [],
};

export class Position {
  constructor(
    public readonly line: number,
    public readonly character: number,
  ) {}
}

export class Range {
  constructor(
    public readonly start: Position,
    public readonly end: Position,
  ) {}
}

export class SnippetString {
  constructor(public readonly value: string) {}
}

export class MarkdownString {
  constructor(public readonly value: string) {}
}

export class Uri {
  constructor(public readonly path: string) {}

  get fsPath(): string {
    return this.path;
  }

  static file(path: string): Uri {
    return new Uri(path);
  }

  static joinPath(base: Uri, ...paths: string[]): Uri {
    const normalizedBase = base.path.replace(/[\\/]+$/, '');
    const normalizedChildren = paths.map((value) => value.replaceAll('\\', '/').replace(/^\/+/, ''));
    return new Uri([normalizedBase, ...normalizedChildren].join('/'));
  }
}

export const CompletionItemKind = {
  Snippet: 15,
} as const;

export const ConfigurationTarget = {
  Global: 1,
  Workspace: 2,
  WorkspaceFolder: 3,
} as const;

export class CompletionItem {
  detail: string | undefined;
  documentation: MarkdownString | undefined;
  filterText: string | undefined;
  insertText: SnippetString | undefined;
  range: Range | undefined;
  sortText: string | undefined;

  constructor(
    public readonly label: string,
    public readonly kind?: number,
  ) {}
}

export const languages = {
  registerCompletionItemProvider(
    selector: unknown,
    provider: CompletionProviderRegistration['provider'],
    ...triggerCharacters: string[]
  ) {
    const registration: CompletionProviderRegistration = {
      provider,
      selector,
      triggerCharacters,
    };

    state.completionProviders.push(registration);

    return {
      dispose() {
        const index = state.completionProviders.indexOf(registration);

        if (index >= 0) {
          state.completionProviders.splice(index, 1);
        }
      },
    };
  },
};

export const commands = {
  async executeCommand(command: string, ...args: any[]): Promise<any> {
    const handler = state.commands.get(command);
    return handler ? handler(...args) : undefined;
  },

  registerCommand(command: string, callback: CommandHandler) {
    state.commands.set(command, callback);

    return {
      dispose() {
        state.commands.delete(command);
      },
    };
  },
};

export const workspace = {
  fs: {
    async readFile(): Promise<Uint8Array> {
      return new Uint8Array();
    },

    async stat(): Promise<{ type: number }> {
      return { type: 0 };
    },

    async writeFile(): Promise<void> {},
  },

  workspaceFolders: undefined as unknown[] | undefined,

  getConfiguration(namespace: string) {
    return {
      get<T>(key: string, defaultValue: T): T {
        const configKey = `${namespace}.${key}`;
        return state.configuration.has(configKey)
          ? (state.configuration.get(configKey) as T)
          : defaultValue;
      },

      async update(key: string, value: unknown): Promise<void> {
        state.configuration.set(`${namespace}.${key}`, value);
      },
    };
  },
};

export const window = {
  activeTextEditor: undefined as unknown,

  async showInformationMessage(message: string): Promise<string> {
    state.informationMessages.push(message);
    return message;
  },

  async showQuickPick(items: any[], options: unknown): Promise<any> {
    state.quickPickCalls.push({ items, options });

    if (state.quickPickHandler) {
      return state.quickPickHandler(items, options);
    }

    return state.quickPickResult;
  },

  async showWarningMessage(message: string): Promise<string> {
    state.warningMessages.push(message);
    return message;
  },

  registerWebviewViewProvider() {
    return {
      dispose() {},
    };
  },
};

export function __getCompletionProviders(): CompletionProviderRegistration[] {
  return [...state.completionProviders];
}

export function __getInformationMessages(): string[] {
  return [...state.informationMessages];
}

export function __getConfigurationValue(key: string): unknown {
  return state.configuration.get(`codeDictionary.${key}`);
}

export function __getQuickPickCalls(): Array<{ items: any[]; options: unknown }> {
  return [...state.quickPickCalls];
}

export function __getWarningMessages(): string[] {
  return [...state.warningMessages];
}

export function __reset(): void {
  state.commands.clear();
  state.completionProviders = [];
  state.configuration.clear();
  state.informationMessages = [];
  state.quickPickCalls = [];
  state.quickPickHandler = undefined;
  state.quickPickResult = undefined;
  state.warningMessages = [];
  window.activeTextEditor = undefined;
  workspace.workspaceFolders = undefined;
}

export function __setConfigurationValue(key: string, value: unknown): void {
  state.configuration.set(`codeDictionary.${key}`, value);
}

export function __setQuickPickHandler(handler: QuickPickHandler): void {
  state.quickPickHandler = handler;
}

export function __setQuickPickResult(result: unknown): void {
  state.quickPickResult = result;
}

export function __setWorkspaceFolders(value: unknown[] | undefined): void {
  workspace.workspaceFolders = value;
}
