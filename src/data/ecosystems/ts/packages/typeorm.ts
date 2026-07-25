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
];
