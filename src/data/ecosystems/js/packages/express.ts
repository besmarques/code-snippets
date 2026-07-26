import type { LanguageCommandDefinition } from '../../../../types';

export const JS_EXPRESS_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'get',
    ecosystem: 'express',
    description: 'Create an Express GET route handler.',
    snippet: `app.get('/\${1:users}', async (req, res) => {
  try {
    const \${2:items} = await \${3:userService}.list();
    res.json(\${2});
  } catch (\${4:error}) {
    res.status(500).json({ message: \${4}.message });
  }
});
\$0`,
  },
  {
    keyword: 'post',
    ecosystem: 'express',
    description: 'Create an Express POST route handler.',
    snippet: `app.post('/\${1:users}', async (req, res) => {
  try {
    const \${2:createdUser} = await \${3:userService}.create(req.body);
    res.status(201).json(\${2});
  } catch (\${4:error}) {
    res.status(500).json({ message: \${4}.message });
  }
});
\$0`,
  },
  {
    keyword: 'router',
    ecosystem: 'express',
    description: 'Create an Express router module.',
    snippet: `import { Router } from 'express';

const \${1:router} = Router();

\${1}.get('/\${2:users}', async (req, res) => {
  res.json({ \${3:ok}: true });
});

export default \${1};
\$0`,
  },
  {
    keyword: 'middleware',
    ecosystem: 'express',
    description: 'Create an Express middleware function.',
    snippet: `app.use(async (req, res, next) => {
  try {
    \${1:req.context} = await \${2:loadContext}(req);
    next();
  } catch (\${3:error}) {
    next(\${3});
  }
});
\$0`,
  },
];
