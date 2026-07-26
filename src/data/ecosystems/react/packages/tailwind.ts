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
  {
    keyword: 'navbar',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind navigation bar in React.',
    snippet: `<header className="border-b border-slate-200 bg-white">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="#" className="text-lg font-semibold text-slate-900">\${1:Brand}</a>
    <nav className="hidden gap-6 md:flex">
      <a href="#" className="text-sm font-medium text-slate-600">\${2:Features}</a>
      <a href="#" className="text-sm font-medium text-slate-600">\${3:Pricing}</a>
      <a href="#" className="text-sm font-medium text-slate-600">\${4:Docs}</a>
    </nav>
    <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">\${5:Sign in}</button>
  </div>
</header>
\$0`,
  },
  {
    keyword: 'button',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind action button group in React.',
    snippet: `<div className="flex gap-3">
  <button className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white">\${1:Save}</button>
  <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">\${2:Cancel}</button>
</div>
\$0`,
  },
];
