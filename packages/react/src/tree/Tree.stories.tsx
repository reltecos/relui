/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { TreeNodeDef } from '@relteco/relui-core';
import { Tree } from './Tree';

const fileSystemNodes: TreeNodeDef[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
          { id: 'select', label: 'Select.tsx' },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        children: [
          { id: 'useForm', label: 'useForm.ts' },
          { id: 'useAuth', label: 'useAuth.ts' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'favicon', label: 'favicon.ico' },
      { id: 'indexhtml', label: 'index.html' },
    ],
  },
  { id: 'packagejson', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

const meta: Meta<typeof Tree> = {
  title: 'Data Display/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    selectionMode: { control: 'select', options: ['single', 'multiple', 'none'] },
    checkable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

// ── Default ──

export const Default: Story = {
  args: {
    nodes: fileSystemNodes,
    defaultExpanded: ['src'],
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

// ── AllSizes ──

export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ width: 200 }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>
            {size}
          </p>
          <Tree
            size={size}
            nodes={[
              {
                id: `${size}-root`,
                label: 'Root',
                children: [
                  { id: `${size}-c1`, label: 'Child 1' },
                  { id: `${size}-c2`, label: 'Child 2' },
                ],
              },
            ]}
            defaultExpanded={[`${size}-root`]}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Nested ──

export const DeeplyNested: Story = {
  name: 'Derin Yuvalama / Deeply Nested',
  args: {
    nodes: fileSystemNodes,
    defaultExpanded: ['src', 'components', 'hooks', 'public'],
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

// ── Checkable ──

export const Checkable: Story = {
  name: 'Isaretlenebilir / Checkable',
  args: {
    nodes: fileSystemNodes,
    checkable: true,
    defaultExpanded: ['src', 'components'],
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

// ── Selection ──

export const MultiSelect: Story = {
  name: 'Coklu Secim / Multiple Selection',
  args: {
    nodes: fileSystemNodes,
    selectionMode: 'multiple',
    defaultExpanded: ['src', 'components'],
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

// ── Compound ──

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ width: 300 }}>
      <Tree defaultExpanded={['docs']}>
        <Tree.Node id="docs" label="Belgeler">
          <Tree.Node id="api" label="API Referansi">
            <Tree.Node id="api-core" label="Core API" />
            <Tree.Node id="api-react" label="React API" />
          </Tree.Node>
          <Tree.Node id="guide" label="Kullanim Kilavuzu" />
        </Tree.Node>
        <Tree.Node id="changelog" label="Degisiklik Gunlugu" />
        <Tree.Node id="license" label="Lisans" />
      </Tree>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    nodes: fileSystemNodes,
    defaultExpanded: ['src'],
    styles: {
      root: { padding: 8 },
      label: { fontSize: 16 },
    },
    classNames: { root: 'custom-tree' },
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

// ── Playground ──

export const Playground: Story = {
  args: {
    nodes: fileSystemNodes,
    size: 'md',
    selectionMode: 'single',
    checkable: false,
    defaultExpanded: ['src'],
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};
