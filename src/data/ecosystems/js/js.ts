import type { LanguageCatalog } from '../../../types';

import { JS_AXIOS_COMMANDS } from './packages/axios';
import { JS_DOTENV_COMMANDS } from './packages/dotenv';
import { JS_EXPRESS_COMMANDS } from './packages/express';
import { JS_JSONWEBTOKEN_COMMANDS } from './packages/jsonwebtoken';
import { JS_SQL_COMMANDS } from './packages/sql';

export const JS_CATALOG: LanguageCatalog = {
  language: 'js',
  commands: [
    {
      keyword: 'map',
      description: 'Map over an array in plain JavaScript.',
      snippet: `const \${1:result} = \${2:items}.map((\${3:item}) => {
  return \${3};
});
\$0`,
    },
    {
      keyword: 'filter',
      description: 'Filter an array in plain JavaScript.',
      snippet: `const \${1:result} = \${2:items}.filter((\${3:item}) => {
  return \${3:condition};
});
\$0`,
    },
    {
      keyword: 'reduce',
      description: 'Reduce an array to a single value in JavaScript.',
      snippet: `const \${1:result} = \${2:items}.reduce((\${3:accumulator}, \${4:item}) => {
  return \${3};
}, \${5:0});
\$0`,
    },
    {
      keyword: 'find',
      description: 'Find the first matching item in an array.',
      snippet: `const \${1:item} = \${2:items}.find((\${3:entry}) => {
  return \${3}.id === \${4:targetId};
});
\$0`,
    },
    {
      keyword: 'some',
      description: 'Check whether at least one item matches a condition.',
      snippet: `const \${1:hasMatch} = \${2:items}.some((\${3:item}) => {
  return \${3:condition};
});
\$0`,
    },
    {
      keyword: 'every',
      description: 'Check whether every item matches a condition.',
      snippet: `const \${1:allMatch} = \${2:items}.every((\${3:item}) => {
  return \${3:condition};
});
\$0`,
    },
    {
      keyword: 'foreach',
      description: 'Iterate over each array item with forEach.',
      snippet: `\${1:items}.forEach((\${2:item}, \${3:index}) => {
  console.log(\${2}, \${3});
});
\$0`,
    },
    {
      keyword: 'sort',
      description: 'Sort an array without mutating the original input.',
      snippet: `const \${1:sorted} = [...\${2:items}].sort((\${3:left}, \${4:right}) => {
  return \${3}.name.localeCompare(\${4}.name);
});
\$0`,
    },
    {
      keyword: 'fetch',
      description: 'Fetch JSON in plain JavaScript.',
      snippet: `const response = await fetch(\${1:"/api/items"});
const data = await response.json();
\$0`,
    },
    {
      keyword: 'async',
      description: 'Create an async function with basic error handling.',
      snippet: `async function \${1:loadData}() {
  try {
    const \${2:result} = await \${3:fetchData}();
    return \${2};
  } catch (\${4:error}) {
    console.error(\${4});
    throw \${4};
  }
}
\$0`,
    },
    {
      keyword: 'await',
      description: 'Await the result of an async function.',
      snippet: `const \${1:result} = await \${2:asyncFunction}(\${3});
\$0`,
    },
    {
      keyword: 'promise',
      description: 'Create a Promise manually.',
      snippet: `const \${1:task} = new Promise((\${2:resolve}, \${3:reject}) => {
  try {
    \${2}(\${4:value});
  } catch (\${5:error}) {
    \${3}(\${5});
  }
});
\$0`,
    },
    {
      keyword: 'promiseall',
      description: 'Run multiple async tasks in parallel with Promise.all.',
      snippet: `const [\${1:first}, \${2:second}] = await Promise.all([
  \${3:getFirst}(),
  \${4:getSecond}(),
]);
\$0`,
    },
    {
      keyword: 'then',
      description: 'Handle a Promise with then and catch.',
      snippet: `\${1:doWork}()
  .then((\${2:result}) => {
    console.log(\${2});
  })
  .catch((\${3:error}) => {
    console.error(\${3});
  });
\$0`,
    },
    {
      keyword: 'trycatch',
      description: 'Wrap code in a try/catch block.',
      snippet: `try {
  \${1:riskyOperation}();
} catch (\${2:error}) {
  console.error(\${2});
}
\$0`,
    },
    {
      keyword: 'class',
      description: 'Create a JavaScript class with a constructor.',
      snippet: `class \${1:Example} {
  constructor(\${2:name}) {
    this.\${2} = \${2};
  }
}
\$0`,
    },
    {
      keyword: 'function',
      description: 'Create a named JavaScript function.',
      snippet: `function \${1:handler}(\${2:value}) {
  return \${2};
}
\$0`,
    },
    {
      keyword: 'arrow',
      description: 'Create an arrow function expression.',
      snippet: `const \${1:handler} = (\${2:value}) => {
  return \${2};
};
\$0`,
    },
    {
      keyword: 'loop',
      description: 'Loop through an iterable in JavaScript.',
      snippet: `for (const \${1:item} of \${2:items}) {
  // ...
}
\$0`,
    },
    {
      keyword: 'while',
      description: 'Loop with a while statement.',
      snippet: `let \${1:index} = 0;

while (\${1} < \${2:items}.length) {
  const \${3:item} = \${2}[\${1}];
  \${1} += 1;
}
\$0`,
    },
    {
      keyword: 'if',
      description: 'Create an if/else block.',
      snippet: `if (\${1:condition}) {
  \${2}
} else {
  \${3}
}
\$0`,
    },
    {
      keyword: 'switch',
      description: 'Create a switch statement.',
      snippet: `switch (\${1:value}) {
  case \${2:"example"}:
    \${3}
    break;
  default:
    \${4}
    break;
}
\$0`,
    },
    {
      keyword: 'ternary',
      description: 'Create a ternary expression.',
      snippet: `const \${1:result} = \${2:condition} ? \${3:truthyValue} : \${4:falsyValue};
\$0`,
    },
    {
      keyword: 'object',
      description: 'Create an object literal.',
      snippet: `const \${1:config} = {
  \${2:key}: \${3:value},
};
\$0`,
    },
    {
      keyword: 'array',
      description: 'Create an array literal.',
      snippet: `const \${1:items} = [\${2:firstItem}, \${3:secondItem}];
\$0`,
    },
    {
      keyword: 'set',
      description: 'Create a Set from a list of values.',
      snippet: `const \${1:uniqueValues} = new Set(\${2:items});
\$0`,
    },
    {
      keyword: 'destructure',
      description: 'Destructure fields from an object.',
      snippet: `const { \${1:id}, \${2:name} } = \${3:item};
\$0`,
    },
    {
      keyword: 'spread',
      description: 'Clone and extend an object with spread syntax.',
      snippet: `const \${1:nextState} = {
  ...\${2:state},
  \${3:loading}: \${4:true},
};
\$0`,
    },
    {
      keyword: 'optionalchain',
      description: 'Safely access nested values with optional chaining.',
      snippet: `const \${1:value} = \${2:response}?.\${3:data}?.\${4:items}?.[\${5:0}];
\$0`,
    },
    {
      keyword: 'nullish',
      description: 'Use nullish coalescing to define a fallback value.',
      snippet: `const \${1:value} = \${2:input} ?? \${3:defaultValue};
\$0`,
    },
    {
      keyword: 'jsonparse',
      description: 'Parse JSON into a JavaScript value.',
      snippet: `const \${1:data} = JSON.parse(\${2:jsonString});
\$0`,
    },
    {
      keyword: 'jsonstringify',
      description: 'Convert a JavaScript value into formatted JSON.',
      snippet: `const \${1:json} = JSON.stringify(\${2:value}, null, \${3:2});
\$0`,
    },
    {
      keyword: 'import',
      description: 'Import a named export from another module.',
      snippet: `import { \${1:something} } from '\${2:./module.js}';
\$0`,
    },
    {
      keyword: 'export',
      description: 'Export a named JavaScript function.',
      snippet: `export function \${1:helper}(\${2:value}) {
  return \${2};
}
\$0`,
    },
    {
      keyword: 'query',
      description: 'Query a single DOM element.',
      snippet: `const \${1:element} = document.querySelector('\${2:.selector}');
\$0`,
    },
    {
      keyword: 'queryall',
      description: 'Query multiple DOM elements.',
      snippet: `const \${1:elements} = [...document.querySelectorAll('\${2:.item}')];
\$0`,
    },
    {
      keyword: 'addlistener',
      description: 'Attach an event listener to a DOM element.',
      snippet: `\${1:element}.addEventListener('\${2:click}', (\${3:event}) => {
  \${3}.preventDefault();
});
\$0`,
    },
    {
      keyword: 'localstorage',
      description: 'Write and read JSON data from localStorage.',
      snippet: `localStorage.setItem('\${1:key}', JSON.stringify(\${2:value}));

const \${3:storedValue} = JSON.parse(localStorage.getItem('\${1:key}') ?? 'null');
\$0`,
    },
    {
      keyword: 'sessionstorage',
      description: 'Write and read JSON data from sessionStorage.',
      snippet: `sessionStorage.setItem('\${1:key}', JSON.stringify(\${2:value}));

const \${3:storedValue} = JSON.parse(sessionStorage.getItem('\${1:key}') ?? 'null');
\$0`,
    },
    {
      keyword: 'timeout',
      description: 'Run code once after a delay.',
      snippet: `const \${1:timeoutId} = setTimeout(() => {
  \${2}
}, \${3:300});
\$0`,
    },
    {
      keyword: 'interval',
      description: 'Run code repeatedly on an interval.',
      snippet: `const \${1:intervalId} = setInterval(() => {
  \${2}
}, \${3:1000});
\$0`,
    },
    {
      keyword: 'debounce',
      description: 'Create a debounced function.',
      snippet: `function debounce(\${1:callback}, \${2:delay} = 250) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      \${1}(...args);
    }, \${2});
  };
}
\$0`,
    },
    {
      keyword: 'throttle',
      description: 'Create a throttled function.',
      snippet: `function throttle(\${1:callback}, \${2:delay} = 250) {
  let isWaiting = false;

  return (...args) => {
    if (isWaiting) {
      return;
    }

    isWaiting = true;
    \${1}(...args);

    setTimeout(() => {
      isWaiting = false;
    }, \${2});
  };
}
\$0`,
    },
    {
      keyword: 'regex',
      description: 'Create and use a regular expression.',
      snippet: `const \${1:pattern} = /\${2:value}/\${3:gi};
const \${4:matches} = \${5:text}.match(\${1});
\$0`,
    },
    {
      keyword: 'date',
      description: 'Create and format a Date value.',
      snippet: `const \${1:now} = new Date();
const \${2:isoString} = \${1}.toISOString();
\$0`,
    },
    {
      keyword: 'urlparams',
      description: 'Read URL search parameters.',
      snippet: `const \${1:params} = new URLSearchParams(window.location.search);
const \${2:value} = \${1}.get('\${3:key}');
\$0`,
    },
    {
      keyword: 'component',
      description: 'Create a small JavaScript-style UI component placeholder.',
      snippet: `function \${1:renderComponent}() {
  return \`\${2:<section>Content</section>}\`;
}
\$0`,
    },
    ...JS_AXIOS_COMMANDS,
    ...JS_DOTENV_COMMANDS,
    ...JS_EXPRESS_COMMANDS,
    ...JS_JSONWEBTOKEN_COMMANDS,
    ...JS_SQL_COMMANDS,
  ],
};
