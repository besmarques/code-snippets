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
  {
    keyword: 'navbar',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind navigation bar in plain HTML.',
    snippet: `<header class="border-b border-slate-200 bg-white">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="#" class="text-lg font-semibold text-slate-900">\${1:Brand}</a>
    <nav class="hidden gap-6 md:flex" aria-label="\${2:Primary}">
      <a href="#" class="text-sm font-medium text-slate-600">\${3:Features}</a>
      <a href="#" class="text-sm font-medium text-slate-600">\${4:Pricing}</a>
      <a href="#" class="text-sm font-medium text-slate-600">\${5:Docs}</a>
    </nav>
    <a href="#" class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">\${6:Sign in}</a>
  </div>
</header>
\$0`,
  },
  {
    keyword: 'form',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind form card in plain HTML.',
    snippet: `<form class="mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <div>
    <label for="\${1:email}" class="block text-sm font-medium text-slate-700">\${2:Email}</label>
    <input id="\${1}" type="email" class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-0" />
  </div>
  <div>
    <label for="\${3:message}" class="block text-sm font-medium text-slate-700">\${4:Message}</label>
    <textarea id="\${3}" rows="4" class="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-0"></textarea>
  </div>
  <button type="submit" class="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">\${5:Send message}</button>
</form>
\$0`,
  },
  {
    keyword: 'pricing',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind pricing card in plain HTML.',
    snippet: `<section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
  <p class="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">\${1:Pro}</p>
  <h2 class="mt-4 text-3xl font-semibold text-slate-900">\${2:$29}<span class="text-base font-medium text-slate-500">/month</span></h2>
  <p class="mt-3 text-sm leading-6 text-slate-600">\${3:For teams that need more usage and support.}</p>
  <ul class="mt-6 space-y-3 text-sm text-slate-700">
    <li>\${4:Unlimited projects}</li>
    <li>\${5:Priority support}</li>
    <li>\${6:Team analytics}</li>
  </ul>
  <a href="#" class="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">\${7:Choose plan}</a>
</section>
\$0`,
  },
  {
    keyword: 'cta',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind call-to-action block in plain HTML.',
    snippet: `<section class="rounded-[2rem] bg-sky-600 px-8 py-10 text-white">
  <div class="max-w-3xl">
    <p class="text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">\${1:Ready when you are}</p>
    <h2 class="mt-4 text-3xl font-semibold">\${2:Launch your next release with more confidence.}</h2>
    <p class="mt-4 text-base text-sky-50">\${3:Short supporting message for the action area.}</p>
    <div class="mt-8 flex flex-wrap gap-4">
      <a href="#" class="rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-700">\${4:Start free}</a>
      <a href="#" class="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white">\${5:Talk to sales}</a>
    </div>
  </div>
</section>
\$0`,
  },
  {
    keyword: 'grid',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind responsive card grid in plain HTML.',
    snippet: `<section class="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-3">
  <article class="rounded-3xl border border-slate-200 bg-white p-6">\${1:Card one}</article>
  <article class="rounded-3xl border border-slate-200 bg-white p-6">\${2:Card two}</article>
  <article class="rounded-3xl border border-slate-200 bg-white p-6">\${3:Card three}</article>
</section>
\$0`,
  },
  {
    keyword: 'stats',
    ecosystem: 'tailwind',
    description: 'Create a Tailwind stats strip in plain HTML.',
    snippet: `<section class="grid gap-6 rounded-[2rem] bg-slate-950 px-8 py-10 text-white md:grid-cols-3">
  <div>
    <p class="text-sm text-slate-400">\${1:Revenue}</p>
    <p class="mt-2 text-3xl font-semibold">\${2:$240k}</p>
  </div>
  <div>
    <p class="text-sm text-slate-400">\${3:Customers}</p>
    <p class="mt-2 text-3xl font-semibold">\${4:1,240}</p>
  </div>
  <div>
    <p class="text-sm text-slate-400">\${5:Uptime}</p>
    <p class="mt-2 text-3xl font-semibold">\${6:99.99%}</p>
  </div>
</section>
\$0`,
  },
];
