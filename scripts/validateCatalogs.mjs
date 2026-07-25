import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const VALID_LANGUAGES = new Set(['js', 'ts', 'react', 'java', 'php']);
const ECOSYSTEM_PATTERN = /^[a-z][a-z0-9-]*$/;
const DEFAULT_ECOSYSTEM = 'core';
const KEYWORD_PATTERN = /^[a-z][a-z0-9]*$/;

const scriptFilePath = fileURLToPath(import.meta.url);
const defaultProjectRoot = path.resolve(path.dirname(scriptFilePath), '..');

function formatLocation(projectRoot, sourceFile, node) {
  const relativePath = path.relative(projectRoot, sourceFile.fileName).replaceAll('\\', '/');
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${relativePath}:${line + 1}:${character + 1}`;
}

function hasExportModifier(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function isNamedProperty(node, name) {
  if (!ts.isPropertyAssignment(node)) {
    return false;
  }

  if (ts.isIdentifier(node.name)) {
    return node.name.text === name;
  }

  if (ts.isStringLiteral(node.name)) {
    return node.name.text === name;
  }

  return false;
}

function getObjectProperty(node, name) {
  return node.properties.find((property) => isNamedProperty(property, name));
}

function readStringValue(initializer, sourceFile, location, issues) {
  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return initializer.text;
  }

  if (ts.isTemplateExpression(initializer)) {
    issues.push(
      `${location} must not use runtime template interpolation. Escape snippet placeholders like \\$` + `{1:name}.`,
    );
    return undefined;
  }

  issues.push(`${location} must be a string literal or a no-substitution template literal.`);
  return undefined;
}

function validateSnippetPlaceholders(snippet, location, issues) {
  for (let index = 0; index < snippet.length; index += 1) {
    if (snippet[index] !== '$') {
      continue;
    }

    const next = snippet[index + 1];

    if (next === '{') {
      const closeIndex = snippet.indexOf('}', index + 2);

      if (closeIndex === -1) {
        issues.push(`${location} has an unterminated snippet placeholder.`);
        return;
      }

      const content = snippet.slice(index + 2, closeIndex);

      if (!content) {
        issues.push(`${location} has an empty snippet placeholder.`);
      } else if (/^\d/.test(content) && !/^\d+(?::[\s\S]*)?$/.test(content)) {
        issues.push(`${location} has a malformed numeric snippet placeholder \${` + `${content}}.`);
      }

      index = closeIndex;
      continue;
    }

    if (next !== undefined && /\d/.test(next)) {
      let cursor = index + 2;

      while (cursor < snippet.length && /\d/.test(snippet[cursor])) {
        cursor += 1;
      }

      index = cursor - 1;
    }
  }
}

function getSourceFile(filePath, sourceFileCache) {
  const normalizedPath = path.resolve(filePath);
  const cached = sourceFileCache.get(normalizedPath);

  if (cached) {
    return cached;
  }

  const sourceText = readFileSync(normalizedPath, 'utf8');
  const sourceFile = ts.createSourceFile(
    normalizedPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  sourceFileCache.set(normalizedPath, sourceFile);
  return sourceFile;
}

function findCatalogDefinition(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
        continue;
      }

      const languageProperty = getObjectProperty(declaration.initializer, 'language');
      const commandsProperty = getObjectProperty(declaration.initializer, 'commands');

      if (languageProperty && commandsProperty) {
        return declaration.initializer;
      }
    }
  }

  return undefined;
}

function findExportedArrayDeclaration(sourceFile, exportName) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== exportName) {
        continue;
      }

      if (declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        return declaration.initializer;
      }
    }
  }

  return undefined;
}

function resolveRelativeModulePath(sourceFile, moduleSpecifier) {
  if (!moduleSpecifier.startsWith('.')) {
    return undefined;
  }

  const resolvedBasePath = path.resolve(path.dirname(sourceFile.fileName), moduleSpecifier);
  const candidates = resolvedBasePath.endsWith('.ts')
    ? [resolvedBasePath]
    : [`${resolvedBasePath}.ts`, path.join(resolvedBasePath, 'index.ts')];

  return candidates.find((candidate) => existsSync(candidate));
}

function findImportedArray(sourceFile, identifierName, sourceFileCache) {
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause || !statement.moduleSpecifier) {
      continue;
    }

    if (!ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }

    const namedBindings = statement.importClause.namedBindings;

    if (!namedBindings || !ts.isNamedImports(namedBindings)) {
      continue;
    }

    for (const element of namedBindings.elements) {
      if (element.name.text !== identifierName) {
        continue;
      }

      const exportName = element.propertyName?.text ?? element.name.text;
      const modulePath = resolveRelativeModulePath(sourceFile, statement.moduleSpecifier.text);

      if (!modulePath) {
        return undefined;
      }

      const importedSourceFile = getSourceFile(modulePath, sourceFileCache);
      const initializer = findExportedArrayDeclaration(importedSourceFile, exportName);

      if (!initializer) {
        return undefined;
      }

      return {
        exportName,
        initializer,
        sourceFile: importedSourceFile,
      };
    }
  }

  return undefined;
}

function collectCommandObjects(
  arrayLiteral,
  sourceFile,
  sourceFileCache,
  projectRoot,
  issues,
  visitedArrays = new Set(),
) {
  const result = [];

  for (const element of arrayLiteral.elements) {
    if (ts.isObjectLiteralExpression(element)) {
      result.push({ element, sourceFile });
      continue;
    }

    if (!ts.isSpreadElement(element)) {
      issues.push(`${formatLocation(projectRoot, sourceFile, element)} command must be an object literal.`);
      continue;
    }

    if (ts.isArrayLiteralExpression(element.expression)) {
      result.push(
        ...collectCommandObjects(
          element.expression,
          sourceFile,
          sourceFileCache,
          projectRoot,
          issues,
          visitedArrays,
        ),
      );
      continue;
    }

    if (!ts.isIdentifier(element.expression)) {
      issues.push(
        `${formatLocation(projectRoot, sourceFile, element.expression)} spread command sections must use imported arrays.`,
      );
      continue;
    }

    const importedArray = findImportedArray(sourceFile, element.expression.text, sourceFileCache);

    if (!importedArray) {
      issues.push(
        `${formatLocation(projectRoot, sourceFile, element.expression)} could not resolve imported command section "${element.expression.text}".`,
      );
      continue;
    }

    const visitedKey = `${importedArray.sourceFile.fileName}::${importedArray.exportName}`;

    if (visitedArrays.has(visitedKey)) {
      continue;
    }

    const nextVisitedArrays = new Set(visitedArrays);
    nextVisitedArrays.add(visitedKey);

    result.push(
      ...collectCommandObjects(
        importedArray.initializer,
        importedArray.sourceFile,
        sourceFileCache,
        projectRoot,
        issues,
        nextVisitedArrays,
      ),
    );
  }

  return result;
}

function validateCommandObject(element, sourceFile, projectRoot, language, seenEntries, issues) {
  const keywordProperty = getObjectProperty(element, 'keyword');
  const descriptionProperty = getObjectProperty(element, 'description');
  const ecosystemProperty = getObjectProperty(element, 'ecosystem');
  const snippetProperty = getObjectProperty(element, 'snippet');

  if (!keywordProperty || !descriptionProperty || !snippetProperty) {
    issues.push(`${formatLocation(projectRoot, sourceFile, element)} command is missing keyword, description, or snippet.`);
    return;
  }

  const keywordLocation = `${formatLocation(projectRoot, sourceFile, keywordProperty.initializer)} keyword`;
  const descriptionLocation = `${formatLocation(projectRoot, sourceFile, descriptionProperty.initializer)} description`;
  const snippetLocation = `${formatLocation(projectRoot, sourceFile, snippetProperty.initializer)} snippet`;

  const keyword = readStringValue(keywordProperty.initializer, sourceFile, keywordLocation, issues);
  const description = readStringValue(descriptionProperty.initializer, sourceFile, descriptionLocation, issues);
  const snippet = readStringValue(snippetProperty.initializer, sourceFile, snippetLocation, issues);

  if (!keyword || !description || !snippet) {
    return;
  }

  if (!KEYWORD_PATTERN.test(keyword)) {
    issues.push(`${keywordLocation} must use lowercase letters and digits only, received "${keyword}".`);
  }

  if (!description.trim()) {
    issues.push(`${descriptionLocation} must not be empty.`);
  }

  let ecosystem = DEFAULT_ECOSYSTEM;

  if (ecosystemProperty) {
    const ecosystemLocation = `${formatLocation(projectRoot, sourceFile, ecosystemProperty.initializer)} ecosystem`;
    ecosystem = readStringValue(ecosystemProperty.initializer, sourceFile, ecosystemLocation, issues) ?? ecosystem;

    if (ecosystem && !ECOSYSTEM_PATTERN.test(ecosystem)) {
      issues.push(`${ecosystemLocation} must use lowercase letters, digits, and hyphens only, received "${ecosystem}".`);
    }
  }

  if (!snippet.trim()) {
    issues.push(`${snippetLocation} must not be empty.`);
  } else {
    validateSnippetPlaceholders(snippet, snippetLocation, issues);
  }

  const entryId = ecosystem === DEFAULT_ECOSYSTEM
    ? `${keyword}.${language}`
    : `${keyword}.${ecosystem}.${language}`;
  const entryLocation = formatLocation(projectRoot, sourceFile, element);
  const existingLocation = seenEntries.get(entryId);

  if (existingLocation) {
    issues.push(`${entryLocation} defines duplicate entry "${entryId}". First defined at ${existingLocation}.`);
  } else {
    seenEntries.set(entryId, entryLocation);
  }
}

function validateCatalogFile(filePath, projectRoot, seenEntries, issues, sourceFileCache) {
  const sourceFile = getSourceFile(filePath, sourceFileCache);
  const catalogNode = findCatalogDefinition(sourceFile);

  if (!catalogNode) {
    issues.push(`${path.relative(projectRoot, filePath).replaceAll('\\', '/')} does not export a catalog object.`);
    return;
  }

  const languageProperty = getObjectProperty(catalogNode, 'language');
  const commandsProperty = getObjectProperty(catalogNode, 'commands');

  if (!languageProperty || !commandsProperty) {
    issues.push(`${formatLocation(projectRoot, sourceFile, catalogNode)} is missing language or commands.`);
    return;
  }

  const language = readStringValue(
    languageProperty.initializer,
    sourceFile,
    `${formatLocation(projectRoot, sourceFile, languageProperty.initializer)} language`,
    issues,
  );

  if (!language) {
    return;
  }

  if (!VALID_LANGUAGES.has(language)) {
    issues.push(
      `${formatLocation(projectRoot, sourceFile, languageProperty.initializer)} has invalid language "${language}".`,
    );
  }

  const expectedLanguage = path.basename(filePath, '.ts');

  if (language !== expectedLanguage) {
    issues.push(
      `${formatLocation(projectRoot, sourceFile, languageProperty.initializer)} declares language "${language}" but the file name is "${expectedLanguage}.ts".`,
    );
  }

  if (!ts.isArrayLiteralExpression(commandsProperty.initializer)) {
    issues.push(`${formatLocation(projectRoot, sourceFile, commandsProperty.initializer)} commands must be an array.`);
    return;
  }

  const commandObjects = collectCommandObjects(
    commandsProperty.initializer,
    sourceFile,
    sourceFileCache,
    projectRoot,
    issues,
  );

  commandObjects.forEach(({ element, sourceFile: commandSourceFile }) => {
    validateCommandObject(element, commandSourceFile, projectRoot, language, seenEntries, issues);
  });
}

export function validateCatalogsOrThrow(projectRoot = defaultProjectRoot) {
  const ecosystemsDirectory = path.join(projectRoot, 'src', 'data', 'ecosystems');
  const catalogFiles = readdirSync(ecosystemsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(ecosystemsDirectory, entry.name, `${entry.name}.ts`))
    .filter((filePath) => existsSync(filePath))
    .sort();

  const seenEntries = new Map();
  const issues = [];
  const sourceFileCache = new Map();

  for (const filePath of catalogFiles) {
    validateCatalogFile(filePath, projectRoot, seenEntries, issues, sourceFileCache);
  }

  if (issues.length > 0) {
    const message = ['Catalog validation failed:', ...issues.map((issue) => `- ${issue}`)].join('\n');
    throw new Error(message);
  }
}

function isDirectInvocation() {
  return process.argv[1] ? path.resolve(process.argv[1]) === scriptFilePath : false;
}

if (isDirectInvocation()) {
  try {
    validateCatalogsOrThrow();
    console.log('Catalog validation passed.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
