/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { TransferItemDef } from '@relteco/relui-core';
import { TransferList } from './TransferList';

const fruits: TransferItemDef[] = [
  { id: 'apple', label: 'Elma' },
  { id: 'banana', label: 'Muz' },
  { id: 'cherry', label: 'Kiraz' },
  { id: 'grape', label: 'Uzum' },
  { id: 'mango', label: 'Mango' },
  { id: 'orange', label: 'Portakal' },
  { id: 'peach', label: 'Seftali' },
  { id: 'pear', label: 'Armut' },
  { id: 'plum', label: 'Erik' },
  { id: 'watermelon', label: 'Karpuz' },
];

const meta: Meta<typeof TransferList> = {
  title: 'Data Entry/TransferList',
  component: TransferList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TransferList>;

// ── Default ──

export const Default: Story = {
  args: {
    items: fruits,
  },
};

// ── With Default Target ──

export const WithDefaultTarget: Story = {
  name: 'Baslangic Hedef / With Default Target',
  args: {
    items: fruits,
    defaultTargetIds: ['cherry', 'mango', 'plum'],
  },
};

// ── Disabled Items ──

export const DisabledItems: Story = {
  name: 'Devre Disi Ogeler / Disabled Items',
  args: {
    items: [
      ...fruits.slice(0, 5),
      { id: 'disabled1', label: 'Devre Disi 1', disabled: true },
      { id: 'disabled2', label: 'Devre Disi 2', disabled: true },
    ],
  },
};

// ── Many Items ──

export const ManyItems: Story = {
  name: 'Cok Sayida Oge / Many Items',
  args: {
    items: Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i}`,
      label: `Oge ${i + 1}`,
    })),
  },
};

// ── Compound ──

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <TransferList items={fruits} defaultTargetIds={['banana', 'grape']}>
      <TransferList.SourceList />
      <TransferList.Actions />
      <TransferList.TargetList />
    </TransferList>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    items: fruits,
    styles: {
      root: { padding: 8 },
      sourceList: { padding: '4px' },
      targetList: { padding: '4px' },
    },
    classNames: {
      root: 'custom-tl',
    },
  },
};

// ── Playground ──

export const Playground: Story = {
  args: {
    items: fruits,
    defaultTargetIds: ['apple', 'banana'],
  },
};
