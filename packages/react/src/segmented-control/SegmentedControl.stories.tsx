/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const viewOptions = [
  { value: 'list', label: 'Liste' },
  { value: 'grid', label: 'Izgara' },
  { value: 'kanban', label: 'Kanban' },
];

const periodOptions = [
  { value: 'daily', label: 'Günlük' },
  { value: 'weekly', label: 'Haftalık' },
  { value: 'monthly', label: 'Aylık' },
  { value: 'yearly', label: 'Yıllık' },
];

// ── Varsayılan / Default ──────────────────────────────────────────

export const Default: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'list',
    'aria-label': 'Görünüm',
  },
};

// ── Controlled ────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('weekly');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <SegmentedControl
          options={periodOptions}
          value={value}
          onValueChange={setValue}
          aria-label="Periyot"
        />
        <span style={{ fontSize: '13px', color: '#666' }}>Seçili: {value}</span>
      </div>
    );
  },
};

// ── Tüm Boyutlar / All Sizes ──────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'start' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', width: '24px', color: '#666' }}>{size}</span>
          <SegmentedControl
            options={viewOptions}
            defaultValue="list"
            size={size}
            aria-label={`Boyut ${size}`}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Disabled ──────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'grid',
    disabled: true,
    'aria-label': 'Görünüm',
  },
};

// ── ReadOnly ──────────────────────────────────────────────────────

export const ReadOnly: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'kanban',
    readOnly: true,
    'aria-label': 'Görünüm',
  },
};

// ── Disabled Option ───────────────────────────────────────────────

export const DisabledOption: Story = {
  args: {
    options: [
      { value: 'a', label: 'Aktif A' },
      { value: 'b', label: 'Pasif B', disabled: true },
      { value: 'c', label: 'Aktif C' },
    ],
    defaultValue: 'a',
    'aria-label': 'Seçenekler',
  },
};

// ── İki Seçenek / Two Options ─────────────────────────────────────

export const TwoOptions: Story = {
  args: {
    options: [
      { value: 'light', label: 'Açık' },
      { value: 'dark', label: 'Koyu' },
    ],
    defaultValue: 'light',
    'aria-label': 'Tema',
  },
};

// ── Çok Seçenek / Many Options ────────────────────────────────────

export const ManyOptions: Story = {
  args: {
    options: [
      { value: 'mon', label: 'Pzt' },
      { value: 'tue', label: 'Sal' },
      { value: 'wed', label: 'Çar' },
      { value: 'thu', label: 'Per' },
      { value: 'fri', label: 'Cum' },
      { value: 'sat', label: 'Cmt' },
      { value: 'sun', label: 'Paz' },
    ],
    defaultValue: 'mon',
    'aria-label': 'Gün',
  },
};

// ── Playground ────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'list',
    size: 'md',
    disabled: false,
    readOnly: false,
    'aria-label': 'Görünüm',
  },
};
