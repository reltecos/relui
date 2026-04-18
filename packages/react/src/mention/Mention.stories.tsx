/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Mention } from './Mention';

const items = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
  { id: '4', label: 'David Wilson' },
  { id: '5', label: 'Eve Davis' },
];

const meta: Meta<typeof Mention> = {
  title: 'Input/Mention',
  component: Mention,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Mention>;

export const Default: Story = { args: { items, placeholder: 'Type @ to mention...' } };
export const CustomTrigger: Story = { args: { items, trigger: '#', placeholder: 'Type # to tag...' } };
export const FewItems: Story = { args: { items: items.slice(0, 2), placeholder: 'Type @...' } };
export const EmptyItems: Story = { args: { items: [], placeholder: 'No suggestions available' } };

export const Compound: Story = {
  render: () => (
    <Mention items={items}>
      <Mention.Input placeholder="Type @ to mention..." />
      <Mention.List />
    </Mention>
  ),
};

export const Wide: Story = {
  args: { items, placeholder: 'Type @...', style: { width: 400 } },
};

export const CustomSlotStyles: Story = {
  args: {
    items,
    placeholder: 'Styled mention...',
    styles: {
      root: { padding: 4 },
      input: { fontSize: '16px', padding: '12px 16px' },
      list: { padding: 8 },
      item: { padding: '10px 16px' },
    },
  },
};
