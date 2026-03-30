/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Form/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    firstDayOfWeek: { control: 'select', options: [0, 1] },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

// ── Default ──

export const Default: Story = {
  args: {
    placeholderStart: 'Baslangic tarih',
    placeholderEnd: 'Bitis tarih',
  },
};

// ── WithDefaultDates ──

export const WithDefaultDates: Story = {
  args: {
    defaultStartDate: '2025-06-01',
    defaultEndDate: '2025-06-15',
  },
};

// ── WithPresets ──

export const WithPresets: Story = {
  args: {
    defaultStartDate: '2025-06-01',
    presets: [
      { label: 'Son 7 gun', startDate: '2025-06-08', endDate: '2025-06-15' },
      { label: 'Son 30 gun', startDate: '2025-05-16', endDate: '2025-06-15' },
      { label: 'Bu ay', startDate: '2025-06-01', endDate: '2025-06-30' },
    ],
  },
};

// ── WithMinMax ──

export const WithMinMax: Story = {
  args: {
    defaultStartDate: '2025-06-10',
    minDate: '2025-06-05',
    maxDate: '2025-06-25',
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <DateRangePicker defaultStartDate="2025-06-01" defaultEndDate="2025-06-15">
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <DateRangePicker.StartInput />
        <span style={{ color: 'var(--rel-color-text-secondary, #6b7280)' }}>—</span>
        <DateRangePicker.EndInput />
      </div>
      <DateRangePicker.Calendar />
    </DateRangePicker>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    defaultStartDate: '2025-06-01',
    defaultEndDate: '2025-06-15',
    styles: {
      startInput: { padding: '12px 16px', fontSize: '16px' },
      endInput: { padding: '12px 16px', fontSize: '16px' },
      calendar: { padding: 16, borderRadius: 12 },
      monthLabel: { fontSize: '16px', fontWeight: '700' },
    },
  },
};

// ── WithDisabledWeekends ──

export const WithDisabledWeekends: Story = {
  args: {
    defaultStartDate: '2025-06-10',
    disabledDates: (date: string) => {
      const d = new Date(date + 'T00:00:00');
      return d.getDay() === 0 || d.getDay() === 6;
    },
  },
};
