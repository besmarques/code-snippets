import type { LanguageCommandDefinition } from '../../../../types';

export const REACT_MUI_COMMANDS: readonly LanguageCommandDefinition[] = [
  {
    keyword: 'button',
    ecosystem: 'mui',
    description: 'Create a Material UI button with an icon.',
    snippet: `import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';

<Button variant="contained" startIcon={<SaveIcon />} onClick={\${1:handleSave}}>
  \${2:Save}
</Button>
\$0`,
  },
];
