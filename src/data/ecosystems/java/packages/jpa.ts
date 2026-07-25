import type { LanguageCommandDefinition } from '../../../../types';

export const JAVA_JPA_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'entity',
    ecosystem: 'jpa',
    description: 'Create a JPA entity with generated id fields.',
    snippet: `@Entity
@Table(name = "\${1:users}")
public class \${2:User} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String \${3:name};
}
\$0`,
  },
  {
    keyword: 'repository',
    ecosystem: 'jpa',
    description: 'Create a Spring Data JPA repository interface.',
    snippet: `public interface \${1:UserRepository} extends JpaRepository<\${2:User}, \${3:Long}> {
    Optional<\${2}> findBy\${4:Email}(String \${5:email});
}
\$0`,
  },
];
