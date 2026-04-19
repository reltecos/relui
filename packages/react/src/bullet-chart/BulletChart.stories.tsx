/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BulletChart } from './BulletChart';

const data = [
  { label: 'Revenue', value: 270, target: 250, ranges: [{ label: 'Poor', value: 150 }, { label: 'OK', value: 225 }, { label: 'Good', value: 300 }] },
  { label: 'Profit', value: 35, target: 50, ranges: [{ label: 'Poor', value: 20 }, { label: 'OK', value: 40 }, { label: 'Good', value: 60 }] },
];

const meta: Meta<typeof BulletChart> = { title: 'Charts/BulletChart', component: BulletChart, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof BulletChart>;

export const Default: Story = { args: { data }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
export const SingleMetric: Story = { name: 'Tek Metrik', args: { data: data.slice(0, 1) }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
export const Compound: Story = { render: () => (<BulletChart data={data}><svg viewBox="0 0 400 108" width="100%"><BulletChart.Bars /></svg></BulletChart>) };
export const CustomSlotStyles: Story = { args: { data, styles: { root: { padding: 8 } }, classNames: { root: 'custom-bc' } }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
export const Wide: Story = { name: 'Genis', args: { data, width: 600 }, decorators: [(S) => <div style={{ width: 700 }}><S /></div>] };
export const ManyMetrics: Story = { name: 'Cok Metrik', args: { data: [...data, { label: 'Growth', value: 15, target: 20, ranges: [{ label: 'P', value: 10 }, { label: 'O', value: 18 }, { label: 'G', value: 25 }] }] }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
export const Playground: Story = { args: { data }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
