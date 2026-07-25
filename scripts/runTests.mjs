import { readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import esbuild from 'esbuild';

import { validateCatalogsOrThrow } from './validateCatalogs.mjs';

const scriptFilePath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptFilePath), '..');
const testsRoot = path.join(projectRoot, 'tests');
const outputRoot = path.join(projectRoot, '.test-dist');

function collectTestFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectTestFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

async function buildTests(testFiles) {
  const vscodeStubPath = path.join(testsRoot, 'support', 'vscode.ts');

  await esbuild.build({
    bundle: true,
    entryPoints: testFiles,
    format: 'cjs',
    outbase: testsRoot,
    outdir: outputRoot,
    platform: 'node',
    plugins: [
      {
        name: 'vscode-test-alias',
        setup(build) {
          build.onResolve({ filter: /^vscode$/ }, () => ({
            path: vscodeStubPath,
          }));
        },
      },
    ],
    sourcemap: 'inline',
    target: 'node20',
  });
}

function runNodeTests(compiledTestFiles) {
  const result = spawnSync(
    process.execPath,
    ['--test', ...compiledTestFiles],
    {
      cwd: projectRoot,
      stdio: 'inherit',
    },
  );

  if (typeof result.status === 'number') {
    process.exitCode = result.status;
    return;
  }

  if (result.error) {
    throw result.error;
  }

  process.exitCode = 1;
}

async function main() {
  validateCatalogsOrThrow(projectRoot);

  const testFiles = collectTestFiles(testsRoot);

  if (testFiles.length === 0) {
    console.log('No test files were found.');
    return;
  }

  rmSync(outputRoot, { force: true, recursive: true });

  await buildTests(testFiles);

  const compiledTestFiles = testFiles.map((testFile) =>
    path.join(
      outputRoot,
      path.relative(testsRoot, testFile).replace(/\.ts$/, '.js'),
    ),
  );

  runNodeTests(compiledTestFiles);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
