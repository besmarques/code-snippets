import type { LanguageCatalog } from '../../../types';

import { CSS_SASS_COMMANDS } from './packages/sass';
import { CSS_TAILWIND_COMMANDS } from './packages/tailwind';

export const CSS_CATALOG: LanguageCatalog = {
  language: 'css',
  commands: [
    {
      keyword: 'center',
      description: 'Center content with flexbox.',
      snippet: `.\${1:container} {
  display: flex;
  align-items: center;
  justify-content: center;
}
\$0`,
    },
    {
      keyword: 'grid',
      description: 'Create a responsive CSS grid layout.',
      snippet: `.\${1:grid} {
  display: grid;
  gap: \${2:1rem};
  grid-template-columns: repeat(auto-fit, minmax(\${3:16rem}, 1fr));
}
\$0`,
    },
    {
      keyword: 'variables',
      description: 'Create root-level CSS custom properties.',
      snippet: `:root {
  --\${1:surface}: \${2:#ffffff};
  --\${3:text}: \${4:#0f172a};
  --\${5:accent}: \${6:#0ea5e9};
}
\$0`,
    },
    {
      keyword: 'mediaquery',
      description: 'Create a responsive media query block.',
      snippet: `@media (min-width: \${1:768px}) {
  .\${2:layout} {
    \${3:grid-template-columns: 1fr 20rem;}
  }
}
\$0`,
    },
    {
      keyword: 'keyframes',
      description: 'Create a CSS keyframes animation.',
      snippet: `@keyframes \${1:fade-in-up} {
  from {
    opacity: 0;
    transform: translateY(\${2:12px});
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
\$0`,
    },
    ...CSS_SASS_COMMANDS,
    ...CSS_TAILWIND_COMMANDS,
  ],
};
