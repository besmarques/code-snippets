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
  {
    keyword: 'query',
    ecosystem: 'jpa',
    description: 'Create a custom Spring Data JPA query method.',
    snippet: `@Query("""
    select \${1:u}
    from \${2:User} \${1}
    where \${1}.\${3:status} = :\${3}
    order by \${1}.\${4:createdAt} desc
    """)
List<\${2}> \${5:findRecentByStatus}(@Param("\${3}") \${6:String} \${3});
\$0`,
  },
  {
    keyword: 'onetomany',
    ecosystem: 'jpa',
    description: 'Create a JPA one-to-many relationship mapping.',
    snippet: `@OneToMany(mappedBy = "\${1:user}", cascade = CascadeType.ALL, orphanRemoval = true)
private List<\${2:Order}> \${3:orders} = new ArrayList<>();
\$0`,
  },
  {
    keyword: 'manytoone',
    ecosystem: 'jpa',
    description: 'Create a JPA many-to-one relationship mapping.',
    snippet: `@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "\${1:user_id}", nullable = false)
private \${2:User} \${3:user};
\$0`,
  },
  {
    keyword: 'manytomany',
    ecosystem: 'jpa',
    description: 'Create a JPA many-to-many relationship mapping.',
    snippet: `@ManyToMany
@JoinTable(
    name = "\${1:user_roles}",
    joinColumns = @JoinColumn(name = "\${2:user_id}"),
    inverseJoinColumns = @JoinColumn(name = "\${3:role_id}")
)
private Set<\${4:Role}> \${5:roles} = new HashSet<>();
\$0`,
  },
  {
    keyword: 'projection',
    ecosystem: 'jpa',
    description: 'Create a Spring Data JPA projection interface.',
    snippet: `public interface \${1:UserSummary} {
    \${2:Long} get\${3:Id}();
    \${4:String} get\${5:Name}();
    \${6:String} get\${7:Email}();
}
\$0`,
  },
];
