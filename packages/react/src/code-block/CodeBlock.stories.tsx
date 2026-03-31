/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './CodeBlock';

const meta: Meta<typeof CodeBlock> = {
  title: 'Data Display/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    language: { control: 'select', options: ['javascript', 'typescript', 'css', 'html', 'json', 'text'] },
    theme: { control: 'select', options: ['light', 'dark'] },
    showLineNumbers: { control: 'boolean' },
    copyable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;

const jsCode = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`;

const tsCode = `interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}`;

const cssCode = `/* Card Component */
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  background: var(--color-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}`;

const jsonCode = `{
  "name": "@relteco/relui-react",
  "version": "0.1.0",
  "dependencies": {
    "react": "^19.0.0"
  },
  "private": false
}`;

// ── Default ──

export const Default: Story = {
  args: { code: jsCode, language: 'javascript', title: 'Counter.tsx' },
};

// ── TypeScript ──

export const TypeScript: Story = {
  args: { code: tsCode, language: 'typescript', title: 'api.ts' },
};

// ── DarkTheme ──

export const DarkTheme: Story = {
  args: { code: jsCode, language: 'javascript', theme: 'dark', title: 'Counter.tsx' },
};

// ── CSS ──

export const CSS: Story = {
  args: { code: cssCode, language: 'css', title: 'card.css' },
};

// ── JSON ──

export const JSON: Story = {
  args: { code: jsonCode, language: 'json', title: 'package.json' },
};

// ── NoLineNumbers ──

export const NoLineNumbers: Story = {
  args: { code: jsCode, language: 'javascript', showLineNumbers: false },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <CodeBlock code={tsCode} language="typescript">
      <CodeBlock.Header>
        <span style={{ fontWeight: 600 }}>api.ts</span>
        <CodeBlock.CopyButton />
      </CodeBlock.Header>
    </CodeBlock>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    code: 'const x = 42;\nconst y = "hello";',
    language: 'javascript',
    title: 'demo.js',
    styles: {
      root: { borderRadius: 16 },
      header: { padding: '12px 20px' },
      line: { padding: '2px 20px' },
      lineNumber: { opacity: 0.4 },
    },
  },
};
