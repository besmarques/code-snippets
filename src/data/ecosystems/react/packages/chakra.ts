import type { LanguageCommandDefinition } from '../../../../types';

export const REACT_CHAKRA_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'field',
    ecosystem: 'chakra',
    description: 'Create a Chakra UI field group.',
    snippet: `import { Field, Input, Stack } from '@chakra-ui/react';

<Stack gap="\${1:4}">
  <Field.Root>
    <Field.Label>\${2:Email}</Field.Label>
    <Input placeholder="\${3:you@example.com}" />
  </Field.Root>
</Stack>
\$0`,
  },
];
