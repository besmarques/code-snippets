import type { LanguageCommandDefinition } from '../../../../types';

export const TS_EXPRESS_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'handler',
    ecosystem: 'express',
    description: 'Create a typed Express request handler.',
    snippet: `import type { RequestHandler } from 'express';

const \${1:getUsers}: RequestHandler = async (req, res, next) => {
  try {
    const \${2:users} = await \${3:userService}.list();
    res.json(\${2});
  } catch (\${4:error}) {
    next(\${4});
  }
};
\$0`,
  },
  {
    keyword: 'middleware',
    ecosystem: 'express',
    description: 'Create a typed Express middleware.',
    snippet: `import type { RequestHandler } from 'express';

const \${1:requireAuth}: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  next();
};
\$0`,
  },
  {
    keyword: 'router',
    ecosystem: 'express',
    description: 'Create a typed Express router module.',
    snippet: `import { Router } from 'express';

const \${1:router} = Router();

\${1}.get('/\${2:users}', async (req, res, next) => {
  try {
    const \${3:users} = await \${4:userService}.list();
    res.json(\${3});
  } catch (\${5:error}) {
    next(\${5});
  }
});

export default \${1};
\$0`,
  },
];
