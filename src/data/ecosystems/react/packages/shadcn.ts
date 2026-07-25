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
];
