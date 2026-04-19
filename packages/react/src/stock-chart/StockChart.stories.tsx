/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { StockChart } from './StockChart';
import type { StockDataPoint } from '@relteco/relui-core';

const data: StockDataPoint[] = [
  { date: '2024-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000 },
  { date: '2024-01-02', open: 105, high: 115, low: 100, close: 98, volume: 1200 },
  { date: '2024-01-03', open: 98, high: 108, low: 92, close: 106, volume: 800 },
  { date: '2024-01-04', open: 106, high: 112, low: 104, close: 103, volume: 900 },
  { date: '2024-01-05', open: 103, high: 118, low: 102, close: 115, volume: 1500 },
  { date: '2024-01-06', open: 115, high: 120, low: 110, close: 112, volume: 1100 },
  { date: '2024-01-07', open: 112, high: 125, low: 108, close: 122, volume: 1800 },
  { date: '2024-01-08', open: 122, high: 130, low: 118, close: 116, volume: 1400 },
  { date: '2024-01-09', open: 116, high: 121, low: 112, close: 119, volume: 950 },
  { date: '2024-01-10', open: 119, high: 128, low: 115, close: 126, volume: 2000 },
];

const meta: Meta<typeof StockChart> = {
  title: 'Charts/StockChart',
  component: StockChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof StockChart>;

export const Default: Story = { args: { data } };
export const FewCandles: Story = { args: { data: data.slice(0, 3) } };
export const NoVolume: Story = { args: { data, showVolume: false } };
export const NoLegend: Story = { args: { data, showLegend: false } };
export const CustomSize: Story = { args: { data, width: 800, height: 500 } };

export const Compound: Story = {
  render: () => (
    <StockChart data={data}>
      <StockChart.Candle />
      <StockChart.Volume />
      <StockChart.Axis />
    </StockChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    data,
    styles: { root: { padding: 16 }, legend: { padding: 8 } },
  },
};
