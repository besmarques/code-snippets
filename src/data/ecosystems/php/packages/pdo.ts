import type { LanguageCommandDefinition } from '../../../../types';

export const PHP_PDO_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'query',
    ecosystem: 'pdo',
    description: 'Run a prepared query with PDO.',
    snippet: `\$pdo = new PDO(\${1:'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4'}, \${2:'root'}, \${3:''});
\$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

\$statement = \$pdo->prepare('SELECT * FROM users WHERE id = :id');
\$statement->execute(['id' => \${4:1}]);
\$user = \$statement->fetch(PDO::FETCH_ASSOC);
\$0`,
  },
];
