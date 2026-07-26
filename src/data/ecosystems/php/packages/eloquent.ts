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
  {
    keyword: 'relation',
    ecosystem: 'eloquent',
    description: 'Create an Eloquent has-many relationship.',
    snippet: `public function \${1:orders}(): HasMany
{
    return \$this->hasMany(\${2:Order}::class);
}
\$0`,
  },
  {
    keyword: 'casts',
    ecosystem: 'eloquent',
    description: 'Define Eloquent attribute casts.',
    snippet: `protected function casts(): array
{
    return [
        '\${1:email_verified_at}' => 'datetime',
        '\${2:meta}' => 'array',
        '\${3:is_active}' => 'boolean',
    ];
}
\$0`,
  },
  {
    keyword: 'query',
    ecosystem: 'eloquent',
    description: 'Create an Eloquent query chain with eager loading.',
    snippet: `\${1:User}::query()
    ->with(['\${2:orders}'])
    ->where('\${3:is_active}', true)
    ->latest()
    ->paginate(\${4:15});
\$0`,
  },
  {
    keyword: 'create',
    ecosystem: 'eloquent',
    description: 'Create a record with Eloquent.',
    snippet: `\${1:User}::create([
    '\${2:name}' => \${3:'Ada Lovelace'},
    '\${4:email}' => \${5:'ada@example.com'},
]);
\$0`,
  },
  {
    keyword: 'belongsto',
    ecosystem: 'eloquent',
    description: 'Create an Eloquent belongsTo relationship.',
    snippet: `public function \${1:user}(): BelongsTo
{
    return \$this->belongsTo(\${2:User}::class);
}
\$0`,
  },
];
