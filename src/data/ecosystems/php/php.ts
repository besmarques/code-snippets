import type { LanguageCatalog } from '../../../types';

import { PHP_ELOQUENT_COMMANDS } from './packages/eloquent';
import { PHP_PDO_COMMANDS } from './packages/pdo';

export const PHP_CATALOG: LanguageCatalog = {
  language: 'php',
  commands: [
    {
      keyword: 'function',
      description: 'Create a typed PHP function.',
      snippet: `function \${1:formatUser}(array \$user): string
{
    return \$user['\${2:name}'] ?? '';
}
\$0`,
    },
    {
      keyword: 'class',
      description: 'Create a PHP class with a constructor-promoted property.',
      snippet: `class \${1:Example}
{
    public function __construct(
        private string \$name
    ) {
    }
}
\$0`,
    },
    {
      keyword: 'trait',
      description: 'Create a PHP trait.',
      snippet: `trait \${1:LogsMessages}
{
    protected function \${2:logMessage}(string \$message): void
    {
        error_log(\$message);
    }
}
\$0`,
    },
    {
      keyword: 'interface',
      description: 'Create a PHP interface.',
      snippet: `interface \${1:UserRepository}
{
    public function \${2:findById}(int \$id): ?array;
}
\$0`,
    },
    {
      keyword: 'namespace',
      description: 'Declare a PHP namespace and import a dependency.',
      snippet: `namespace \${1:App\\Services};

use \${2:RuntimeException};

\$0`,
    },
    {
      keyword: 'arraymap',
      description: 'Transform an array with array_map.',
      snippet: `\$result = array_map(
    fn (array \$item) => \$item['\${1:name}'],
    \$items,
);
\$0`,
    },
    {
      keyword: 'foreach',
      description: 'Loop through items with foreach.',
      snippet: `foreach (\$items as \$item) {
    \${1:// ...}
}
\$0`,
    },
    {
      keyword: 'loop',
      description: 'Loop through a collection with foreach.',
      snippet: `foreach (\$items as \$item) {
    \${1:// ...}
}
\$0`,
    },
    {
      keyword: 'match',
      description: 'Create a PHP match expression.',
      snippet: `\$label = match (\$status) {
    '\${1:idle}' => '\${2:Idle}',
    '\${3:success}' => '\${4:Success}',
    default => '\${5:Unknown}',
};
\$0`,
    },
    {
      keyword: 'trycatch',
      description: 'Wrap code in a PHP try/catch block.',
      snippet: `try {
    \${1:// risky operation}
} catch (\${2:Throwable} \$error) {
    error_log(\$error->getMessage());
}
\$0`,
    },
    {
      keyword: 'fetch',
      description: 'Request JSON in PHP and decode it into an associative array.',
      snippet: `\$response = file_get_contents(\${1:'https://api.example.com/items'});

if (\$response === false) {
    throw new RuntimeException('Request failed.');
}

\$data = json_decode(\$response, true, 512, JSON_THROW_ON_ERROR);
\$0`,
    },
    {
      keyword: 'request',
      description: 'Send an HTTP request with cURL.',
      snippet: `\$ch = curl_init(\${1:'https://api.example.com/items'});

curl_setopt_array(\$ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);

\$response = curl_exec(\$ch);

if (\$response === false) {
    throw new RuntimeException(curl_error(\$ch));
}

curl_close(\$ch);
\$0`,
    },
    {
      keyword: 'json',
      description: 'Encode and decode JSON in PHP.',
      snippet: `\$payload = ['\${1:name}' => \${2:'Ada'}];
\$json = json_encode(\$payload, JSON_THROW_ON_ERROR);
\$data = json_decode(\$json, true, 512, JSON_THROW_ON_ERROR);
\$0`,
    },
    {
      keyword: 'session',
      description: 'Start a session and read or write session data.',
      snippet: `if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

\$_SESSION['\${1:user_id}'] = \${2:1};
\$userId = \$_SESSION['\${1}'] ?? null;
\$0`,
    },
    {
      keyword: 'middleware',
      description: 'Create a simple middleware-style handler.',
      snippet: `function \${1:handle}(\$request, callable \$next)
{
    if (!\$request->user()) {
        throw new RuntimeException('Unauthorized');
    }

    return \$next(\$request);
}
\$0`,
    },
    ...PHP_ELOQUENT_COMMANDS,
    ...PHP_PDO_COMMANDS,
  ],
};
