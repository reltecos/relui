/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Data Entry/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showAlpha: {
      control: 'boolean',
    },
    showInput: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

// ── Default ──

export const Default: Story = {
  args: {
    value: '#3b82f6',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <ColorPicker value="#3b82f6" size="sm" showInput />
      <ColorPicker value="#3b82f6" size="md" showInput />
      <ColorPicker value="#3b82f6" size="lg" showInput />
    </div>
  ),
};

// ── WithAlpha ──

export const WithAlpha: Story = {
  args: {
    value: '#3b82f6',
    showAlpha: true,
    showInput: true,
  },
};

// ── WithPresets ──

export const WithPresets: Story = {
  args: {
    value: '#3b82f6',
    showInput: true,
    presets: [
      '#ef4444',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#64748b',
      '#000000',
      '#ffffff',
    ],
  },
};

// ── WithInput ──

export const WithInput: Story = {
  args: {
    value: '#16a34a',
    showInput: true,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <ColorPicker value="#8b5cf6" size="lg">
      <ColorPicker.Spectrum />
      <ColorPicker.HueSlider />
      <ColorPicker.AlphaSlider />
      <ColorPicker.Input />
      <ColorPicker.Presets colors={['#ef4444', '#3b82f6', '#22c55e', '#eab308']} />
    </ColorPicker>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    value: '#ef4444',
    showAlpha: true,
    showInput: true,
    presets: ['#ef4444', '#3b82f6', '#22c55e'],
    styles: {
      root: { padding: 20 },
      spectrum: { opacity: 0.95 },
    },
  },
};
