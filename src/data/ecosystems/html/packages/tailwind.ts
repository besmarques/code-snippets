import type { LanguageCommandDefinition } from '../../../../types';

export const HTML_TAILWIND_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'hero',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind hero section in plain HTML.',
    snippet: `<section class="bg-slate-950 text-white">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">\${1:New release}</p>
    <h1 class="mt-6 max-w-3xl text-5xl font-semibold leading-tight">\${2:Build clean interfaces faster.}</h1>
    <p class="mt-6 max-w-2xl text-lg text-slate-300">\${3:Write a short supporting paragraph that explains the value proposition.}</p>
    <div class="mt-10 flex gap-4">
      <a href="#" class="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">\${4:Get started}</a>
      <a href="#" class="rounded-full border border-white/20 px-5 py-3 font-medium text-white">\${5:See examples}</a>
    </div>
  </div>
</section>
\$0`,
  },
  {
    keyword: 'card',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind card layout in plain HTML.',
    snippet: `<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">\${1:Category}</p>
  <h2 class="mt-4 text-2xl font-semibold text-slate-900">\${2:Card title}</h2>
  <p class="mt-3 text-sm leading-6 text-slate-600">\${3:Card description goes here.}</p>
  <a href="#" class="mt-6 inline-flex text-sm font-semibold text-sky-600">\${4:Read more}</a>
</article>
\$0`,
  },
];
