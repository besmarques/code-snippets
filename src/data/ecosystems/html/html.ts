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
      keyword: 'header',
      description: 'Create a semantic site header with a title and navigation.',
      snippet: `<header>
  <div>
    <a href="#">\${1:Brand}</a>
    <nav aria-label="\${2:Primary}">
      <ul>
        <li><a href="#">\${3:Home}</a></li>
        <li><a href="#">\${4:About}</a></li>
        <li><a href="#">\${5:Contact}</a></li>
      </ul>
    </nav>
  </div>
</header>
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
      keyword: 'article',
      description: 'Create an article block with heading and metadata.',
      snippet: `<article>
  <header>
    <p>\${1:Category}</p>
    <h2>\${2:Article title}</h2>
    <p><time datetime="\${3:2026-07-26}">\${4:July 26, 2026}</time></p>
  </header>
  <p>\${5:Article summary or opening paragraph.}</p>
</article>
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
      keyword: 'dialog',
      description: 'Create a native dialog scaffold with actions.',
      snippet: `<dialog id="\${1:confirm-dialog}" aria-labelledby="\${2:confirm-title}">
  <h2 id="\${2}">\${3:Confirm action}</h2>
  <p>\${4:Explain what is about to happen.}</p>
  <form method="dialog">
    <button value="cancel">\${5:Cancel}</button>
    <button value="confirm">\${6:Confirm}</button>
  </form>
</dialog>
\$0`,
    },
    {
      keyword: 'details',
      description: 'Create a details and summary disclosure block.',
      snippet: `<details>
  <summary>\${1:More information}</summary>
  <p>\${2:Hidden supporting content goes here.}</p>
</details>
\$0`,
    },
    {
      keyword: 'figure',
      description: 'Create a figure with an image and caption.',
      snippet: `<figure>
  <img src="\${1:https://placehold.co/800x450}" alt="\${2:Descriptive alt text}" />
  <figcaption>\${3:Caption describing the image.}</figcaption>
</figure>
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
    {
      keyword: 'footer',
      description: 'Create a semantic site footer with links and copyright.',
      snippet: `<footer>
  <p>&copy; \${1:2026} \${2:Your company}</p>
  <nav aria-label="\${3:Footer}">
    <ul>
      <li><a href="#">\${4:Privacy}</a></li>
      <li><a href="#">\${5:Terms}</a></li>
      <li><a href="#">\${6:Support}</a></li>
    </ul>
  </nav>
</footer>
\$0`,
    },
    ...HTML_BOOTSTRAP_COMMANDS,
    ...HTML_TAILWIND_COMMANDS,
  ],
};
