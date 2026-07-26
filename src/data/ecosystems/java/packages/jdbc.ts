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
    keyword: 'insert',
    ecosystem: 'jdbc',
    description: 'Run a JDBC INSERT statement with generated keys.',
    snippet: `String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    statement.setString(1, \${1:user}.getName());
    statement.setString(2, \${1}.getEmail());

    int \${2:insertedRows} = statement.executeUpdate();

    try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
        if (generatedKeys.next()) {
            long \${3:newUserId} = generatedKeys.getLong(1);
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
  {
    keyword: 'batch',
    ecosystem: 'jdbc',
    description: 'Run a JDBC batch insert or update.',
    snippet: `String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    for (\${1:User} \${2:user} : \${3:users}) {
        statement.setString(1, \${2}.getName());
        statement.setString(2, \${2}.getEmail());
        statement.addBatch();
    }

    int[] \${4:results} = statement.executeBatch();
}
\$0`,
  },
  {
    keyword: 'transaction',
    ecosystem: 'jdbc',
    description: 'Run multiple JDBC statements inside one transaction.',
    snippet: `try (Connection connection = dataSource.getConnection()) {
    connection.setAutoCommit(false);

    try (PreparedStatement statement = connection.prepareStatement("UPDATE accounts SET balance = balance - ? WHERE id = ?")) {
        statement.setBigDecimal(1, \${1:amount});
        statement.setLong(2, \${2:fromAccountId});
        statement.executeUpdate();
    }

    try (PreparedStatement statement = connection.prepareStatement("UPDATE accounts SET balance = balance + ? WHERE id = ?")) {
        statement.setBigDecimal(1, \${1});
        statement.setLong(2, \${3:toAccountId});
        statement.executeUpdate();
    }

    connection.commit();
} catch (SQLException \${4:error}) {
    throw \${4};
}
\$0`,
  },
  {
    keyword: 'delete',
    ecosystem: 'jdbc',
    description: 'Run a JDBC DELETE statement.',
    snippet: `String sql = "DELETE FROM users WHERE id = ?";

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setLong(1, \${1:userId});

    int \${2:deletedRows} = statement.executeUpdate();
}
\$0`,
  },
  {
    keyword: 'call',
    ecosystem: 'jdbc',
    description: 'Call a stored procedure with JDBC.',
    snippet: `try (Connection connection = dataSource.getConnection();
     CallableStatement statement = connection.prepareCall("{ call \${1:refresh_user_stats}(?) }")) {
    statement.setLong(1, \${2:userId});
    statement.execute();
}
\$0`,
  },
];
