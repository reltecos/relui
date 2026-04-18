/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { EmojiPicker } from './EmojiPicker';

const meta: Meta<typeof EmojiPicker> = {
  title: 'Input/EmojiPicker',
  component: EmojiPicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    columns: { control: { type: 'number', min: 4, max: 12 } },
    showSkinTone: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof EmojiPicker>;

export const Default: Story = { args: {} };

export const WithSkinTone: Story = { args: { showSkinTone: true } };

export const NarrowGrid: Story = { args: { columns: 6, style: { width: 260 } } };

export const WideGrid: Story = { args: { columns: 10, style: { width: 380 } } };

export const AnimalsCategory: Story = { args: { defaultCategory: 'animals' } };

export const Compound: Story = {
  render: () => (
    <EmojiPicker>
      <EmojiPicker.Search />
      <EmojiPicker.Categories />
      <EmojiPicker.Grid />
      <EmojiPicker.SkinToneSelector />
    </EmojiPicker>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    styles: {
      root: { borderRadius: 16, width: 340 },
      search: { padding: '12px 16px' },
      grid: { padding: 12 },
      categories: { padding: '8px 12px' },
    },
  },
};
