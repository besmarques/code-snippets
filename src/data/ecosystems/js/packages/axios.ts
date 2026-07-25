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
];
