/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { WaterfallChart } from './WaterfallChart';

const data = [
  { label: 'Baslangic', value: 500, type: 'increase' as const },
  { label: 'Satis', value: 200, type: 'increase' as const },
  { label: 'Gider', value: 150, type: 'decrease' as const },
  { label: 'Vergi', value: 80, type: 'decrease' as const },
  { label: 'Net', value: 0, type: 'total' as const },
];

const meta: Meta<typeof WaterfallChart> = { title: 'Charts/WaterfallChart', component: WaterfallChart, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof WaterfallChart>;

export const Default: Story = { args: { data }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const Small: Story = { name: 'Kucuk', args: { data, width: 350, height: 200 }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 600 }}><WaterfallChart data={data}><svg viewBox="0 0 500 300" width="100%"><WaterfallChart.Bars /><WaterfallChart.Axis /></svg></WaterfallChart></div>) };
export const CustomSlotStyles: Story = { args: { data, styles: { root: { padding: 8 } }, classNames: { root: 'custom-wc' } }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const OnlyIncreases: Story = { name: 'Sadece Artis', args: { data: [{ label: 'A', value: 100, type: 'increase' as const }, { label: 'B', value: 200, type: 'increase' as const }, { label: 'C', value: 50, type: 'increase' as const }, { label: 'Toplam', value: 0, type: 'total' as const }] }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const WithDecreases: Story = { name: 'Artis ve Azalis', args: { data }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const Playground: Story = { args: { data }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
