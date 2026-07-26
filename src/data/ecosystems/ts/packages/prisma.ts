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
  {
    keyword: 'create',
    ecosystem: 'prisma',
    description: 'Create a record with Prisma.',
    snippet: `const \${1:user} = await prisma.\${2:user}.create({
  data: {
    \${3:name}: \${4:'Ada Lovelace'},
    \${5:email}: \${6:'ada@example.com'},
  },
});
\$0`,
  },
  {
    keyword: 'transaction',
    ecosystem: 'prisma',
    description: 'Run multiple Prisma operations inside a transaction.',
    snippet: `const [\${1:user}, \${2:profile}] = await prisma.$transaction([
  prisma.\${3:user}.create({
    data: {
      \${4:name}: \${5:'Ada Lovelace'},
    },
  }),
  prisma.\${6:profile}.create({
    data: {
      \${7:bio}: \${8:'First programmer'},
    },
  }),
]);
\$0`,
  },
];
