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
  {
    keyword: 'insert',
    ecosystem: 'drizzle',
    description: 'Insert a row with Drizzle and return the created record.',
    snippet: `const [\${1:createdUser}] = await db
  .insert(\${2:users})
  .values({
    \${3:name}: \${4:'Ada Lovelace'},
    \${5:email}: \${6:'ada@example.com'},
  })
  .returning();
\$0`,
  },
  {
    keyword: 'transaction',
    ecosystem: 'drizzle',
    description: 'Run multiple statements inside a Drizzle transaction.',
    snippet: `await db.transaction(async (\${1:tx}) => {
  await \${1}.insert(\${2:accounts}).values({
    \${3:name}: \${4:'Operating'},
  });

  await \${1}.update(\${2}).set({
    \${5:updatedAt}: new Date(),
  });
});
\$0`,
  },
];
