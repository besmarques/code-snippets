import type { LanguageCommandDefinition } from '../../../../types';

export const JS_AXIOS_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'get',
    ecosystem: 'axios',
    description: 'Fetch data with axios in JavaScript.',
    snippet: `import axios from 'axios';

const { data } = await axios.get('\${1:https://api.example.com/items}', {
  params: {
    \${2:page}: \${3:1},
  },
});
\$0`,
  },
  {
    keyword: 'post',
    ecosystem: 'axios',
    description: 'Send JSON data with axios.post in JavaScript.',
    snippet: `import axios from 'axios';

const { data } = await axios.post('\${1:https://api.example.com/items}', {
  \${2:name}: \${3:'Ada Lovelace'},
  \${4:email}: \${5:'ada@example.com'},
});
\$0`,
  },
  {
    keyword: 'instance',
    ecosystem: 'axios',
    description: 'Create a reusable axios client instance.',
    snippet: `import axios from 'axios';

const \${1:api} = axios.create({
  baseURL: '\${2:https://api.example.com}',
  timeout: \${3:5000},
  headers: {
    Accept: 'application/json',
  },
});
\$0`,
  },
];
