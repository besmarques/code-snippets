import type { LanguageCatalog } from '../../../types';

import { HTML_BOOTSTRAP_COMMANDS } from './packages/bootstrap';
import { HTML_TAILWIND_COMMANDS } from './packages/tailwind';

export const HTML_CATALOG: LanguageCatalog = {
  language: 'html',
  commands: [
    {
      keyword: 'page',
      description: 'Create a complete HTML5 page scaffold.',
      snippet: `<!DOCTYPE html>
<html lang="\${1:en}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>\${2:Document}</title>
</head>
<body>
  \${3:<main></main>}
</body>
</html>
\$0`,
    },
    {
      keyword: 'section',
      description: 'Create a semantic HTML section block.',
      snippet: `<section aria-labelledby="\${1:section-title}">
  <h2 id="\${1}">\${2:Section title}</h2>
  <p>\${3:Section content}</p>
</section>
\$0`,
    },
    {
      keyword: 'nav',
      description: 'Create a semantic navigation block.',
      snippet: `<nav aria-label="\${1:Primary}">
  <ul>
    <li><a href="#">\${2:Home}</a></li>
    <li><a href="#">\${3:About}</a></li>
    <li><a href="#">\${4:Contact}</a></li>
  </ul>
</nav>
\$0`,
    },
    {
      keyword: 'form',
      description: 'Create a semantic HTML form layout.',
      snippet: `<form action="\${1:/submit}" method="\${2:post}">
  <label for="\${3:email}">\${4:Email}</label>
  <input id="\${3}" name="\${3}" type="email" required />

  <button type="submit">\${5:Submit}</button>
</form>
\$0`,
    },
    {
      keyword: 'table',
      description: 'Create an accessible HTML table scaffold.',
      snippet: `<table>
  <caption>\${1:Table caption}</caption>
  <thead>
    <tr>
      <th scope="col">\${2:Name}</th>
      <th scope="col">\${3:Email}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\${4:Ada Lovelace}</td>
      <td>\${5:ada@example.com}</td>
    </tr>
  </tbody>
</table>
\$0`,
    },
    ...HTML_BOOTSTRAP_COMMANDS,
    ...HTML_TAILWIND_COMMANDS,
  ],
};
