import type { LanguageCommandDefinition } from '../../../../types';

export const REACT_SHADCN_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'card',
    ecosystem: 'shadcn',
    description: 'Create a shadcn/ui card layout.',
    snippet: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>\${1:Card title}</CardTitle>
    <CardDescription>\${2:Short supporting text}</CardDescription>
  </CardHeader>
  <CardContent>\${3:Content}</CardContent>
</Card>
\$0`,
  },
  {
    keyword: 'dialog',
    ecosystem: 'shadcn',
    description: 'Create a shadcn/ui dialog scaffold.',
    snippet: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger>\${1:Open dialog}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>\${2:Dialog title}</DialogTitle>
      <DialogDescription>\${3:Supporting description}</DialogDescription>
    </DialogHeader>
    \${4:Dialog content}
  </DialogContent>
</Dialog>
\$0`,
  },
  {
    keyword: 'button',
    ecosystem: 'shadcn',
    description: 'Create a shadcn/ui button row.',
    snippet: `import { Button } from '@/components/ui/button';

<div className="flex gap-3">
  <Button>\${1:Save}</Button>
  <Button variant="outline">\${2:Cancel}</Button>
</div>
\$0`,
  },
];
