import type { LanguageCommandDefinition } from '../../../../types';

export const TS_DRIZZLE_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'select',
    ecosystem: 'drizzle',
    description: 'Select rows with the Drizzle query builder.',
    snippet: `import { eq } from 'drizzle-orm';

const \${1:users} = await db
  .select()
  .from(\${2:users})
  .where(eq(\${2}.\${3:active}, \${4:true}));
\$0`,
  },
];
