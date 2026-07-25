import esbuild from 'esbuild';
import { validateCatalogsOrThrow } from './scripts/validateCatalogs.mjs';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const catalogValidationPlugin = {
  name: 'catalog-validation',
  setup(build) {
    build.onStart(() => {
      validateCatalogsOrThrow();
    });
  },
};

const baseOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  sourcemap: !production,
  minify: production,
  external: ['vscode'],
  legalComments: 'none',
  logLevel: 'info',
  plugins: [catalogValidationPlugin],
  sourcesContent: false,
  target: 'es2022',
};

const nodeOptions = {
  ...baseOptions,
  outfile: 'dist/node/extension.js',
  format: 'cjs',
  platform: 'node',
};

const webOptions = {
  ...baseOptions,
  outfile: 'dist/web/extension.js',
  format: 'cjs',
  platform: 'browser',
};

async function runBuild() {
  if (watch) {
    const contexts = await Promise.all([
      esbuild.context(nodeOptions),
      esbuild.context(webOptions),
    ]);

    await Promise.all(contexts.map((context) => context.watch()));
    console.log('Watching Code Dictionary extension bundles...');
    return;
  }

  await Promise.all([esbuild.build(nodeOptions), esbuild.build(webOptions)]);
}

runBuild().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
