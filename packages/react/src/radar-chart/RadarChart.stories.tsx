/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { RadarChart } from './RadarChart';
import type { RadarAxis, RadarSeries } from '@relteco/relui-core';

const axes: RadarAxis[] = [
  { key: 'speed', label: 'Speed', max: 100 },
  { key: 'power', label: 'Power', max: 100 },
  { key: 'defense', label: 'Defense', max: 100 },
  { key: 'magic', label: 'Magic', max: 100 },
  { key: 'luck', label: 'Luck', max: 100 },
];

const series: RadarSeries[] = [
  { name: 'Warrior', values: { speed: 60, power: 90, defense: 80, magic: 20, luck: 50 } },
  { name: 'Mage', values: { speed: 40, power: 30, defense: 30, magic: 95, luck: 70 } },
];

const meta: Meta<typeof RadarChart> = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = { args: { axes, series } };
export const SingleSeries: Story = { args: { axes, series: [series[0] as RadarSeries] } };
export const LargeSize: Story = { args: { axes, series, size: 300 } };
export const MoreGridLevels: Story = { args: { axes, series, gridLevels: 10 } };
export const NoLegend: Story = { args: { axes, series, showLegend: false } };

export const ThreeAxes: Story = {
  args: {
    axes: [
      { key: 'x', label: 'X', max: 10 },
      { key: 'y', label: 'Y', max: 10 },
      { key: 'z', label: 'Z', max: 10 },
    ],
    series: [{ name: 'Data', values: { x: 8, y: 5, z: 9 } }],
  },
};

export const Compound: Story = {
  render: () => (
    <RadarChart axes={axes} series={series}>
      <RadarChart.Grid />
      <RadarChart.Series />
    </RadarChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    axes, series,
    styles: {
      root: { padding: 16 },
      legend: { padding: 8 },
    },
  },
};
