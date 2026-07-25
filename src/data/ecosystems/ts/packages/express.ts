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
];
