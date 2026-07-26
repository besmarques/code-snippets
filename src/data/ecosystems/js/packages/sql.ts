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
  {
    keyword: 'update',
    ecosystem: 'sql',
    description: 'Create a parameterized SQL UPDATE query string.',
    snippet: `const \${1:query} = \`
UPDATE \${2:users}
SET \${3:status} = ?, \${4:updated_at} = NOW()
WHERE \${5:id} = ?
\`;

const \${6:params} = [\${7:'inactive'}, \${8:userId}];
\$0`,
  },
  {
    keyword: 'join',
    ecosystem: 'sql',
    description: 'Create a SQL JOIN query string.',
    snippet: `const \${1:query} = \`
SELECT \${2:u}.id, \${2:u}.name, \${3:o}.total
FROM \${4:users} \${2:u}
INNER JOIN \${5:orders} \${3:o} ON \${3:o}.\${6:user_id} = \${2:u}.id
WHERE \${2:u}.\${7:active} = ?
\`;

const \${8:params} = [\${9:true}];
\$0`,
  },
];
