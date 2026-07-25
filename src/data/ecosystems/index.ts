import type { LanguageCatalog } from '../../types';

import { JAVA_CATALOG } from './java/java';
import { JS_CATALOG } from './js/js';
import { PHP_CATALOG } from './php/php';
import { REACT_CATALOG } from './react/react';
import { TS_CATALOG } from './ts/ts';

export const LANGUAGE_CATALOGS: readonly LanguageCatalog[] = [
  JS_CATALOG,
  REACT_CATALOG,
  TS_CATALOG,
  JAVA_CATALOG,
  PHP_CATALOG,
];
