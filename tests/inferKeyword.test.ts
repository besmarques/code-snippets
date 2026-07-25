import assert from 'node:assert/strict';
import { test } from 'node:test';

import { inferKeywordFromSelection } from '../src/core/inferKeyword';

test('inferKeywordFromSelection detects map usage', () => {
  assert.equal(
    inferKeywordFromSelection('items.map((item) => item.name);'),
    'map',
  );
});

test('inferKeywordFromSelection detects React 19 hooks', () => {
  assert.equal(
    inferKeywordFromSelection('const onConnected = useEffectEvent(() => showNotification());'),
    'useeffectevent',
  );
});

test('inferKeywordFromSelection detects PHP traits', () => {
  assert.equal(
    inferKeywordFromSelection('trait LogsMessages { }'),
    'trait',
  );
});

test('inferKeywordFromSelection detects PHP sessions', () => {
  assert.equal(
    inferKeywordFromSelection("session_start();\n$_SESSION['user_id'] = 1;"),
    'session',
  );
});

test('inferKeywordFromSelection detects Promise.all usage', () => {
  assert.equal(
    inferKeywordFromSelection('const result = await Promise.all([loadUser(), loadPosts()]);'),
    'promiseall',
  );
});

test('inferKeywordFromSelection detects optional chaining', () => {
  assert.equal(
    inferKeywordFromSelection('const value = response?.data?.items?.[0];'),
    'optionalchain',
  );
});

test('inferKeywordFromSelection detects querySelectorAll usage', () => {
  assert.equal(
    inferKeywordFromSelection("const items = document.querySelectorAll('.item');"),
    'queryall',
  );
});

test('inferKeywordFromSelection detects object spread patterns', () => {
  assert.equal(
    inferKeywordFromSelection('const nextState = { ...state, loading: true };'),
    'spread',
  );
});
