/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Cascader } from './Cascader';
import type { CascaderOption, CascaderValue } from '@relteco/relui-core';

// ── Sample Data ─────────────────────────────────────────────────────

const locationOptions: CascaderOption[] = [
  {
    value: 'tr',
    label: 'Türkiye',
    children: [
      {
        value: 'ist',
        label: 'İstanbul',
        children: [
          { value: 'kad', label: 'Kadıköy' },
          { value: 'bes', label: 'Beşiktaş' },
          { value: 'usk', label: 'Üsküdar' },
          { value: 'sis', label: 'Şişli' },
        ],
      },
      {
        value: 'ank',
        label: 'Ankara',
        children: [
          { value: 'cank', label: 'Çankaya' },
          { value: 'kec', label: 'Keçiören' },
        ],
      },
      {
        value: 'izm',
        label: 'İzmir',
        children: [
          { value: 'als', label: 'Alsancak' },
          { value: 'bor', label: 'Bornova' },
        ],
      },
    ],
  },
  {
    value: 'us',
    label: 'ABD',
    children: [
      {
        value: 'ny',
        label: 'New York',
        children: [
          { value: 'man', label: 'Manhattan' },
          { value: 'bkl', label: 'Brooklyn' },
        ],
      },
      {
        value: 'ca',
        label: 'California',
        children: [
          { value: 'la', label: 'Los Angeles' },
          { value: 'sf', label: 'San Francisco' },
        ],
      },
    ],
  },
  {
    value: 'de',
    label: 'Almanya',
    children: [
      { value: 'ber', label: 'Berlin' },
      { value: 'mun', label: 'Münih' },
    ],
  },
];

const categoryOptions: CascaderOption[] = [
  {
    value: 'electronics',
    label: 'Elektronik',
    children: [
      {
        value: 'phones',
        label: 'Telefonlar',
        children: [
          { value: 'iphone', label: 'iPhone' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'xiaomi', label: 'Xiaomi' },
        ],
      },
      {
        value: 'laptops',
        label: 'Laptoplar',
        children: [
          { value: 'macbook', label: 'MacBook' },
          { value: 'thinkpad', label: 'ThinkPad' },
        ],
      },
    ],
  },
  {
    value: 'clothing',
    label: 'Giyim',
    children: [
      { value: 'mens', label: 'Erkek' },
      { value: 'womens', label: 'Kadın' },
      { value: 'kids', label: 'Çocuk', disabled: true },
    ],
  },
];

// ── Meta ────────────────────────────────────────────────────────────

const meta: Meta<typeof Cascader> = {
  title: 'Selects/Cascader',
  component: Cascader,
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    displayMode: {
      control: 'select',
      options: ['full', 'last'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Cascader>;

// ── Stories ─────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Konum seçin',
    variant: 'outline',
    size: 'md',
  },
};

export const WithDefaultValue: Story = {
  name: 'Varsayılan Değer / Default Value',
  args: {
    options: locationOptions,
    defaultValue: ['tr', 'ist', 'kad'],
    variant: 'outline',
    size: 'md',
  },
};

export const LastDisplayMode: Story = {
  name: 'Son Etiket Modu / Last Display Mode',
  args: {
    options: locationOptions,
    defaultValue: ['tr', 'ist', 'kad'],
    displayMode: 'last',
  },
};

export const CustomSeparator: Story = {
  name: 'Özel Ayırıcı / Custom Separator',
  args: {
    options: locationOptions,
    defaultValue: ['tr', 'ist'],
    separator: ' → ',
  },
};

export const Categories: Story = {
  name: 'Kategoriler / Categories',
  args: {
    options: categoryOptions,
    placeholder: 'Kategori seçin',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Cascader options={locationOptions} placeholder="Outline" variant="outline" />
      <Cascader options={locationOptions} placeholder="Filled" variant="filled" />
      <Cascader options={locationOptions} placeholder="Flushed" variant="flushed" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Cascader options={locationOptions} placeholder="XS" size="xs" />
      <Cascader options={locationOptions} placeholder="SM" size="sm" />
      <Cascader options={locationOptions} placeholder="MD" size="md" />
      <Cascader options={locationOptions} placeholder="LG" size="lg" />
      <Cascader options={locationOptions} placeholder="XL" size="xl" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    options: locationOptions,
    defaultValue: ['tr', 'ist'],
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    options: locationOptions,
    defaultValue: ['tr', 'ist'],
    readOnly: true,
  },
};

export const Controlled: Story = {
  name: 'Controlled / Kontrollü',
  render: () => {
    const [value, setValue] = useState<CascaderValue[]>(['tr', 'ist']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <Cascader
          options={locationOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Konum seçin"
        />
        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          Seçili yol: <strong>{value.join(' → ')}</strong>
        </div>
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Cascader
        options={locationOptions}
        placeholder="Root styled"
        styles={{ root: { padding: '4px' } }}
      />
      <Cascader
        options={locationOptions}
        placeholder="Trigger styled"
        styles={{ trigger: { fontWeight: 'bold' } }}
      />
    </div>
  ),
};
