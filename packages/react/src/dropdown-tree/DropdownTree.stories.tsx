/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownTree } from './DropdownTree';
import type { TreeNode, SelectValue } from '@relteco/relui-core';

// ── Sample Data ─────────────────────────────────────────────────────

const departmentNodes: TreeNode[] = [
  {
    value: 'engineering',
    label: 'Mühendislik',
    children: [
      {
        value: 'frontend',
        label: 'Frontend',
        children: [
          { value: 'react-team', label: 'React Takımı' },
          { value: 'vue-team', label: 'Vue Takımı' },
        ],
      },
      {
        value: 'backend',
        label: 'Backend',
        children: [
          { value: 'api-team', label: 'API Takımı' },
          { value: 'infra-team', label: 'Altyapı Takımı' },
        ],
      },
      { value: 'qa', label: 'QA' },
    ],
  },
  {
    value: 'design',
    label: 'Tasarım',
    children: [
      { value: 'ui-design', label: 'UI Tasarım' },
      { value: 'ux-research', label: 'UX Araştırma' },
    ],
  },
  {
    value: 'marketing',
    label: 'Pazarlama',
    children: [
      { value: 'digital', label: 'Dijital Pazarlama' },
      { value: 'content', label: 'İçerik', disabled: true },
    ],
  },
  { value: 'hr', label: 'İnsan Kaynakları' },
];

const fileSystemNodes: TreeNode[] = [
  {
    value: 'src',
    label: 'src/',
    children: [
      {
        value: 'components',
        label: 'components/',
        children: [
          { value: 'button', label: 'Button.tsx' },
          { value: 'input', label: 'Input.tsx' },
          { value: 'select', label: 'Select.tsx' },
        ],
      },
      {
        value: 'hooks',
        label: 'hooks/',
        children: [
          { value: 'useForm', label: 'useForm.ts' },
          { value: 'useAuth', label: 'useAuth.ts' },
        ],
      },
      { value: 'index', label: 'index.ts' },
    ],
  },
  {
    value: 'public',
    label: 'public/',
    children: [
      { value: 'favicon', label: 'favicon.ico' },
      { value: 'robots', label: 'robots.txt' },
    ],
  },
  { value: 'package', label: 'package.json' },
  { value: 'readme', label: 'README.md' },
];

// ── Meta ────────────────────────────────────────────────────────────

const meta: Meta<typeof DropdownTree> = {
  title: 'Selects/DropdownTree',
  component: DropdownTree,
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    expandAll: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownTree>;

// ── Stories ─────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    nodes: departmentNodes,
    placeholder: 'Departman seçin',
    variant: 'outline',
    size: 'md',
  },
};

export const WithDefaultValue: Story = {
  name: 'Varsayılan Değer / Default Value',
  args: {
    nodes: departmentNodes,
    defaultValue: 'react-team',
    expandAll: true,
  },
};

export const ExpandAll: Story = {
  name: 'Tümü Açık / Expand All',
  args: {
    nodes: departmentNodes,
    placeholder: 'Departman seçin',
    expandAll: true,
  },
};

export const MultipleSelection: Story = {
  name: 'Çoklu Seçim / Multiple Selection',
  args: {
    nodes: departmentNodes,
    selectionMode: 'multiple',
    placeholder: 'Departmanlar seçin',
    expandAll: true,
  },
};

export const MultipleWithDefaults: Story = {
  name: 'Çoklu Varsayılan / Multiple Defaults',
  args: {
    nodes: departmentNodes,
    selectionMode: 'multiple',
    defaultValues: ['react-team', 'ui-design', 'qa'],
    expandAll: true,
  },
};

export const FileSystem: Story = {
  name: 'Dosya Sistemi / File System',
  args: {
    nodes: fileSystemNodes,
    placeholder: 'Dosya seçin',
    expandAll: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <DropdownTree nodes={departmentNodes} placeholder="Outline" variant="outline" />
      <DropdownTree nodes={departmentNodes} placeholder="Filled" variant="filled" />
      <DropdownTree nodes={departmentNodes} placeholder="Flushed" variant="flushed" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <DropdownTree nodes={departmentNodes} placeholder="XS" size="xs" />
      <DropdownTree nodes={departmentNodes} placeholder="SM" size="sm" />
      <DropdownTree nodes={departmentNodes} placeholder="MD" size="md" />
      <DropdownTree nodes={departmentNodes} placeholder="LG" size="lg" />
      <DropdownTree nodes={departmentNodes} placeholder="XL" size="xl" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    nodes: departmentNodes,
    defaultValue: 'react-team',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    nodes: departmentNodes,
    defaultValue: 'react-team',
    readOnly: true,
  },
};

export const Controlled: Story = {
  name: 'Controlled / Kontrollü',
  render: () => {
    const [value, setValue] = useState<SelectValue | undefined>('react-team');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <DropdownTree
          nodes={departmentNodes}
          value={value}
          onValueChange={setValue}
          placeholder="Departman seçin"
          expandAll
        />
        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          Seçili: <strong>{value ? String(value) : 'Yok'}</strong>
        </div>
        <button type="button" onClick={() => setValue(undefined)} style={{ width: 'fit-content' }}>
          Temizle
        </button>
      </div>
    );
  },
};

export const ControlledMultiple: Story = {
  name: 'Controlled Multiple / Kontrollü Çoklu',
  render: () => {
    const [values, setValues] = useState<SelectValue[]>(['react-team', 'qa']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <DropdownTree
          nodes={departmentNodes}
          selectionMode="multiple"
          values={values}
          onValuesChange={setValues}
          placeholder="Departmanlar seçin"
          expandAll
        />
        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          Seçili: <strong>{values.map(String).join(', ') || 'Yok'}</strong>
        </div>
        <button type="button" onClick={() => setValues([])} style={{ width: 'fit-content' }}>
          Temizle
        </button>
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <DropdownTree
        nodes={departmentNodes}
        placeholder="Root styled"
        styles={{ root: { padding: '4px' } }}
      />
      <DropdownTree
        nodes={departmentNodes}
        placeholder="Trigger styled"
        styles={{ trigger: { fontWeight: 'bold' } }}
      />
    </div>
  ),
};
