/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Gauge } from './Gauge';

const meta: Meta<typeof Gauge> = {
  title: 'Charts/Gauge',
  component: Gauge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof Gauge>;

export const Default: Story = { args: { value: 65, label: 'Hiz' } };

export const WithSegments: Story = {
  args: {
    value: 75,
    label: 'Performans',
    segments: [
      { from: 0, to: 40, color: 'var(--rel-color-error, #ef4444)' },
      { from: 40, to: 70, color: 'var(--rel-color-warning, #f59e0b)' },
      { from: 70, to: 100, color: 'var(--rel-color-success, #10b981)' },
    ],
  },
};

export const FullCircle: Story = {
  args: { value: 42, startAngle: -180, endAngle: 180, label: 'CPU' },
};

export const Semicircle: Story = {
  args: { value: 80, startAngle: -90, endAngle: 90, label: 'Doluluk' },
};

export const LargeSize: Story = {
  args: { value: 90, label: 'Sicaklik', size: 240 },
};

export const Compound: Story = {
  render: () => (
    <Gauge value={60}>
      <Gauge.Arc />
      <Gauge.Needle />
      <Gauge.Value />
      <Gauge.Label>RPM</Gauge.Label>
    </Gauge>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    value: 55,
    label: 'Enerji',
    styles: {
      root: { padding: 8 },
      value: { fontSize: '28px', fontWeight: '800' },
    },
  },
};
