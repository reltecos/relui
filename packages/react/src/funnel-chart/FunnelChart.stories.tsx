/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FunnelChart } from './FunnelChart';

const layers = [
  { name: 'Visitors', value: 5000 },
  { name: 'Signups', value: 3200 },
  { name: 'Active Users', value: 1800 },
  { name: 'Paid Users', value: 800 },
  { name: 'Enterprise', value: 200 },
];

const meta: Meta<typeof FunnelChart> = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof FunnelChart>;

export const Default: Story = { args: { layers } };
export const ThreeLayers: Story = { args: { layers: layers.slice(0, 3) } };
export const NoLabels: Story = { args: { layers, showLabels: false } };
export const NoLegend: Story = { args: { layers, showLegend: false } };
export const CustomSize: Story = { args: { layers, width: 400, height: 400 } };

export const Compound: Story = {
  render: () => (
    <FunnelChart layers={layers}>
      <FunnelChart.Layer />
      <FunnelChart.Label />
    </FunnelChart>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    layers,
    styles: { root: { padding: 16 }, legend: { padding: 8 } },
  },
};
