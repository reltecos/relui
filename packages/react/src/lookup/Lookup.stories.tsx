/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Lookup } from './Lookup';
import type { LookupItem } from '@relteco/relui-core';

const allItems: LookupItem[] = [
  { id: '1', label: 'Istanbul' },
  { id: '2', label: 'Ankara' },
  { id: '3', label: 'Izmir' },
  { id: '4', label: 'Bursa' },
  { id: '5', label: 'Antalya' },
  { id: '6', label: 'Adana' },
  { id: '7', label: 'Konya' },
  { id: '8', label: 'Gaziantep' },
];

const mockSearch = (query: string): Promise<LookupItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())));
    }, 200);
  });
};

const meta: Meta<typeof Lookup> = {
  title: 'Input/Lookup',
  component: Lookup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Lookup>;

export const Default: Story = {
  args: { onSearch: mockSearch, placeholder: 'Sehir ara...' },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const MinChars3: Story = {
  args: { onSearch: mockSearch, placeholder: 'En az 3 karakter...', minChars: 3 },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const FastDebounce: Story = {
  args: { onSearch: mockSearch, placeholder: 'Hizli arama...', debounce: 100 },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const SlowDebounce: Story = {
  args: { onSearch: mockSearch, placeholder: 'Yavas arama...', debounce: 1000 },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const NoResults: Story = {
  args: {
    onSearch: () => Promise.resolve([]),
    placeholder: 'Sonuc bulunamayacak...',
  },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const Compound: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <Lookup onSearch={mockSearch}>
        <Lookup.Input placeholder="Compound arama..." />
        <Lookup.List />
      </Lookup>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    onSearch: mockSearch,
    placeholder: 'Styled...',
    styles: {
      root: { padding: 4 },
      input: { fontSize: '16px', padding: '12px 16px' },
      list: { padding: 8 },
      item: { padding: '10px 16px' },
    },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};
