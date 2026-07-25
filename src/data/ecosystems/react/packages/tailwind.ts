import type { LanguageCommandDefinition } from '../../../../types';

export const REACT_TAILWIND_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'card',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind card layout.',
    snippet: `<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">\${1:Label}</p>
  <h2 className="mt-3 text-2xl font-semibold text-slate-900">\${2:Card title}</h2>
  <p className="mt-2 text-sm leading-6 text-slate-600">\${3:Card description}</p>
</div>
\$0`,
  },
];
