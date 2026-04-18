/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CodeEditor } from './CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Editors/CodeEditor',
  component: CodeEditor,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    language: { control: 'select', options: ['typescript', 'javascript', 'css', 'html', 'json', 'text'] },
    tabSize: { control: 'number' },
    showFind: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CodeEditor>;

const TS_CODE = `interface User {
  name: string;
  age: number;
  active: boolean;
}

function greet(user: User): string {
  const greeting = \`Hello, \${user.name}!\`;
  return greeting;
}

const users: User[] = [
  { name: 'Ali', age: 30, active: true },
  { name: 'Veli', age: 25, active: false },
];

// Process users
for (const user of users) {
  if (user.active) {
    const msg = greet(user);
  }
}`;

const CSS_CODE = `/* Theme Variables */
:root {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --font-sans: system-ui, sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: var(--color-bg);
  border-radius: 8px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}`;

const JSON_CODE = `{
  "name": "RelUI",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "features": ["components", "tokens", "icons"]
}`;

export const Default: Story = {
  args: { value: TS_CODE, language: 'typescript' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const JavaScript: Story = {
  args: { value: TS_CODE.replace(/: \w+/g, '').replace(/interface.*\n/g, ''), language: 'javascript' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const CSSCode: Story = {
  args: { value: CSS_CODE, language: 'css' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const JSONCode: Story = {
  args: { value: JSON_CODE, language: 'json' },
  decorators: [(Story) => <div style={{ width: 600 }}><Story /></div>],
};

export const WithFind: Story = {
  args: { value: TS_CODE, language: 'typescript', showFind: true },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const Empty: Story = {
  args: { value: '', language: 'typescript' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const Compound: Story = {
  render: () => (
    <div style={{ width: 700 }}>
      <CodeEditor value={TS_CODE} language="typescript">
        <CodeEditor.Toolbar />
        <CodeEditor.FindPanel />
        <div style={{ display: 'flex' }}>
          <CodeEditor.Gutter />
          <CodeEditor.Content />
        </div>
      </CodeEditor>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    value: TS_CODE,
    language: 'typescript',
    styles: {
      root: { padding: 4 },
      toolbar: { padding: '8px 12px' },
      gutter: { padding: '8px 12px' },
      content: { padding: 16 },
    },
  },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};
