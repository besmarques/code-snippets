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
  {
    keyword: 'insert',
    ecosystem: 'pdo',
    description: 'Insert a row with PDO and read the new id.',
    snippet: `\$pdo = new PDO(\${1:'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4'}, \${2:'root'}, \${3:''});
\$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

\$statement = \$pdo->prepare('INSERT INTO users (name, email) VALUES (:name, :email)');
\$statement->execute([
    'name' => \${4:'Ada Lovelace'},
    'email' => \${5:'ada@example.com'},
]);

\$userId = \$pdo->lastInsertId();
\$0`,
  },
  {
    keyword: 'update',
    ecosystem: 'pdo',
    description: 'Run an update statement with PDO.',
    snippet: `\$pdo = new PDO(\${1:'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4'}, \${2:'root'}, \${3:''});
\$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

\$statement = \$pdo->prepare('UPDATE users SET status = :status WHERE id = :id');
\$statement->execute([
    'status' => \${4:'inactive'},
    'id' => \${5:1},
]);
\$0`,
  },
  {
    keyword: 'transaction',
    ecosystem: 'pdo',
    description: 'Run multiple PDO statements inside one transaction.',
    snippet: `\$pdo = new PDO(\${1:'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4'}, \${2:'root'}, \${3:''});
\$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    \$pdo->beginTransaction();

    \$debit = \$pdo->prepare('UPDATE accounts SET balance = balance - :amount WHERE id = :id');
    \$debit->execute([
        'amount' => \${4:100},
        'id' => \${5:1},
    ]);

    \$credit = \$pdo->prepare('UPDATE accounts SET balance = balance + :amount WHERE id = :id');
    \$credit->execute([
        'amount' => \${4},
        'id' => \${6:2},
    ]);

    \$pdo->commit();
} catch (Throwable \${7:error}) {
    \$pdo->rollBack();
    throw \${7};
}
\$0`,
  },
  {
    keyword: 'delete',
    ecosystem: 'pdo',
    description: 'Delete a row with PDO.',
    snippet: `\$pdo = new PDO(\${1:'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4'}, \${2:'root'}, \${3:''});
\$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

\$statement = \$pdo->prepare('DELETE FROM users WHERE id = :id');
\$statement->execute([
    'id' => \${4:1},
]);
\$0`,
  },
  {
    keyword: 'fetchall',
    ecosystem: 'pdo',
    description: 'Fetch many rows with PDO.',
    snippet: `\$pdo = new PDO(\${1:'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4'}, \${2:'root'}, \${3:''});
\$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

\$statement = \$pdo->query('SELECT id, name FROM users ORDER BY created_at DESC');
\$users = \$statement->fetchAll(PDO::FETCH_ASSOC);
\$0`,
  },
];
