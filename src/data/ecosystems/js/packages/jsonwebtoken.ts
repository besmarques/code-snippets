import type { LanguageCommandDefinition } from '../../../../types';

export const JS_JSONWEBTOKEN_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'sign',
    ecosystem: 'jsonwebtoken',
    description: 'Sign a JSON Web Token with jsonwebtoken.',
    snippet: `import jwt from 'jsonwebtoken';

const \${1:token} = jwt.sign(
  { \${2:userId}: \${3:user.id} },
  process.env.\${4:JWTSECRET} ?? '\${5:dev-secret}',
  { expiresIn: '\${6:1h}' },
);
\$0`,
  },
  {
    keyword: 'verify',
    ecosystem: 'jsonwebtoken',
    description: 'Verify and decode a JSON Web Token.',
    snippet: `import jwt from 'jsonwebtoken';

const \${1:payload} = jwt.verify(
  \${2:token},
  process.env.\${3:JWTSECRET} ?? '\${4:dev-secret}',
);
\$0`,
  },
  {
    keyword: 'middleware',
    ecosystem: 'jsonwebtoken',
    description: 'Create a JWT auth middleware for Express.',
    snippet: `import jwt from 'jsonwebtoken';

const \${1:authorization} = req.headers.authorization;
const \${2:token} = \${1:authorization}?.replace('Bearer ', '');

if (!\${2}) {
  return res.status(401).json({ message: 'Missing token.' });
}

const \${3:payload} = jwt.verify(
  \${2},
  process.env.\${4:JWTSECRET} ?? '\${5:dev-secret}',
);
\$0`,
  },
];
