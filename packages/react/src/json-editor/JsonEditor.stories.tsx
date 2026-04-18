/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { JSONEditor } from './JsonEditor';

const meta: Meta<typeof JSONEditor> = {
  title: 'Editors/JSONEditor',
  component: JSONEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultMode: {
      control: 'select',
      options: ['tree', 'text'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof JSONEditor>;

const SAMPLE_DATA = {
  name: 'Ali Veli',
  age: 30,
  active: true,
  address: {
    city: 'Istanbul',
    country: 'Turkey',
  },
  hobbies: ['coding', 'reading', 'gaming'],
  metadata: null,
};

// ── Default ──

export const Default: Story = {
  args: {
    value: SAMPLE_DATA,
  },
  decorators: [(Story) => <div style={{ width: 500 }}><Story /></div>],
};

// ── TextMode ──

export const TextMode: Story = {
  args: {
    value: SAMPLE_DATA,
    defaultMode: 'text',
  },
  decorators: [(Story) => <div style={{ width: 500 }}><Story /></div>],
};

// ── SimpleObject ──

export const SimpleObject: Story = {
  args: {
    value: { key: 'value', count: 42 },
  },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

// ── NestedObject ──

export const NestedObject: Story = {
  args: {
    value: {
      level1: {
        level2: {
          level3: {
            deep: 'value',
          },
        },
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 500 }}><Story /></div>],
};

// ── ArrayData ──

export const ArrayData: Story = {
  args: {
    value: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ],
  },
  decorators: [(Story) => <div style={{ width: 500 }}><Story /></div>],
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <JSONEditor value={SAMPLE_DATA}>
        <JSONEditor.Toolbar />
        <JSONEditor.Tree />
      </JSONEditor>
    </div>
  ),
};

// ── CompoundTextOnly ──

export const CompoundTextOnly: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <JSONEditor value={SAMPLE_DATA}>
        <JSONEditor.Toolbar />
        <JSONEditor.Text />
      </JSONEditor>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    value: SAMPLE_DATA,
    styles: {
      root: { padding: 4 },
      toolbar: { padding: '8px 12px' },
      tree: { padding: 16 },
    },
  },
  decorators: [(Story) => <div style={{ width: 500 }}><Story /></div>],
};
