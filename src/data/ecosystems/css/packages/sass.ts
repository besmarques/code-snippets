import type { LanguageCommandDefinition } from '../../../../types';

export const CSS_SASS_COMMANDS: readonly LanguageCommandDefinition[] = [
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
];
