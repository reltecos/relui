/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PieChart } from './PieChart';

const meta: Meta<typeof PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    donut: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    size: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof PieChart>;

const SLICES = [
  { name: 'Chrome', value: 65 },
  { name: 'Firefox', value: 15 },
  { name: 'Safari', value: 12 },
  { name: 'Edge', value: 5 },
  { name: 'Diger', value: 3 },
];

export const Default: Story = { args: { slices: SLICES } };
export const Donut: Story = { args: { slices: SLICES, donut: true } };
export const WithLabels: Story = { args: { slices: SLICES, showLabels: true } };
export const NoLegend: Story = { args: { slices: SLICES, showLegend: false } };
export const LargeSize: Story = { args: { slices: SLICES, size: 300 } };

export const Compound: Story = {
  render: () => (
    <PieChart slices={SLICES} donut>
      <PieChart.Slice />
      <PieChart.Label />
      <PieChart.Legend />
    </PieChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    slices: SLICES,
    styles: { root: { padding: 8 }, legend: { fontSize: '14px' } },
  },
};
