/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    firstDayOfWeek: { control: 'select', options: [0, 1] },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// ── Default ──

export const Default: Story = {
  args: {
    placeholder: 'Tarih secin',
  },
};

// ── WithDefaultValue ──

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '2025-06-15',
  },
};

// ── WithMinMax ──

export const WithMinMax: Story = {
  args: {
    defaultValue: '2025-06-15',
    minDate: '2025-06-05',
    maxDate: '2025-06-25',
  },
};

// ── WithDisabledDates ──

export const WithDisabledDates: Story = {
  args: {
    defaultValue: '2025-06-15',
    disabledDates: (date: string) => {
      const d = new Date(date + 'T00:00:00');
      return d.getDay() === 0 || d.getDay() === 6;
    },
  },
};

// ── SundayFirst ──

export const SundayFirst: Story = {
  args: {
    defaultValue: '2025-06-15',
    firstDayOfWeek: 0,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <DatePicker defaultValue="2025-06-15">
      <DatePicker.Input />
      <DatePicker.Calendar />
    </DatePicker>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    defaultValue: '2025-06-15',
    styles: {
      input: { padding: '12px 16px', fontSize: '16px' },
      calendar: { padding: 16, borderRadius: 12 },
      monthLabel: { fontSize: '16px', fontWeight: '700' },
    },
  },
};
