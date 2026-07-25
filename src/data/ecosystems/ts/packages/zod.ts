import type { LanguageCommandDefinition } from '../../../../types';

export const TS_ZOD_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'schema',
    ecosystem: 'zod',
    description: 'Create a Zod object schema with inferred types.',
    snippet: `import { z } from 'zod';

const \${1:userSchema} = z.object({
  \${2:id}: z.string(),
  \${3:name}: z.string().min(\${4:1}),
});

type \${5:User} = z.infer<typeof \${1}>;
\$0`,
  },
  {
    keyword: 'envconfig',
    ecosystem: 'zod',
    description: 'Validate environment variables with Zod.',
    snippet: `import { z } from 'zod';

const \${1:envSchema} = z.object({
  \${2:PORT}: z.coerce.number().default(\${3:3000}),
  \${4:DATABASEURL}: z.string().url(),
});

const \${5:env} = \${1}.parse(process.env);
\$0`,
  },
];
