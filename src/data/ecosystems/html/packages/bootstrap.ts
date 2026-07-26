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
  {
    keyword: 'grid',
    ecosystem: 'bootstrap',
    description: 'Create a Bootstrap responsive grid row.',
    snippet: `<div class="container">
  <div class="row g-4">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="p-3 border rounded">\${1:Column one}</div>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="p-3 border rounded">\${2:Column two}</div>
    </div>
    <div class="col-12 col-lg-4">
      <div class="p-3 border rounded">\${3:Column three}</div>
    </div>
  </div>
</div>
\$0`,
  },
  {
    keyword: 'alert',
    ecosystem: 'bootstrap',
    description: 'Create a dismissible Bootstrap alert.',
    snippet: `<div class="alert alert-\${1:warning} alert-dismissible fade show" role="alert">
  <strong>\${2:Heads up!}</strong> \${3:Short alert message goes here.}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
\$0`,
  },
  {
    keyword: 'modal',
    ecosystem: 'bootstrap',
    description: 'Create a Bootstrap modal scaffold.',
    snippet: `<div class="modal fade" id="\${1:confirmModal}" tabindex="-1" aria-labelledby="\${2:confirmModalLabel}" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="\${2}">\${3:Confirm action}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        \${4:Explain the action or show the form content here.}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\${5:Cancel}</button>
        <button type="button" class="btn btn-primary">\${6:Continue}</button>
      </div>
    </div>
  </div>
</div>
\$0`,
  },
  {
    keyword: 'form',
    ecosystem: 'bootstrap',
    description: 'Create a Bootstrap stacked form layout.',
    snippet: `<form class="row g-3">
  <div class="col-md-6">
    <label for="\${1:firstName}" class="form-label">\${2:First name}</label>
    <input type="text" class="form-control" id="\${1}" />
  </div>
  <div class="col-md-6">
    <label for="\${3:email}" class="form-label">\${4:Email}</label>
    <input type="email" class="form-control" id="\${3}" />
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary">\${5:Submit}</button>
  </div>
</form>
\$0`,
  },
  {
    keyword: 'accordion',
    ecosystem: 'bootstrap',
    description: 'Create a Bootstrap accordion.',
    snippet: `<div class="accordion" id="\${1:faqAccordion}">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#\${2:itemOne}">
        \${3:Accordion title}
      </button>
    </h2>
    <div id="\${2}" class="accordion-collapse collapse show" data-bs-parent="#\${1}">
      <div class="accordion-body">\${4:Accordion content}</div>
    </div>
  </div>
</div>
\$0`,
  },
  {
    keyword: 'badge',
    ecosystem: 'bootstrap',
    description: 'Create Bootstrap badge variants.',
    snippet: `<div class="d-flex gap-2 align-items-center">
  <span class="badge text-bg-primary">\${1:Primary}</span>
  <span class="badge text-bg-success">\${2:Active}</span>
  <span class="badge text-bg-secondary">\${3:Draft}</span>
</div>
\$0`,
  },
];
