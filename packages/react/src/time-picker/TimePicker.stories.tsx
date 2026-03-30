/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Form/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    is24h: {
      control: 'boolean',
    },
    showSeconds: {
      control: 'boolean',
    },
    step: {
      control: 'number',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// ── Default ──

export const Default: Story = {
  args: {
    placeholder: 'Select time',
  },
};

// ── Format24h ──

export const Format24h: Story = {
  args: {
    defaultValue: '14:30',
    is24h: true,
  },
};

// ── WithSeconds ──

export const WithSeconds: Story = {
  args: {
    defaultValue: '09:15:30',
    showSeconds: true,
  },
};

// ── WithStep ──

export const WithStep: Story = {
  args: {
    step: 15,
    placeholder: 'Quarter hours',
  },
};

// ── WithMinMax ──

export const WithMinMax: Story = {
  args: {
    minTime: '09:00',
    maxTime: '17:00',
    defaultValue: '12:00',
    is24h: true,
    placeholder: 'Working hours',
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <TimePicker defaultValue="10:30">
      <TimePicker.Input placeholder="Choose time" />
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        <TimePicker.HourColumn />
        <TimePicker.MinuteColumn />
        <TimePicker.Period />
      </div>
    </TimePicker>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    defaultValue: '14:30',
    is24h: true,
    styles: {
      root: { padding: 8 },
      input: { fontSize: 16, fontWeight: 600 },
      dropdown: { padding: 12 },
    },
  },
};
