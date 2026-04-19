/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BoxPlotChart } from './BoxPlotChart';

const data = [
  { label: 'Q1', min: 10, q1: 20, median: 30, q3: 40, max: 50, outliers: [5, 55] },
  { label: 'Q2', min: 15, q1: 25, median: 35, q3: 45, max: 55 },
  { label: 'Q3', min: 8, q1: 18, median: 28, q3: 38, max: 48, outliers: [2] },
  { label: 'Q4', min: 20, q1: 30, median: 40, q3: 50, max: 60 },
];

const meta: Meta<typeof BoxPlotChart> = { title: 'Charts/BoxPlotChart', component: BoxPlotChart, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof BoxPlotChart>;

export const Default: Story = { args: { data }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const TwoGroups: Story = { name: 'Iki Grup', args: { data: data.slice(0, 2) }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const WithOutliers: Story = { name: 'Outlier li', args: { data: [data[0] ?? data[0], data[2] ?? data[2]].filter(Boolean) }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 600 }}><BoxPlotChart data={data}><svg viewBox="0 0 500 300" width="100%"><BoxPlotChart.Boxes /><BoxPlotChart.Axis /></svg></BoxPlotChart></div>) };
export const CustomSlotStyles: Story = { args: { data, styles: { root: { padding: 8 } }, classNames: { root: 'custom-bp' } }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const Small: Story = { name: 'Kucuk', args: { data, width: 300, height: 200 }, decorators: [(S) => <div style={{ width: 350 }}><S /></div>] };
export const Playground: Story = { args: { data }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
