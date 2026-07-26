import type { LanguageCommandDefinition } from '../../../../types';

export const CSS_SASS_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'use',
    ecosystem: 'sass',
    description: 'Import a Sass module with @use.',
    snippet: `@use '\${1:./tokens}' as \${2:tokens};

\$0`,
  },
  {
    keyword: 'mixin',
    ecosystem: 'sass',
    description: 'Create a Sass mixin with one configurable argument.',
    snippet: `@mixin \${1:focus-ring}(\${2:$color}: \${3:#0ea5e9}) {
  outline: 2px solid \${2};
  outline-offset: 2px;
}

\$0`,
  },
  {
    keyword: 'function',
    ecosystem: 'sass',
    description: 'Create a Sass function that returns a computed value.',
    snippet: `@function \${1:rem}(\${2:$px}, \${3:$base}: 16) {
  @return calc(\${2} / \${3}) * 1rem;
}

\$0`,
  },
  {
    keyword: 'map',
    ecosystem: 'sass',
    description: 'Create a Sass token map and read one key from it.',
    snippet: `\${1:$colors}: (
  'primary': \${2:#2563eb},
  'accent': \${3:#0ea5e9},
);

.\${4:button} {
  color: map-get(\${1}, '\${5:primary}');
}
\$0`,
  },
  {
    keyword: 'nest',
    ecosystem: 'sass',
    description: 'Create a Sass nesting block with a modifier state.',
    snippet: `.\${1:card} {
  padding: \${2:1rem};

  &__title {
    font-weight: 700;
  }

  &--highlighted {
    border-color: \${3:#0ea5e9};
  }
}
\$0`,
  },
  {
    keyword: 'extend',
    ecosystem: 'sass',
    description: 'Create a Sass placeholder selector and extend it.',
    snippet: `%\${1:surface-card} {
  border-radius: \${2:1rem};
  border: 1px solid \${3:#e2e8f0};
  background: \${4:#ffffff};
}

.\${5:card} {
  @extend %\${1};
}
\$0`,
  },
  {
    keyword: 'each',
    ecosystem: 'sass',
    description: 'Generate utility classes with a Sass @each loop.',
    snippet: `\${1:$spaces}: (
  sm: \${2:0.5rem},
  md: \${3:1rem},
  lg: \${4:1.5rem},
);

@each \${5:$name}, \${6:$value} in \${1} {
  .space-#{$name} {
    gap: \${6};
  }
}
\$0`,
  },
  {
    keyword: 'media',
    ecosystem: 'sass',
    description: 'Create a Sass breakpoint mixin usage block.',
    snippet: `@mixin \${1:desktop} {
  @media (min-width: \${2:1024px}) {
    @content;
  }
}

.\${3:layout} {
  @include \${1} {
    grid-template-columns: 2fr 1fr;
  }
}
\$0`,
  },
];
