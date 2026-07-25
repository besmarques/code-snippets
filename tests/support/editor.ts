import * as vscode from 'vscode';

interface RangeLike {
  end: { character: number; line: number };
  start: { character: number; line: number };
}

export interface TestDocument {
  getText(range?: RangeLike): string;
  languageId: string;
  lineAt(line: number): { text: string };
}

export interface CapturedInsertion {
  range: RangeLike;
  snippet: string;
}

export interface TestEditor {
  document: TestDocument;
  insertSnippet(snippet: { value?: string } | string, range: RangeLike): Promise<boolean>;
  insertions: CapturedInsertion[];
  selection: {
    active: { character: number; line: number };
    anchor: { character: number; line: number };
    end: { character: number; line: number };
    isEmpty: boolean;
    start: { character: number; line: number };
  };
}

function toOffset(text: string, position: { character: number; line: number }): number {
  const lines = text.split('\n');
  let offset = 0;

  for (let index = 0; index < position.line; index += 1) {
    offset += (lines[index] ?? '').length + 1;
  }

  return offset + position.character;
}

export function createSelection(
  startLine: number,
  startCharacter: number,
  endLine: number,
  endCharacter: number,
) {
  const start = new vscode.Position(startLine, startCharacter);
  const end = new vscode.Position(endLine, endCharacter);

  return {
    active: end,
    anchor: start,
    end,
    isEmpty: startLine === endLine && startCharacter === endCharacter,
    start,
  };
}

export function createCursorSelection(line: number, character: number) {
  return createSelection(line, character, line, character);
}

export function createTestDocument(text: string, languageId = 'plaintext'): TestDocument {
  const lines = text.split('\n');

  return {
    getText(range?: RangeLike): string {
      if (!range) {
        return text;
      }

      return text.slice(toOffset(text, range.start), toOffset(text, range.end));
    },

    languageId,

    lineAt(line: number) {
      return {
        text: lines[line] ?? '',
      };
    },
  };
}

export function createTestEditor(
  text: string,
  languageId: string,
  selection: TestEditor['selection'],
): TestEditor {
  const document = createTestDocument(text, languageId);
  const insertions: CapturedInsertion[] = [];

  return {
    document,

    async insertSnippet(snippet, range) {
      insertions.push({
        range,
        snippet: typeof snippet === 'string' ? snippet : snippet.value ?? '',
      });
      return true;
    },

    insertions,
    selection,
  };
}
