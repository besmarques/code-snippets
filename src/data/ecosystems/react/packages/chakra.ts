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
  {
    keyword: 'dialog',
    ecosystem: 'chakra',
    description: 'Create a Chakra UI dialog scaffold.',
    snippet: `import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>\${1:Open dialog}</Button>
  </Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>\${2:Dialog title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>\${3:Dialog content}</Dialog.Body>
        <Dialog.CloseTrigger asChild>
          <CloseButton size="sm" />
        </Dialog.CloseTrigger>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog.Root>
\$0`,
  },
  {
    keyword: 'button',
    ecosystem: 'chakra',
    description: 'Create a Chakra UI button row.',
    snippet: `import { Button, HStack } from '@chakra-ui/react';

<HStack gap="\${1:3}">
  <Button colorPalette="\${2:blue}">\${3:Save}</Button>
  <Button variant="outline">\${4:Cancel}</Button>
</HStack>
\$0`,
  },
];
