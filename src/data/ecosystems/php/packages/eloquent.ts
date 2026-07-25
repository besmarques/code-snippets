import type { LanguageCommandDefinition } from '../../../../types';

export const PHP_ELOQUENT_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'model',
    ecosystem: 'eloquent',
    description: 'Create a Laravel Eloquent model.',
    snippet: `use Illuminate\\Database\\Eloquent\\Model;

class \${1:User} extends Model
{
    protected \$fillable = [
        '\${2:name}',
        '\${3:email}',
    ];
}
\$0`,
  },
  {
    keyword: 'scope',
    ecosystem: 'eloquent',
    description: 'Create a reusable local Eloquent scope.',
    snippet: `public function scope\${1:Active}(Builder \$query): Builder
{
    return \$query->where('\${2:is_active}', true);
}
\$0`,
  },
];
