/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PyramidChart } from './PyramidChart';

const data = [{ label: 'CEO', value: 1 }, { label: 'VP', value: 3 }, { label: 'Director', value: 10 }, { label: 'Manager', value: 30 }, { label: 'Staff', value: 100 }];

const meta: Meta<typeof PyramidChart> = { title: 'Charts/PyramidChart', component: PyramidChart, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof PyramidChart>;

export const Default: Story = { args: { data }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
export const ThreeLayers: Story = { name: 'Uc Katman', args: { data: data.slice(0, 3) }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 500 }}><PyramidChart data={data}><svg viewBox="0 0 400 300" width="100%"><PyramidChart.Segments /><PyramidChart.Labels /></svg></PyramidChart></div>) };
export const CustomSlotStyles: Story = { args: { data, styles: { root: { padding: 8 } }, classNames: { root: 'custom-pc' } }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
export const Small: Story = { name: 'Kucuk', args: { data, width: 250, height: 200 }, decorators: [(S) => <div style={{ width: 300 }}><S /></div>] };
export const Wide: Story = { name: 'Genis', args: { data, width: 600, height: 350 }, decorators: [(S) => <div style={{ width: 700 }}><S /></div>] };
export const Playground: Story = { args: { data }, decorators: [(S) => <div style={{ width: 500 }}><S /></div>] };
