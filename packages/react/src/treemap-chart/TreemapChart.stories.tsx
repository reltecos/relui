/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TreemapChart } from './TreemapChart';
import type { TreemapNode } from '@relteco/relui-core';

const data: TreemapNode[] = [
  { name: 'Engineering', value: 120 },
  { name: 'Marketing', value: 80 },
  { name: 'Sales', value: 60 },
  { name: 'Design', value: 40 },
  { name: 'HR', value: 20 },
];

const hierarchicalData: TreemapNode[] = [
  {
    name: 'Tech',
    value: 200,
    children: [
      { name: 'Frontend', value: 80 },
      { name: 'Backend', value: 120 },
    ],
  },
  { name: 'Ops', value: 50 },
];

const meta: Meta<typeof TreemapChart> = {
  title: 'Charts/TreemapChart',
  component: TreemapChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Default: Story = { args: { data } };
export const Hierarchical: Story = { args: { data: hierarchicalData } };
export const NoLabels: Story = { args: { data, showLabels: false } };
export const NoLegend: Story = { args: { data, showLegend: false } };
export const CustomSize: Story = { args: { data, width: 600, height: 400 } };

export const Compound: Story = {
  render: () => (
    <TreemapChart data={data}>
      <TreemapChart.Cell />
      <TreemapChart.Label />
    </TreemapChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    data,
    styles: { root: { padding: 16 }, legend: { padding: 8 } },
  },
};
