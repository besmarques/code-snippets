import type { LanguageCommandDefinition } from '../../../../types';

export const TS_PRISMA_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'findmany',
    ecosystem: 'prisma',
    description: 'Query records with Prisma findMany.',
    snippet: `const \${1:users} = await prisma.\${2:user}.findMany({
  where: {
    \${3:active}: \${4:true},
  },
  orderBy: {
    \${5:createdAt}: '\${6:desc}',
  },
});
\$0`,
  },
];
