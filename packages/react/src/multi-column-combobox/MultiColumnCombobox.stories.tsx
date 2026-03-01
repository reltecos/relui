/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiColumnCombobox } from './MultiColumnCombobox';
import type { MCComboboxColumn, MCComboboxItem } from '@relteco/relui-core';

// ── Test verileri / Test data ───────────────────────────────────────

const employeeColumns: MCComboboxColumn[] = [
  { key: 'code', header: 'Kod', width: '5rem' },
  { key: 'name', header: 'Ad Soyad' },
  { key: 'dept', header: 'Departman', width: '8rem' },
  { key: 'title', header: 'Ünvan' },
];

const employeeItems: MCComboboxItem[] = [
  { value: 1, label: 'Ali Yılmaz', data: { code: 'E001', name: 'Ali Yılmaz', dept: 'Mühendislik', title: 'Kıdemli Yazılımcı' } },
  { value: 2, label: 'Ayşe Demir', data: { code: 'E002', name: 'Ayşe Demir', dept: 'Pazarlama', title: 'Pazarlama Müdürü' } },
  { value: 3, label: 'Mehmet Kaya', data: { code: 'E003', name: 'Mehmet Kaya', dept: 'Mühendislik', title: 'Frontend Geliştirici' } },
  { value: 4, label: 'Fatma Şahin', data: { code: 'E004', name: 'Fatma Şahin', dept: 'İnsan Kaynakları', title: 'İK Uzmanı' }, disabled: true },
  { value: 5, label: 'Emre Çelik', data: { code: 'E005', name: 'Emre Çelik', dept: 'Pazarlama', title: 'Marka Yöneticisi' } },
  { value: 6, label: 'Zeynep Arslan', data: { code: 'E006', name: 'Zeynep Arslan', dept: 'Finans', title: 'Muhasebeci' } },
  { value: 7, label: 'Burak Özkan', data: { code: 'E007', name: 'Burak Özkan', dept: 'Mühendislik', title: 'DevOps Mühendisi' } },
  { value: 8, label: 'Selin Yıldız', data: { code: 'E008', name: 'Selin Yıldız', dept: 'Tasarım', title: 'UX Tasarımcı' } },
];

const meta: Meta<typeof MultiColumnCombobox> = {
  title: 'Components/MultiColumnCombobox',
  component: MultiColumnCombobox,
  tags: ['autodocs'],
  args: {
    columns: employeeColumns,
    items: employeeItems,
    placeholder: 'Çalışan arayın...',
  },
};

export default meta;
type Story = StoryObj<typeof MultiColumnCombobox>;

// ── Default ─────────────────────────────────────────────────────────

export const Default: Story = {};

// ── Variants ────────────────────────────────────────────────────────

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const Flushed: Story = {
  args: { variant: 'flushed' },
};

// ── Sizes ───────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: 'sm' },
};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

// ── DefaultValue ────────────────────────────────────────────────────

export const WithDefaultValue: Story = {
  args: { defaultValue: 3 },
};

// ── No Headers ──────────────────────────────────────────────────────

export const NoHeaders: Story = {
  args: { showHeaders: false },
};

// ── Disabled ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 1,
  },
};

// ── ReadOnly ────────────────────────────────────────────────────────

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 2,
  },
};

// ── Controlled ──────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <MultiColumnCombobox
          columns={employeeColumns}
          items={employeeItems}
          placeholder="Çalışan arayın..."
          value={value}
          onValueChange={setValue}
        />
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Seçili: {value !== undefined ? String(value) : '(yok)'}
        </div>
        <button onClick={() => setValue(undefined)} style={{ alignSelf: 'start' }}>
          Sıfırla
        </button>
      </div>
    );
  },
};

// ── Sabit dropdown genişliği ─────────────────────────────────────────

export const FixedDropdownWidth: Story = {
  args: {
    dropdownWidth: '36rem',
  },
};

// ── Dar container — yatay scroll testi ──────────────────────────────

export const NarrowContainer: Story = {
  render: () => (
    <div style={{ width: '200px', border: '1px dashed #ccc', padding: '0.5rem' }}>
      <MultiColumnCombobox
        columns={employeeColumns}
        items={employeeItems}
        placeholder="Çalışan..."
        dropdownWidth="30rem"
      />
    </div>
  ),
};

// ── Dropdown 100% (input genişliğinde) ──────────────────────────────

export const DropdownMatchesInput: Story = {
  args: {
    dropdownWidth: '100%',
  },
};

// ── Custom Slot Styles ──────────────────────────────────────────────

export const CustomSlotStyles: Story = {
  args: {
    classNames: {
      root: 'story-root',
    },
    styles: {
      headerCell: { letterSpacing: '1px', textTransform: 'uppercase' as const },
      cell: { fontSize: '0.8125rem' },
      row: { cursor: 'pointer' },
    },
  },
};
