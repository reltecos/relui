/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import type { CalendarEventDef } from '@relteco/relui-core';

const sampleEvents: CalendarEventDef[] = [
  { id: '1', title: 'Toplanti', start: new Date(2025, 2, 10, 10, 0), end: new Date(2025, 2, 10, 11, 0) },
  { id: '2', title: 'Ogle Yemegi', start: new Date(2025, 2, 15, 12, 0), end: new Date(2025, 2, 15, 13, 0) },
  { id: '3', title: 'Sprint Demo', start: new Date(2025, 2, 20, 14, 0), end: new Date(2025, 2, 20, 15, 0) },
  { id: '4', title: 'Release', start: new Date(2025, 2, 25, 9, 0), end: new Date(2025, 2, 25, 17, 0), color: 'var(--rel-color-success, #16a34a)' },
];

const meta: Meta<typeof Calendar> = {
  title: 'Data Display/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    defaultView: { control: 'select', options: ['month', 'week', 'day'] },
    locale: { control: 'select', options: ['en-US', 'tr-TR', 'de-DE'] },
  },
};
export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: { defaultDate: new Date(2025, 2, 15), locale: 'en-US' },
};

export const WithEvents: Story = {
  args: { defaultDate: new Date(2025, 2, 15), events: sampleEvents, locale: 'en-US' },
};

export const TurkishLocale: Story = {
  args: { defaultDate: new Date(2025, 2, 15), events: sampleEvents, locale: 'tr-TR' },
};

export const GermanLocale: Story = {
  args: { defaultDate: new Date(2025, 2, 15), events: sampleEvents, locale: 'de-DE' },
};

export const SundayStart: Story = {
  args: { defaultDate: new Date(2025, 2, 15), weekStartsOn: 0, locale: 'en-US' },
};

export const Compound: Story = {
  render: () => (
    <Calendar defaultDate={new Date(2025, 2, 15)} events={sampleEvents}>
      <Calendar.Header />
      <Calendar.Grid />
    </Calendar>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    defaultDate: new Date(2025, 2, 15),
    events: sampleEvents,
    styles: {
      root: { borderRadius: 16 },
      header: { padding: '16px 20px' },
      grid: { fontSize: '13px' },
    },
  },
};
