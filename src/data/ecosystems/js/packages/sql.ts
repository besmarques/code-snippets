import type { LanguageCommandDefinition } from '../../../../types';

export const JS_SQL_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'select',
    ecosystem: 'sql',
    description: 'Create a parameterized SQL SELECT query string.',
    snippet: `const \${1:query} = \`
SELECT \${2:id}, \${3:name}
FROM \${4:users}
WHERE \${5:status} = ?
ORDER BY \${6:created_at} DESC
\`;

const \${7:params} = [\${8:'active'}];
\$0`,
  },
  {
    keyword: 'insert',
    ecosystem: 'sql',
    description: 'Create a parameterized SQL INSERT query string.',
    snippet: `const \${1:query} = \`
INSERT INTO \${2:users} (\${3:name}, \${4:email})
VALUES (?, ?)
\`;

const \${5:params} = [\${6:name}, \${7:email}];
\$0`,
  },
];
