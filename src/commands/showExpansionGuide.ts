import * as vscode from 'vscode';

export function buildExpansionGuideMarkdown(): string {
  return `# Code Dictionary Expansion Guide

## Fastest Trigger Flow

1. Type a trigger such as \">map.js\" or \">post.express.js\".
2. Put the cursor anywhere inside that trigger.
3. Run **Code Dictionary: Expand Trigger**.

Default shortcut:

- Windows and Linux: \`Ctrl+Alt+Enter\`
- macOS: \`Cmd+Alt+Enter\`

## Compose Snippets

### Wrap Existing Code

1. Expand an inner snippet first, such as \`>map.js\`.
2. Select the generated code.
3. Expand a wrapper snippet such as \`>function.js\`, \`>component.react\`, or \`>function.php\`.
4. The selected code is inserted into the wrapper body.

### Nest A Trigger Inside A Wrapper

1. Expand a wrapper snippet such as \`>function.js\`.
2. The first cursor stop lands inside the wrapper body.
3. Type another trigger there, such as \`>map.js\`.
4. Run **Code Dictionary: Expand Trigger** again.

## Good Wrapper Triggers

- \`>function.js\`
- \`>arrow.js\`
- \`>async.ts\`
- \`>component.react\`
- \`>onsubmit.react\`
- \`>form.react\`
- \`>function.php\`
- \`>middleware.php\`

## Notes

- Core ids start with \`>\`.
- Package ids can be expanded as either \`>post.express.js\` or \`post.express.js\`.
- If you select code instead of a trigger, use **Code Dictionary: Translate Selection**.
- If a wrapper feels empty after expansion, that is intentional: it is ready for nesting or wrapping.
`;
}

export async function showExpansionGuide(): Promise<void> {
  const document = await vscode.workspace.openTextDocument({
    content: buildExpansionGuideMarkdown(),
    language: 'markdown',
  });

  await vscode.window.showTextDocument(document, {
    preview: false,
  });
}
