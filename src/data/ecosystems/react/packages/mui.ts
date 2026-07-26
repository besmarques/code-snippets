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
  {
    keyword: 'textfield',
    ecosystem: 'mui',
    description: 'Create a Material UI text field with helper text.',
    snippet: `import TextField from '@mui/material/TextField';

<TextField
  label="\${1:Email}"
  type="\${2:email}"
  helperText="\${3:We will never share your email.}"
  fullWidth
/>
\$0`,
  },
  {
    keyword: 'dialog',
    ecosystem: 'mui',
    description: 'Create a Material UI dialog scaffold.',
    snippet: `import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

<Dialog open={\${1:isOpen}} onClose={\${2:handleClose}}>
  <DialogTitle>\${3:Confirm action}</DialogTitle>
  <DialogContent>\${4:Dialog content}</DialogContent>
  <DialogActions>
    <Button onClick={\${2}}>\${5:Cancel}</Button>
    <Button variant="contained" onClick={\${6:handleConfirm}}>\${7:Confirm}</Button>
  </DialogActions>
</Dialog>
\$0`,
  },
];
