/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Heatmap } from './Heatmap';

const meta: Meta<typeof Heatmap> = {
  title: 'Charts/Heatmap', component: Heatmap, tags: ['autodocs'], parameters: { layout: 'centered' },
  argTypes: { showLegend: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof Heatmap>;

const DATA = [[1, 5, 3, 8], [8, 2, 7, 4], [4, 9, 6, 3], [6, 3, 5, 7]];
const RL = ['Pzt', 'Sal', 'Car', 'Per'];
const CL = ['09:00', '12:00', '15:00', '18:00'];

export const Default: Story = { args: { data: DATA, rowLabels: RL, colLabels: CL } };
export const Large: Story = { args: { data: DATA, rowLabels: RL, colLabels: CL, width: 500, height: 350 } };
export const NoLegend: Story = { args: { data: DATA, rowLabels: RL, colLabels: CL, showLegend: false } };
export const NoLabels: Story = { args: { data: DATA } };
export const SmallGrid: Story = { args: { data: [[1, 2], [3, 4]], rowLabels: ['A', 'B'], colLabels: ['X', 'Y'] } };

export const Compound: Story = {
  render: () => (
    <Heatmap data={DATA} rowLabels={RL} colLabels={CL}>
      <Heatmap.Grid />
      <Heatmap.XAxis />
      <Heatmap.YAxis />
      <Heatmap.Legend />
    </Heatmap>
  ),
};

export const CustomSlotStyles: Story = {
  args: { data: DATA, rowLabels: RL, colLabels: CL, styles: { root: { padding: 8 }, legend: { fontSize: '14px' } } },
};
