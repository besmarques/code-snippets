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
  {
    keyword: 'required',
    ecosystem: 'dotenv',
    description: 'Load dotenv and fail fast when a required env var is missing.',
    snippet: `import 'dotenv/config';

const \${1:databaseUrl} = process.env.\${2:DATABASE_URL};

if (!\${1}) {
  throw new Error('Missing required env var: \${2:DATABASE_URL}');
}
\$0`,
  },
];
