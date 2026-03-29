/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Clock } from './Clock';

const meta: Meta<typeof Clock> = {
  title: 'Data Display/Clock',
  component: Clock,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    mode: { control: 'select', options: ['digital', 'analog'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    is24h: { control: 'boolean' },
    showSeconds: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Clock>;

// ── Default (Digital) ──

export const Default: Story = {
  args: {
    mode: 'digital',
    size: 'md',
    showSeconds: true,
  },
};

// ── Analog ──

export const Analog: Story = {
  args: {
    mode: 'analog',
    size: 'lg',
    showSeconds: true,
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <Clock mode="digital" size="sm" />
      <Clock mode="digital" size="md" />
      <Clock mode="digital" size="lg" />
    </div>
  ),
};

// ── AllSizesAnalog ──

export const AllSizesAnalog: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <Clock mode="analog" size="sm" />
      <Clock mode="analog" size="md" />
      <Clock mode="analog" size="lg" />
    </div>
  ),
};

// ── Format24h ──

export const Format24h: Story = {
  args: {
    mode: 'digital',
    is24h: true,
    size: 'lg',
    showSeconds: true,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <Clock size="lg">
        <Clock.Digital />
        <Clock.Period />
      </Clock>
      <Clock mode="analog" size="lg">
        <Clock.Face />
      </Clock>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    mode: 'digital',
    size: 'lg',
    showSeconds: true,
    styles: {
      root: { padding: 16 },
      digital: { letterSpacing: '0.15em', fontWeight: 700 },
      period: { fontSize: 14, opacity: 0.6 },
    },
  },
};
