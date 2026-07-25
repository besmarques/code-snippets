import type { LanguageCommandDefinition } from '../../../../types';

export const JS_DOTENV_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'config',
    ecosystem: 'dotenv',
    description: 'Load environment variables with dotenv.',
    snippet: `import 'dotenv/config';

const \${1:port} = process.env.\${2:PORT} ?? '\${3:3000}';
\$0`,
  },
];
