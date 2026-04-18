/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart', component: BarChart, tags: ['autodocs'], parameters: { layout: 'centered' },
  argTypes: { mode: { control: 'select', options: ['grouped', 'stacked'] }, showGrid: { control: 'boolean' }, showLegend: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof BarChart>;

const S = [{ name: 'Gelir', data: [30, 50, 40, 60] }, { name: 'Gider', data: [20, 35, 25, 40] }];
const C = ['Q1', 'Q2', 'Q3', 'Q4'];

export const Default: Story = { args: { series: S, categories: C } };
export const Stacked: Story = { args: { series: S, categories: C, mode: 'stacked' } };
export const NoGrid: Story = { args: { series: S, categories: C, showGrid: false } };
export const Large: Story = { args: { series: S, categories: C, width: 600, height: 350 } };
export const SingleSeries: Story = { args: { series: S[0] ? [S[0]] : [], categories: C } };

export const Compound: Story = {
  render: () => (
    <BarChart series={S} categories={C}>
      <BarChart.Grid />
      <BarChart.YAxis />
      <BarChart.XAxis />
      <BarChart.Bar />
      <BarChart.Legend />
    </BarChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: { series: S, categories: C, styles: { root: { padding: 8 }, legend: { fontSize: '14px' } } },
};
