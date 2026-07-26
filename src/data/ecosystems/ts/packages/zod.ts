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
  {
    keyword: 'refine',
    ecosystem: 'zod',
    description: 'Create a Zod schema with a custom refinement.',
    snippet: `import { z } from 'zod';

const \${1:passwordSchema} = z
  .string()
  .min(\${2:8})
  .refine((value) => /[A-Z]/.test(value), {
    message: '\${3:Password must include an uppercase letter.}',
  });
\$0`,
  },
  {
    keyword: 'safeparse',
    ecosystem: 'zod',
    description: 'Validate input with Zod safeParse.',
    snippet: `const \${1:result} = \${2:userSchema}.safeParse(\${3:payload});

if (!\${1}.success) {
  return {
    \${4:errors}: \${1}.error.flatten(),
  };
}

const \${5:data} = \${1}.data;
\$0`,
  },
];
