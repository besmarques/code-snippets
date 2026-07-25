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
];
