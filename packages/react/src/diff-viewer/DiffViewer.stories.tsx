/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DiffViewer } from './DiffViewer';

const meta: Meta<typeof DiffViewer> = {
  title: 'Data Display/DiffViewer',
  component: DiffViewer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    mode: { control: 'select', options: ['inline', 'split'] },
    showLineNumbers: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof DiffViewer>;

const oldCode = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`;

const newCode = `function greet(name, greeting) {
  const message = greeting + ", " + name;
  console.log(message);
  return message;
}`;

export const Default: Story = { args: { oldText: oldCode, newText: newCode } };

export const SplitMode: Story = { args: { oldText: oldCode, newText: newCode, mode: 'split' } };

export const NoDiff: Story = { args: { oldText: oldCode, newText: oldCode } };

export const AddOnly: Story = { args: { oldText: '', newText: 'new line 1\nnew line 2\nnew line 3' } };

export const RemoveOnly: Story = { args: { oldText: 'old line 1\nold line 2\nold line 3', newText: '' } };

export const NoLineNumbers: Story = { args: { oldText: oldCode, newText: newCode, showLineNumbers: false } };

export const Compound: Story = {
  render: () => (
    <DiffViewer oldText={oldCode} newText={newCode}>
      <DiffViewer.Side>
        <DiffViewer.Line>
          <DiffViewer.Gutter>1</DiffViewer.Gutter>
          Custom compound content
        </DiffViewer.Line>
      </DiffViewer.Side>
    </DiffViewer>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    oldText: oldCode,
    newText: newCode,
    styles: {
      root: { borderRadius: 12 },
      line: { padding: '2px 0' },
      gutter: { opacity: 0.6 },
    },
  },
};
