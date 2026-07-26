import type { LanguageCommandDefinition } from '../../../../types';

export const CSS_TAILWIND_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'base',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind base layer override.',
    snippet: `@layer base {
  body {
    @apply bg-slate-950 text-slate-100 antialiased;
  }

  a {
    @apply text-sky-400 hover:text-sky-300;
  }
}
\$0`,
  },
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
    keyword: 'button',
    ecosystem: 'tailwind',
    description: 'Create a reusable Tailwind button class with @apply.',
    snippet: `.\${1:btn-secondary} {
  @apply inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50;
}
\$0`,
  },
  {
    keyword: 'input',
    ecosystem: 'tailwind',
    description: 'Create a reusable Tailwind input class with @apply.',
    snippet: `.\${1:input-field} {
  @apply w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500;
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
  {
    keyword: 'stack',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind spacing utility with @apply.',
    snippet: `@layer utilities {
  .\${1:stack-4} > * + * {
    @apply mt-4;
  }
}
\$0`,
  },
  {
    keyword: 'card',
    ecosystem: 'tailwind',
    description: 'Create a reusable Tailwind card class with @apply.',
    snippet: `.\${1:card-surface} {
  @apply rounded-3xl border border-slate-200 bg-white p-6 shadow-sm;
}
\$0`,
  },
  {
    keyword: 'surface',
    ecosystem: 'tailwind',
    description: 'Create a reusable Tailwind section surface class.',
    snippet: `.\${1:panel-surface} {
  @apply rounded-[2rem] bg-slate-950 px-8 py-10 text-white;
}
\$0`,
  },
];
