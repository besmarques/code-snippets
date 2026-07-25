import type { LanguageCommandDefinition } from '../../../../types';

export const CSS_TAILWIND_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'components',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind component layer class.',
    snippet: `@layer components {
  .\${1:btn-primary} {
    @apply inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-400;
  }
}
\$0`,
  },
  {
    keyword: 'utilities',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind utility layer helper.',
    snippet: `@layer utilities {
  .\${1:text-balance} {
    text-wrap: balance;
  }
}
\$0`,
  },
];
