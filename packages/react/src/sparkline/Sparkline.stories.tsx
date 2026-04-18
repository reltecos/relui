/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from './Sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    mode: { control: 'select', options: ['line', 'bar', 'area'] },
    showDots: { control: 'boolean' },
    width: { control: 'number' },
    height: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

const DEMO_DATA = [10, 25, 15, 30, 20, 35, 28, 40, 32, 45];

// ── Default (Line) ──

export const Default: Story = {
  args: {
    data: DEMO_DATA,
    mode: 'line',
    width: 150,
    height: 40,
  },
};

// ── Area ──

export const Area: Story = {
  args: {
    data: DEMO_DATA,
    mode: 'area',
    width: 150,
    height: 40,
  },
};

// ── Bar ──

export const Bar: Story = {
  args: {
    data: DEMO_DATA,
    mode: 'bar',
    width: 150,
    height: 40,
  },
};

// ── WithDots ──

export const WithDots: Story = {
  args: {
    data: DEMO_DATA,
    mode: 'line',
    showDots: true,
    width: 150,
    height: 40,
  },
};

// ── AllModes ──

export const AllModes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #6b7280)', marginBottom: 4 }}>Line</div>
        <Sparkline data={DEMO_DATA} mode="line" width={120} height={32} />
      </div>
      <div>
        <div style={{ fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #6b7280)', marginBottom: 4 }}>Area</div>
        <Sparkline data={DEMO_DATA} mode="area" width={120} height={32} />
      </div>
      <div>
        <div style={{ fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #6b7280)', marginBottom: 4 }}>Bar</div>
        <Sparkline data={DEMO_DATA} mode="bar" width={120} height={32} />
      </div>
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <Sparkline data={DEMO_DATA} width={150} height={40} color="var(--rel-color-success, #10b981)">
      <Sparkline.Area />
      <Sparkline.Line />
      <Sparkline.Point radius={2.5} />
    </Sparkline>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    data: DEMO_DATA,
    mode: 'line',
    showDots: true,
    width: 150,
    height: 40,
    styles: {
      root: { padding: 4 },
      line: { opacity: 0.8 },
    },
  },
};

// ── InlineUsage ──

export const InlineUsage: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)', color: 'var(--rel-color-text, #374151)' }}>
      <span style={{ fontSize: 'var(--rel-text-sm, 14px)' }}>Gelir:</span>
      <Sparkline data={[5, 10, 8, 15, 12, 20, 18]} mode="line" width={80} height={24} color="var(--rel-color-success, #10b981)" />
      <span style={{ fontSize: 'var(--rel-text-sm, 14px)', fontWeight: 600 }}>$12.5K</span>
    </div>
  ),
};
