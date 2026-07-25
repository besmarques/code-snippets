import * as vscode from 'vscode';

import { normalizeEcosystem } from './ecosystems';
import { normalizeTriggerLanguage } from './languages';
import type { ParsedTrigger } from '../types';

const TRIGGER_PREFIX = '>';
const TOKEN_CHARACTER = /[A-Za-z0-9._-]/;
const KEYWORD_PATTERN = /^[a-z][a-z0-9]*$/;

export interface TriggerMatch extends ParsedTrigger {
  range: vscode.Range;
}

function isTriggerCharacter(character: string | undefined): boolean {
  if (character === undefined) {
    return false;
  }

  return TOKEN_CHARACTER.test(character);
}

function normalizeKeyword(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  return KEYWORD_PATTERN.test(normalized) ? normalized : undefined;
}

function parseCoreTrigger(body: string, raw: string): ParsedTrigger | undefined {
  const parts = body.split('.');

  if (parts.length !== 2) {
    return undefined;
  }

  const keyword = normalizeKeyword(parts[0]);
  const language = normalizeTriggerLanguage(parts[1]);

  if (!keyword || !language) {
    return undefined;
  }

  return {
    raw,
    keyword,
    language,
  };
}

function parsePackageTrigger(body: string, raw: string): ParsedTrigger | undefined {
  const parts = body.split('.');

  if (parts.length !== 3) {
    return undefined;
  }

  const keyword = normalizeKeyword(parts[0]);
  const ecosystem = normalizeEcosystem(parts[1]);
  const language = normalizeTriggerLanguage(parts[2]);

  if (!keyword || !ecosystem || !language) {
    return undefined;
  }

  return {
    raw,
    keyword,
    ecosystem,
    language,
  };
}

export function parseTrigger(raw: string): ParsedTrigger | undefined {
  const cleaned = raw.trim();
  const hasPrefix = cleaned.startsWith(TRIGGER_PREFIX);
  const body = hasPrefix ? cleaned.slice(TRIGGER_PREFIX.length) : cleaned;

  if (!body) {
    return undefined;
  }

  if (body.split('.').length === 2) {
    return hasPrefix ? parseCoreTrigger(body, cleaned) : undefined;
  }

  if (body.split('.').length === 3) {
    return parsePackageTrigger(body, cleaned);
  }

  return undefined;
}

function findTokenRange(lineText: string, anchorCharacter: number): [number, number] | undefined {
  if (!lineText.length) {
    return undefined;
  }

  let anchor = anchorCharacter;

  if (!isTriggerCharacter(lineText[anchor])) {
    anchor -= 1;
  }

  if (anchor < 0 || !isTriggerCharacter(lineText[anchor])) {
    return undefined;
  }

  let start = anchor;
  let end = anchor + 1;

  while (start > 0 && isTriggerCharacter(lineText[start - 1])) {
    start -= 1;
  }

  while (end < lineText.length && isTriggerCharacter(lineText[end])) {
    end += 1;
  }

  return [start, end];
}

export function findTriggerAtCursor(
  document: vscode.TextDocument,
  position: vscode.Position,
): TriggerMatch | undefined {
  const line = document.lineAt(position.line);
  const tokenRange = findTokenRange(line.text, position.character);

  if (!tokenRange) {
    return undefined;
  }

  const [startCharacter, endCharacter] = tokenRange;
  const token = line.text.slice(startCharacter, endCharacter);
  const hasPrefix = startCharacter > 0 && line.text[startCharacter - 1] === TRIGGER_PREFIX;
  const prefixedRaw = hasPrefix
    ? line.text.slice(startCharacter - 1, endCharacter)
    : undefined;
  const parsed = (prefixedRaw ? parseTrigger(prefixedRaw) : undefined) ?? parseTrigger(token);

  if (!parsed) {
    return undefined;
  }

  const rangeStartCharacter = prefixedRaw && parsed.raw === prefixedRaw
    ? startCharacter - 1
    : startCharacter;

  return {
    ...parsed,
    range: new vscode.Range(
      new vscode.Position(position.line, rangeStartCharacter),
      new vscode.Position(position.line, endCharacter),
    ),
  };
}

export function getTriggerPrefixAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
): { raw: string; range: vscode.Range } | undefined {
  const lineText = document.lineAt(position.line).text;
  const endCharacter = position.character;

  if (endCharacter <= 0) {
    return undefined;
  }

  const lastCharacter = lineText[endCharacter - 1];

  if (lastCharacter === TRIGGER_PREFIX) {
    return {
      raw: TRIGGER_PREFIX,
      range: new vscode.Range(
        new vscode.Position(position.line, endCharacter - 1),
        new vscode.Position(position.line, endCharacter),
      ),
    };
  }

  if (!isTriggerCharacter(lastCharacter)) {
    return undefined;
  }

  let startCharacter = endCharacter - 1;

  while (startCharacter > 0 && isTriggerCharacter(lineText[startCharacter - 1])) {
    startCharacter -= 1;
  }

  if (startCharacter === 0 || lineText[startCharacter - 1] !== TRIGGER_PREFIX) {
    return undefined;
  }

  startCharacter -= 1;

  const raw = lineText.slice(startCharacter, endCharacter);

  return {
    raw,
    range: new vscode.Range(
      new vscode.Position(position.line, startCharacter),
      new vscode.Position(position.line, endCharacter),
    ),
  };
}
