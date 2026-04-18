/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { showGrid: { control: 'boolean' }, showDots: { control: 'boolean' }, showLegend: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof LineChart>;

const SERIES = [
  { name: 'Gelir', data: [{ x: 1, y: 10 }, { x: 2, y: 25 }, { x: 3, y: 18 }, { x: 4, y: 32 }, { x: 5, y: 28 }] },
  { name: 'Gider', data: [{ x: 1, y: 8 }, { x: 2, y: 15 }, { x: 3, y: 12 }, { x: 4, y: 22 }, { x: 5, y: 20 }] },
];

export const Default: Story = { args: { series: SERIES, width: 400, height: 250 } };
export const WithDots: Story = { args: { series: SERIES, width: 400, height: 250, showDots: true } };
export const NoGrid: Story = { args: { series: SERIES, width: 400, height: 250, showGrid: false } };
export const SingleSeries: Story = { args: { series: SERIES[0] ? [SERIES[0]] : [], width: 400, height: 250 } };
export const Large: Story = { args: { series: SERIES, width: 600, height: 350, showDots: true } };

export const Compound: Story = {
  render: () => (
    <LineChart series={SERIES} width={400} height={250}>
      <LineChart.Grid />
      <LineChart.YAxis />
      <LineChart.XAxis />
      <LineChart.Series showDots />
      <LineChart.Legend />
    </LineChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: { series: SERIES, width: 400, height: 250, styles: { root: { padding: 8 }, legend: { fontSize: '14px' } } },
};
