import type { LanguageCatalog } from '../../../types';

import { TS_DRIZZLE_COMMANDS } from './packages/drizzle';
import { TS_EXPRESS_COMMANDS } from './packages/express';
import { TS_PRISMA_COMMANDS } from './packages/prisma';
import { TS_TYPEORM_COMMANDS } from './packages/typeorm';
import { TS_ZOD_COMMANDS } from './packages/zod';

export const TS_CATALOG: LanguageCatalog = {
  language: 'ts',
  commands: [
    {
      keyword: 'type',
      description: 'Create a TypeScript type alias.',
      snippet: `type \${1:User} = {
  \${2:id}: \${3:string};
  \${4:name}: \${5:string};
};
\$0`,
    },
    {
      keyword: 'interface',
      description: 'Create a TypeScript interface.',
      snippet: `interface \${1:User} {
  \${2:id}: \${3:string};
  \${4:name}: \${5:string};
}
\$0`,
    },
    {
      keyword: 'enum',
      description: 'Create a TypeScript string enum.',
      snippet: `enum \${1:Status} {
  \${2:Idle} = '\${3:idle}',
  \${4:Loading} = '\${5:loading}',
  \${6:Success} = '\${7:success}',
  \${8:Error} = '\${9:error}',
}
\$0`,
    },
    {
      keyword: 'generic',
      description: 'Create a generic TypeScript function.',
      snippet: `function \${1:identity}<\${2:T}>(\${3:value}: \${2}): \${2} {
  return \${3};
}
\$0`,
    },
    {
      keyword: 'union',
      description: 'Create a union type.',
      snippet: `type \${1:Status} = '\${2:idle}' | '\${3:loading}' | '\${4:success}' | '\${5:error}';
\$0`,
    },
    {
      keyword: 'guard',
      description: 'Create a TypeScript type guard.',
      snippet: `function \${1:isUser}(\${2:value}: unknown): \${2} is \${3:User} {
  return typeof \${2} === 'object' && \${2} !== null && '\${4:id}' in \${2};
}
\$0`,
    },
    {
      keyword: 'function',
      description: 'Create a typed TypeScript function.',
      snippet: `function \${1:formatUser}(\${2:user}: \${3:User}): \${4:string} {
  return \${2}.\${5:name};
}
\$0`,
    },
    {
      keyword: 'arrow',
      description: 'Create a typed arrow function.',
      snippet: `const \${1:formatUser} = (\${2:user}: \${3:User}): \${4:string} => {
  return \${2}.\${5:name};
};
\$0`,
    },
    {
      keyword: 'async',
      description: 'Create a typed async TypeScript function.',
      snippet: `async function \${1:loadUser}(\${2:id}: \${3:string}): Promise<\${4:User}> {
  const response = await fetch('/api/users/' + \${2});
  return response.json() as Promise<\${4}>;
}
\$0`,
    },
    {
      keyword: 'promise',
      description: 'Create a typed Promise.',
      snippet: `const \${1:task}: Promise<\${2:string}> = new Promise((resolve, reject) => {
  try {
    resolve(\${3:'done'});
  } catch (\${4:error}) {
    reject(\${4});
  }
});
\$0`,
    },
    {
      keyword: 'map',
      description: 'Map over an array with explicit TypeScript types.',
      snippet: `const \${1:result}: \${2:Output[]} = \${3:items}.map((\${4:item}: \${5:Input}) => {
  return \${6:item};
});
\$0`,
    },
    {
      keyword: 'reduce',
      description: 'Reduce an array with an explicit accumulator type.',
      snippet: `const \${1:total} = \${2:items}.reduce<\${3:number}>((\${4:accumulator}, \${5:item}) => {
  return \${4} + \${5}.\${6:value};
}, \${7:0});
\$0`,
    },
    {
      keyword: 'fetch',
      description: 'Fetch typed JSON data in TypeScript.',
      snippet: `async function \${1:fetchItems}(): Promise<\${2:Item[]}> {
  const response = await fetch(\${3:'\/api\/items'});

  if (!response.ok) {
    throw new Error(\`Request failed: \${response.status}\`);
  }

  return response.json() as Promise<\${2}>;
}
\$0`,
    },
    {
      keyword: 'object',
      description: 'Create a typed object literal.',
      snippet: `const \${1:config}: \${2:Config} = {
  \${3:key}: \${4:value},
};
\$0`,
    },
    {
      keyword: 'response',
      description: 'Create a reusable typed API response shape.',
      snippet: `type \${1:ApiResponse}<\${2:T}> = {
  data: \${2};
  error?: string;
  meta?: {
    total: number;
  };
};
\$0`,
    },
    {
      keyword: 'class',
      description: 'Create a typed TypeScript class.',
      snippet: `class \${1:UserService} {
  constructor(private readonly \${2:baseUrl}: string) {}

  async \${3:getUser}(\${4:id}: string): Promise<\${5:User}> {
    const response = await fetch(this.\${2} + '/' + \${4});
    return response.json() as Promise<\${5}>;
  }
}
\$0`,
    },
    {
      keyword: 'record',
      description: 'Create a typed Record.',
      snippet: `const \${1:labels}: Record<\${2:string}, \${3:string}> = {
  \${4:key}: \${5:value},
};
\$0`,
    },
    {
      keyword: 'partial',
      description: 'Create a Partial type patch object.',
      snippet: `const \${1:patch}: Partial<\${2:User}> = {
  \${3:name}: \${4:'Updated'},
};
\$0`,
    },
    {
      keyword: 'readonlyarray',
      description: 'Create a ReadonlyArray value.',
      snippet: `const \${1:items}: ReadonlyArray<\${2:Item}> = [\${3}];
\$0`,
    },
    {
      keyword: 'tuple',
      description: 'Create a typed tuple.',
      snippet: `const \${1:result}: [\${2:string}, \${3:number}] = [\${4:'ok'}, \${5:200}];
\$0`,
    },
    ...TS_DRIZZLE_COMMANDS,
    ...TS_EXPRESS_COMMANDS,
    ...TS_PRISMA_COMMANDS,
    ...TS_TYPEORM_COMMANDS,
    ...TS_ZOD_COMMANDS,
  ],
};
