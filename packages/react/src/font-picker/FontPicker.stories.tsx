/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FontPicker } from './FontPicker';

const meta: Meta<typeof FontPicker> = {
  title: 'Input/FontPicker',
  component: FontPicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    showPreview: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FontPicker>;

export const Default: Story = { args: {} };

export const WithDefaults: Story = {
  args: { defaultConfig: { family: 'Georgia', size: 20, bold: true } },
};

export const NoPreview: Story = {
  args: { showPreview: false },
};

export const CustomFonts: Story = {
  args: { fonts: ['Inter', 'JetBrains Mono', 'Playfair Display', 'Roboto', 'Open Sans'] },
};

export const SmallSize: Story = {
  args: { defaultConfig: { size: 12 }, style: { width: 280 } },
};

export const Compound: Story = {
  render: () => (
    <FontPicker>
      <FontPicker.FamilySelect />
      <FontPicker.SizeInput />
      <FontPicker.StyleToggle />
      <FontPicker.Preview />
    </FontPicker>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    styles: {
      root: { padding: 20, borderRadius: 12 },
      preview: { padding: '24px 20px' },
      label: { letterSpacing: '0.1em' },
    },
  },
};
