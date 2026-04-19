/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SunburstChart } from './SunburstChart';
import type { SunburstNode } from '@relteco/relui-core';

const data: SunburstNode[] = [
  {
    name: 'Asia',
    value: 300,
    children: [
      { name: 'China', value: 140 },
      { name: 'India', value: 100 },
      { name: 'Japan', value: 60 },
    ],
  },
  {
    name: 'Europe',
    value: 200,
    children: [
      { name: 'Germany', value: 80 },
      { name: 'France', value: 60 },
      { name: 'UK', value: 60 },
    ],
  },
  { name: 'Americas', value: 150 },
];

const meta: Meta<typeof SunburstChart> = {
  title: 'Charts/SunburstChart',
  component: SunburstChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof SunburstChart>;

export const Default: Story = { args: { data } };
export const SmallSize: Story = { args: { data, size: 150 } };
export const LargeSize: Story = { args: { data, size: 400 } };
export const NoLabels: Story = { args: { data, showLabels: false } };
export const NoLegend: Story = { args: { data, showLegend: false } };

export const Compound: Story = {
  render: () => (
    <SunburstChart data={data} size={300}>
      <SunburstChart.Arc />
      <SunburstChart.Label />
    </SunburstChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    data,
    styles: { root: { padding: 16 }, legend: { padding: 8 } },
  },
};
