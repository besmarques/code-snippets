import type { LanguageCommandDefinition } from '../../../../types';

export const HTML_BOOTSTRAP_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'navbar',
    ecosystem: 'bootstrap',
    description: 'Create a Bootstrap navbar layout.',
    snippet: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">\${1:Brand}</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#\${2:mainNavbar}"
      aria-controls="\${2}"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="\${2}">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" href="#">\${3:Home}</a></li>
        <li class="nav-item"><a class="nav-link" href="#">\${4:Docs}</a></li>
      </ul>
    </div>
  </div>
</nav>
\$0`,
  },
  {
    keyword: 'card',
    ecosystem: 'bootstrap',
    description: 'Create a Bootstrap card component.',
    snippet: `<div class="card" style="width: 18rem;">
  <img src="\${1:https://placehold.co/600x400}" class="card-img-top" alt="\${2:Card image}" />
  <div class="card-body">
    <h5 class="card-title">\${3:Card title}</h5>
    <p class="card-text">\${4:Short supporting text for the card body.}</p>
    <a href="#" class="btn btn-primary">\${5:Action}</a>
  </div>
</div>
\$0`,
  },
];
