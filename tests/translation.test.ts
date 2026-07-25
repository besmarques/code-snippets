import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveSelectionTranslationIntent } from '../src/core/translation';

test('resolveSelectionTranslationIntent parses explicit trigger selections', () => {
  assert.deepEqual(resolveSelectionTranslationIntent('>map.react'), {
    explicitEcosystem: 'core',
    explicitLanguage: 'react',
    keyword: 'map',
  });
});

test('resolveSelectionTranslationIntent parses triggerless keyword-language selections', () => {
  assert.deepEqual(resolveSelectionTranslationIntent('map.java'), {
    explicitEcosystem: 'core',
    explicitLanguage: 'java',
    keyword: 'map',
  });
});

test('resolveSelectionTranslationIntent parses package-scoped selections', () => {
  assert.deepEqual(resolveSelectionTranslationIntent('post.express.js'), {
    explicitEcosystem: 'express',
    explicitLanguage: 'js',
    keyword: 'post',
  });
});

test('resolveSelectionTranslationIntent parses prefixed keywords without languages', () => {
  assert.deepEqual(resolveSelectionTranslationIntent('>fetch'), {
    keyword: 'fetch',
  });
});

test('resolveSelectionTranslationIntent infers a keyword from code', () => {
  assert.deepEqual(resolveSelectionTranslationIntent('Promise.all([loadA(), loadB()])'), {
    keyword: 'promiseall',
  });
});
