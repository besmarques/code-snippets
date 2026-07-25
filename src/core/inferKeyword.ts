import { getEntriesForKeyword } from './registry';

const KEYWORD_TESTS: ReadonlyArray<{ keyword: string; test: (value: string) => boolean }> = [
  {
    keyword: 'map',
    test: (value) => /\.map\s*\(|\bMap\s*</.test(value),
  },
  {
    keyword: 'filter',
    test: (value) => /\.filter\s*\(/.test(value),
  },
  {
    keyword: 'reduce',
    test: (value) => /\.reduce\s*\(/.test(value),
  },
  {
    keyword: 'find',
    test: (value) => /\.find\s*\(/.test(value),
  },
  {
    keyword: 'foreach',
    test: (value) => /\.forEach\s*\(/.test(value),
  },
  {
    keyword: 'fetch',
    test: (value) => /\bfetch\s*\(|\bfile_get_contents\s*\(/.test(value),
  },
  {
    keyword: 'queryall',
    test: (value) => /\bquerySelectorAll\s*\(/.test(value),
  },
  {
    keyword: 'jsonparse',
    test: (value) => /\bJSON\.parse\s*\(/.test(value),
  },
  {
    keyword: 'jsonstringify',
    test: (value) => /\bJSON\.stringify\s*\(/.test(value),
  },
  {
    keyword: 'type',
    test: (value) => /^\s*type\b/m.test(value),
  },
  {
    keyword: 'interface',
    test: (value) => /^\s*interface\b/m.test(value),
  },
  {
    keyword: 'enum',
    test: (value) => /^\s*enum\b/m.test(value),
  },
  {
    keyword: 'generic',
    test: (value) => /function\s+\w+\s*<|const\s+\w+\s*=\s*<\w+/.test(value),
  },
  {
    keyword: 'union',
    test: (value) => /^\s*type\b.*\|/m.test(value),
  },
  {
    keyword: 'guard',
    test: (value) => /\bis\s+[A-Z][A-Za-z0-9_]*/.test(value),
  },
  {
    keyword: 'usestate',
    test: (value) => /\buseState\s*\(/.test(value),
  },
  {
    keyword: 'useeffect',
    test: (value) => /\buseEffect\s*\(/.test(value),
  },
  {
    keyword: 'useeffectevent',
    test: (value) => /\buseEffectEvent\s*\(/.test(value),
  },
  {
    keyword: 'useref',
    test: (value) => /\buseRef\s*\(/.test(value),
  },
  {
    keyword: 'usereducer',
    test: (value) => /\buseReducer\s*\(/.test(value),
  },
  {
    keyword: 'usecontext',
    test: (value) => /\buseContext\s*\(/.test(value),
  },
  {
    keyword: 'usememo',
    test: (value) => /\buseMemo\s*\(/.test(value),
  },
  {
    keyword: 'usecallback',
    test: (value) => /\buseCallback\s*\(/.test(value),
  },
  {
    keyword: 'useid',
    test: (value) => /\buseId\s*\(/.test(value),
  },
  {
    keyword: 'usetransition',
    test: (value) => /\buseTransition\s*\(/.test(value),
  },
  {
    keyword: 'usedeferredvalue',
    test: (value) => /\buseDeferredValue\s*\(/.test(value),
  },
  {
    keyword: 'useactionstate',
    test: (value) => /\buseActionState\s*\(/.test(value),
  },
  {
    keyword: 'useoptimistic',
    test: (value) => /\buseOptimistic\s*\(/.test(value),
  },
  {
    keyword: 'useformstatus',
    test: (value) => /\buseFormStatus\s*\(/.test(value),
  },
  {
    keyword: 'use',
    test: (value) => /\buse\s*\(/.test(value),
  },
  {
    keyword: 'promiseall',
    test: (value) => /\bPromise\.all\s*\(/.test(value),
  },
  {
    keyword: 'promise',
    test: (value) => /\bnew Promise\s*\(/.test(value),
  },
  {
    keyword: 'async',
    test: (value) => /\basync\b/.test(value) && /\bawait\b|\bPromise\b/.test(value),
  },
  {
    keyword: 'await',
    test: (value) => /\bawait\b/.test(value),
  },
  {
    keyword: 'class',
    test: (value) => /^\s*class\b/m.test(value),
  },
  {
    keyword: 'function',
    test: (value) => /^\s*function\b/m.test(value),
  },
  {
    keyword: 'arrow',
    test: (value) => /=>/.test(value),
  },
  {
    keyword: 'trait',
    test: (value) => /^\s*trait\b/m.test(value),
  },
  {
    keyword: 'namespace',
    test: (value) => /^\s*namespace\b/m.test(value),
  },
  {
    keyword: 'main',
    test: (value) => /\bpublic\s+static\s+void\s+main\s*\(/.test(value),
  },
  {
    keyword: 'record',
    test: (value) => /\brecord\b|\bRecord\s*</.test(value),
  },
  {
    keyword: 'list',
    test: (value) => /\bList\s*</.test(value),
  },
  {
    keyword: 'partial',
    test: (value) => /\bPartial\s*</.test(value),
  },
  {
    keyword: 'readonlyarray',
    test: (value) => /\bReadonlyArray\s*</.test(value),
  },
  {
    keyword: 'tuple',
    test: (value) => /:\s*\[[^\]]+\]/.test(value),
  },
  {
    keyword: 'trycatch',
    test: (value) => /\btry\s*\{/.test(value),
  },
  {
    keyword: 'loop',
    test: (value) => /\bfor\s*\(|\bwhile\s*\(|\bforeach\s*\(/.test(value),
  },
  {
    keyword: 'foreach',
    test: (value) => /\bfor\s*\([^;]+:[^)]+\)|\bforeach\s*\(/.test(value),
  },
  {
    keyword: 'switch',
    test: (value) => /\bswitch\s*\(/.test(value),
  },
  {
    keyword: 'ternary',
    test: (value) => /\?.+:.+/.test(value),
  },
  {
    keyword: 'match',
    test: (value) => /\bmatch\s*\(/.test(value),
  },
  {
    keyword: 'stream',
    test: (value) => /\.stream\s*\(/.test(value),
  },
  {
    keyword: 'optional',
    test: (value) => /\bOptional\b/.test(value),
  },
  {
    keyword: 'builder',
    test: (value) => /\bbuild\s*\(/.test(value) && /\breturn\s+this\b/.test(value),
  },
  {
    keyword: 'file',
    test: (value) => /\bFiles\./.test(value) || /\bPath\.of\s*\(/.test(value),
  },
  {
    keyword: 'http',
    test: (value) => /\bHttpClient\b|\bHttpRequest\b|\bHttpResponse\b/.test(value),
  },
  {
    keyword: 'arraymap',
    test: (value) => /\barray_map\s*\(/.test(value),
  },
  {
    keyword: 'request',
    test: (value) => /\bcurl_init\s*\(|\bcurl_setopt_array\s*\(/.test(value),
  },
  {
    keyword: 'json',
    test: (value) => /\bjson_encode\s*\(|\bjson_decode\s*\(/.test(value),
  },
  {
    keyword: 'pdo',
    test: (value) => /\bnew\s+PDO\s*\(|->prepare\s*\(/.test(value),
  },
  {
    keyword: 'session',
    test: (value) => /\bsession_start\s*\(|\$_SESSION\b/.test(value),
  },
  {
    keyword: 'middleware',
    test: (value) => /\$request\b/.test(value) && /\$next\b/.test(value),
  },
  {
    keyword: 'query',
    test: (value) => /\bquerySelector\s*\(/.test(value),
  },
  {
    keyword: 'destructure',
    test: (value) => /\b(?:const|let|var)\s*\{[^}]+\}\s*=/.test(value),
  },
  {
    keyword: 'spread',
    test: (value) => /\.\.\./.test(value),
  },
  {
    keyword: 'optionalchain',
    test: (value) => /\?\./.test(value),
  },
  {
    keyword: 'nullish',
    test: (value) => /\?\?/.test(value),
  },
  {
    keyword: 'context',
    test: (value) => /\bcreateContext\s*\(/.test(value),
  },
  {
    keyword: 'provider',
    test: (value) => /\.Provider\b/.test(value),
  },
  {
    keyword: 'suspense',
    test: (value) => /<Suspense\b/.test(value),
  },
  {
    keyword: 'useformstatus',
    test: (value) => /\baction=/.test(value) && /<form\b/.test(value),
  },
  {
    keyword: 'addlistener',
    test: (value) => /\baddEventListener\s*\(/.test(value),
  },
  {
    keyword: 'sessionstorage',
    test: (value) => /\bsessionStorage\./.test(value),
  },
  {
    keyword: 'localstorage',
    test: (value) => /\blocalStorage\./.test(value),
  },
  {
    keyword: 'urlparams',
    test: (value) => /\bURLSearchParams\b/.test(value),
  },
  {
    keyword: 'set',
    test: (value) => /\bnew Set\s*\(/.test(value),
  },
  {
    keyword: 'array',
    test: (value) => /^\s*\[[\s\S]*\]\s*$/.test(value),
  },
  {
    keyword: 'object',
    test: (value) => /^\s*\{[\s\S]*\}\s*$/.test(value),
  },
  {
    keyword: 'component',
    test: (value) => /return\s*\(\s*</.test(value) || /<[A-Z][A-Za-z0-9]*/.test(value),
  },
];

export function inferKeywordFromSelection(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const normalized = trimmed.toLowerCase();

  if (getEntriesForKeyword(normalized).length > 0) {
    return normalized;
  }

  for (const candidate of KEYWORD_TESTS) {
    if (candidate.test(trimmed)) {
      return candidate.keyword;
    }
  }

  return undefined;
}
