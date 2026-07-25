import type { LanguageCommandDefinition } from '../../../../types';

export const JAVA_JDBC_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'query',
    ecosystem: 'jdbc',
    description: 'Run a JDBC SELECT query with a prepared statement.',
    snippet: `String sql = "SELECT id, name FROM users WHERE status = ?";

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, "\${1:active}");

    try (ResultSet resultSet = statement.executeQuery()) {
        while (resultSet.next()) {
            String \${2:name} = resultSet.getString("\${3:name}");
        }
    }
}
\$0`,
  },
  {
    keyword: 'update',
    ecosystem: 'jdbc',
    description: 'Run a JDBC UPDATE statement.',
    snippet: `String sql = "UPDATE users SET status = ? WHERE id = ?";

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, "\${1:inactive}");
    statement.setLong(2, \${2:userId});

    int \${3:updatedRows} = statement.executeUpdate();
}
\$0`,
  },
];
