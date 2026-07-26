import type { LanguageCommandDefinition } from '../../../../types';

export const TS_TYPEORM_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'entity',
    ecosystem: 'typeorm',
    description: 'Create a TypeORM entity class.',
    snippet: `import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: '\${1:users}' })
export class \${2:User} {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  \${3:name}!: string;
}
\$0`,
  },
  {
    keyword: 'repository',
    ecosystem: 'typeorm',
    description: 'Read records from a TypeORM repository.',
    snippet: `const \${1:userRepository} = \${2:dataSource}.getRepository(\${3:User});

const \${4:users} = await \${1}.find({
  where: {
    \${5:active}: true,
  },
  order: {
    \${6:createdAt}: 'DESC',
  },
});
\$0`,
  },
  {
    keyword: 'querybuilder',
    ecosystem: 'typeorm',
    description: 'Build a TypeORM query with joins and filters.',
    snippet: `const \${1:users} = await \${2:dataSource}
  .getRepository(\${3:User})
  .createQueryBuilder('\${4:user}')
  .leftJoinAndSelect('\${4}.\${5:profile}', '\${6:profile}')
  .where('\${4}.\${7:active} = :active', { active: true })
  .orderBy('\${4}.\${8:createdAt}', 'DESC')
  .getMany();
\$0`,
  },
];
