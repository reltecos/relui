/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete } from './Autocomplete';

// ── Test Data ───────────────────────────────────────────

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
];

const groupedItems = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'cherry', label: 'Cherry', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
];

// ── Meta ────────────────────────────────────────────────

const meta: Meta<typeof Autocomplete> = {
  title: 'Primitives/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Boyut / Size',
    },
    disabled: {
      control: 'boolean',
      description: 'Devre disi / Disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder metni / Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

// ── Default ──

export const Default: Story = {
  args: {
    options: fruits,
    placeholder: 'Search fruits...',
  },
  render: (args) => (
    <div style={{ maxWidth: 300, minHeight: 300 }}>
      <Autocomplete {...args} />
    </div>
  ),
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300, minHeight: 300 }}>
      <Autocomplete options={fruits} size="sm" placeholder="Small" />
      <Autocomplete options={fruits} size="md" placeholder="Medium" />
      <Autocomplete options={fruits} size="lg" placeholder="Large" />
    </div>
  ),
};

// ── WithGroups ──

export const WithGroups: Story = {
  render: () => (
    <div style={{ maxWidth: 300, minHeight: 400 }}>
      <Autocomplete
        options={groupedItems}
        placeholder="Search items..."
      />
    </div>
  ),
};

// ── Disabled ──

export const Disabled: Story = {
  args: {
    options: fruits,
    placeholder: 'Cannot type here',
    disabled: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <Autocomplete {...args} />
    </div>
  ),
};

// ── NoResult ──

export const NoResult: Story = {
  render: () => (
    <div style={{ maxWidth: 300, minHeight: 200 }}>
      <Autocomplete
        options={[]}
        placeholder="Type something..."
        noResultText="No matching items found"
      />
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ maxWidth: 300, minHeight: 300 }}>
      <Autocomplete options={fruits}>
        <Autocomplete.Input placeholder="Compound mode..." />
        <Autocomplete.List>
          {fruits.map((f) => (
            <Autocomplete.Option key={f.value} value={f.value} label={f.label} />
          ))}
        </Autocomplete.List>
      </Autocomplete>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ maxWidth: 300, minHeight: 300 }}>
      <Autocomplete
        options={fruits}
        placeholder="Styled autocomplete"
        styles={{
          root: { padding: 8 },
          input: { fontSize: 18, fontWeight: 500 },
          listbox: { padding: 4 },
        }}
        classNames={{
          root: 'my-autocomplete-root',
        }}
      />
    </div>
  ),
};

// ── WithDefaultValue ──

export const WithDefaultValue: Story = {
  render: () => (
    <div style={{ maxWidth: 300, minHeight: 300 }}>
      <Autocomplete
        options={fruits}
        defaultValue="cherry"
        placeholder="Pre-selected value"
      />
    </div>
  ),
};
