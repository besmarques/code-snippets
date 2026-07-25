import type { LanguageCatalog } from '../../../types';

import { REACT_CHAKRA_COMMANDS } from './packages/chakra';
import { REACT_MUI_COMMANDS } from './packages/mui';
import { REACT_SHADCN_COMMANDS } from './packages/shadcn';
import { REACT_TAILWIND_COMMANDS } from './packages/tailwind';

export const REACT_CATALOG: LanguageCatalog = {
  language: 'react',
  commands: [
    {
      keyword: 'component',
      description: 'Create a simple React function component.',
      snippet: `export function \${1:ExampleComponent}() {
  return (
    <\${2:section}>
      \${3:Content}
    </\${2}>
  );
}
\$0`,
    },
    {
      keyword: 'props',
      description: 'Create a React component with destructured props.',
      snippet: `export function \${1:ExampleCard}({ \${2:title}, \${3:description} }) {
  return (
    <article>
      <h2>{\${2}}</h2>
      <p>{\${3}}</p>
    </article>
  );
}
\$0`,
    },
    {
      keyword: 'map',
      description: 'Render a list in JSX with a key and inline element output.',
      snippet: `{\${1:items}.map((\${2:item}) => (
  <\${3:div} key={\${2}.id}>{\${2}.\${4:name}}</\${3}>
))}\$0`,
    },
    {
      keyword: 'conditional',
      description: 'Render JSX conditionally with an early return.',
      snippet: `if (!\${1:isReady}) {
  return <\${2:p}>Loading...</\${2:p}>;
}

return (
  <\${3:section}>
    \${4:Content}
  </\${3:section}>
);
\$0`,
    },
    {
      keyword: 'empty',
      description: 'Render an empty-state message when a list has no items.',
      snippet: `if (!\${1:items}.length) {
  return <\${2:p}>No results found.</\${2:p}>;
}
\$0`,
    },
    {
      keyword: 'loading',
      description: 'Render a loading state for asynchronous UI.',
      snippet: `if (\${1:isLoading}) {
  return <\${2:p}>Loading...</\${2:p}>;
}
\$0`,
    },
    {
      keyword: 'error',
      description: 'Render an error state with a fallback message.',
      snippet: `if (\${1:error}) {
  return <\${2:p} role="alert">{\${1}.message ?? 'Something went wrong.'}</\${2:p}>;
}
\$0`,
    },
    {
      keyword: 'handler',
      description: 'Create a reusable React event handler.',
      snippet: `function \${1:handleSubmit}(\${2:event}) {
  \${2}.preventDefault();
  \${3}
}
\$0`,
    },
    {
      keyword: 'onclick',
      description: 'Attach a click handler to a button.',
      snippet: `<button
  type="button"
  onClick={() => {
    \${1}
  }}
>
  \${2:Click me}
</button>
\$0`,
    },
    {
      keyword: 'onchange',
      description: 'Handle an input change with component state.',
      snippet: `const [\${1:value}, set\${2:Value}] = useState('');

function \${3:handleChange}(\${4:event}) {
  set\${2}(\${4}.target.value);
}

<input value={\${1}} onChange={\${3}} />
\$0`,
    },
    {
      keyword: 'onsubmit',
      description: 'Handle form submission in a React component.',
      snippet: `function \${1:handleSubmit}(\${2:event}) {
  \${2}.preventDefault();
  \${3}
}

return (
  <form onSubmit={\${1}}>
    \${4}
  </form>
);
\$0`,
    },
    {
      keyword: 'form',
      description: 'Create a React 19-style form with an action prop.',
      snippet: `async function \${1:submitAction}(\${2:formData}) {
  const \${3:value} = \${2}.get('\${4:name}');
  \${5}
}

return (
  <form action={\${1}}>
    <input type="text" name="\${4:name}" />
    <button type="submit">\${6:Submit}</button>
  </form>
);
\$0`,
    },
    {
      keyword: 'fetch',
      description: 'Load remote data in React with useEffect and useState.',
      snippet: `const [\${1:data}, set\${2:Data}] = useState(null);
const [\${3:isLoading}, set\${4:IsLoading}] = useState(true);
const [\${5:error}, set\${6:Error}] = useState(null);

useEffect(() => {
  let isMounted = true;

  async function \${7:loadData}() {
    try {
      const response = await fetch(\${8:"/api/items"});
      const json = await response.json();

      if (isMounted) {
        set\${2}(json);
      }
    } catch (\${9:error}) {
      if (isMounted) {
        set\${6}(\${9});
      }
    } finally {
      if (isMounted) {
        set\${4}(false);
      }
    }
  }

  void \${7}();

  return () => {
    isMounted = false;
  };
}, []);
\$0`,
    },
    {
      keyword: 'context',
      description: 'Create a React context.',
      snippet: `import { createContext } from 'react';

export const \${1:ThemeContext} = createContext(\${2:null});
\$0`,
    },
    {
      keyword: 'provider',
      description: 'Create a context provider component.',
      snippet: `export function \${1:ThemeProvider}({ children }) {
  const [\${2:theme}, set\${3:Theme}] = useState('\${4:light}');

  return (
    <\${5:ThemeContext}.Provider value={{ \${2}, set\${3} }}>
      {children}
    </\${5}.Provider>
  );
}
\$0`,
    },
    {
      keyword: 'suspense',
      description: 'Wrap content in a Suspense boundary.',
      snippet: `<Suspense fallback={<\${1:p}>Loading...</\${1:p}>}>
  <\${2:Content} />
</Suspense>
\$0`,
    },
    {
      keyword: 'usestate',
      description: 'Declare local component state with useState.',
      snippet: `const [\${1:value}, set\${2:Value}] = useState(\${3:null});
\$0`,
    },
    {
      keyword: 'useeffect',
      description: 'Run side effects with cleanup using useEffect.',
      snippet: `useEffect(() => {
  \${1}

  return () => {
    \${2}
  };
}, [\${3}]);
\$0`,
    },
    {
      keyword: 'useeffectevent',
      description: 'Create a React 19 Effect Event with useEffectEvent.',
      snippet: `const \${1:onConnected} = useEffectEvent(() => {
  \${2:showNotification('Connected!')};
});

useEffect(() => {
  const \${3:connection} = \${4:createConnection}(\${5:roomId});
  \${3}.on('connected', \${1});
  \${3}.connect();

  return () => {
    \${3}.disconnect();
  };
}, [\${5}]);
\$0`,
    },
    {
      keyword: 'useref',
      description: 'Persist a mutable value or DOM reference with useRef.',
      snippet: `const \${1:inputRef} = useRef(null);
\$0`,
    },
    {
      keyword: 'usereducer',
      description: 'Manage state transitions with useReducer.',
      snippet: `function \${1:reducer}(\${2:state}, \${3:action}) {
  switch (\${3}.type) {
    case '\${4:set}':
      return {
        ...\${2},
        \${5:value}: \${3}.payload,
      };
    default:
      return \${2};
  }
}

const [\${6:state}, dispatch] = useReducer(\${1}, \${7:{ value: null }});
\$0`,
    },
    {
      keyword: 'usecontext',
      description: 'Read the current context value with useContext.',
      snippet: `const \${1:theme} = useContext(\${2:ThemeContext});
\$0`,
    },
    {
      keyword: 'usememo',
      description: 'Memoize a derived value with useMemo.',
      snippet: `const \${1:visibleItems} = useMemo(() => {
  return \${2:items}.filter((\${3:item}) => \${3}.visible);
}, [\${2}]);
\$0`,
    },
    {
      keyword: 'usecallback',
      description: 'Memoize a callback with useCallback.',
      snippet: `const \${1:handleClick} = useCallback(() => {
  \${2}
}, [\${3}]);
\$0`,
    },
    {
      keyword: 'useid',
      description: 'Generate a stable unique ID with useId.',
      snippet: `const \${1:inputId} = useId();
\$0`,
    },
    {
      keyword: 'usetransition',
      description: 'Mark a state update as a transition.',
      snippet: `const [\${1:isPending}, startTransition] = useTransition();

function \${2:handleChange}(\${3:value}) {
  startTransition(() => {
    \${4:setState}(\${3});
  });
}
\$0`,
    },
    {
      keyword: 'usedeferredvalue',
      description: 'Defer a value that updates frequently.',
      snippet: `const \${1:deferredQuery} = useDeferredValue(\${2:query});
\$0`,
    },
    {
      keyword: 'uselayouteffect',
      description: 'Run a synchronous effect after DOM mutations.',
      snippet: `useLayoutEffect(() => {
  \${1}
}, [\${2}]);
\$0`,
    },
    {
      keyword: 'useinsertioneffect',
      description: 'Run logic before DOM mutations are visible, useful for style injection.',
      snippet: `useInsertionEffect(() => {
  \${1}
}, [\${2}]);
\$0`,
    },
    {
      keyword: 'useimperativehandle',
      description: 'Customize the ref handle exposed by a component.',
      snippet: `useImperativeHandle(\${1:ref}, () => ({
  \${2:focus}() {
    \${3:inputRef}.current?.focus();
  },
}));
\$0`,
    },
    {
      keyword: 'usesyncexternalstore',
      description: 'Subscribe to an external store with useSyncExternalStore.',
      snippet: `const \${1:value} = useSyncExternalStore(
  \${2:store}.subscribe,
  \${2:store}.getSnapshot,
  \${2:store}.getServerSnapshot,
);
\$0`,
    },
    {
      keyword: 'usedebugvalue',
      description: 'Label a custom hook value in React DevTools.',
      snippet: `useDebugValue(\${1:value}, (\${2:current}) => 'Value: ' + \${2});
\$0`,
    },
    {
      keyword: 'use',
      description: 'Read a Promise or context with the React 19 use API.',
      snippet: `function \${1:Message}({ \${2:messagePromise} }) {
  const \${3:message} = use(\${2});

  return <p>{\${3}}</p>;
}
\$0`,
    },
    {
      keyword: 'useactionstate',
      description: 'Manage an action result and pending state with React 19 useActionState.',
      snippet: `const [\${1:state}, \${2:submitAction}, \${3:isPending}] = useActionState(
  async (\${4:previousState}, \${5:formData}) => {
    const \${6:name} = \${5}.get('\${7:name}');
    return {
      ...\${4},
      \${6},
    };
  },
  \${8:{ name: '' }},
);
\$0`,
    },
    {
      keyword: 'useoptimistic',
      description: 'Add optimistic UI state with React 19 useOptimistic.',
      snippet: `const [\${1:optimisticTodos}, \${2:addOptimisticTodo}] = useOptimistic(
  \${3:todos},
  (\${4:currentTodos}, \${5:newTodo}) => [
    ...\${4},
    { ...\${5}, pending: true },
  ],
);
\$0`,
    },
    {
      keyword: 'useformstatus',
      description: 'Read parent form submission status with React 19 useFormStatus.',
      snippet: `function \${1:SubmitButton}() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '\${2:Submitting...}' : '\${3:Submit}'}
    </button>
  );
}
\$0`,
    },
    ...REACT_CHAKRA_COMMANDS,
    ...REACT_MUI_COMMANDS,
    ...REACT_SHADCN_COMMANDS,
    ...REACT_TAILWIND_COMMANDS,
  ],
};
