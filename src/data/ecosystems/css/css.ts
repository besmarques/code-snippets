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
      keyword: 'flex',
      description: 'Create a flexible row layout with spacing.',
      snippet: `.\${1:stack} {
  display: flex;
  align-items: \${2:center};
  justify-content: \${3:space-between};
  gap: \${4:1rem};
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
      keyword: 'container',
      description: 'Create a centered page container.',
      snippet: `.\${1:container} {
  width: min(100% - \${2:2rem}, \${3:72rem});
  margin-inline: auto;
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
      keyword: 'reset',
      description: 'Create a light CSS reset for layout consistency.',
      snippet: `*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
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
      keyword: 'transition',
      description: 'Create a transition-ready interactive selector.',
      snippet: `.\${1:button} {
  transition:
    background-color \${2:180ms} ease,
    color \${2} ease,
    transform \${2} ease;
}

.\${1}:hover {
  transform: translateY(\${3:-1px});
}
\$0`,
    },
    {
      keyword: 'sronly',
      description: 'Hide content visually while keeping it accessible.',
      snippet: `.\${1:sr-only} {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\$0`,
    },
    {
      keyword: 'clamp',
      description: 'Create a fluid size with CSS clamp.',
      snippet: `.\${1:title} {
  font-size: clamp(\${2:2rem}, \${3:4vw}, \${4:4rem});
  line-height: \${5:1.1};
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
