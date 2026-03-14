/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  args: {
    value: 60,
    size: 'md',
    type: 'bar',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    type: { control: 'select', options: ['bar', 'circular', 'chunk'] },
    color: { control: 'color' },
    chunks: { control: { type: 'number', min: 2, max: 20 } },
    thickness: { control: { type: 'number', min: 1, max: 12 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Yukleniyor...',
    showValue: true,
    value: 65,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Progress value={60} size="xs" label="XS" showValue />
      <Progress value={60} size="sm" label="SM" showValue />
      <Progress value={60} size="md" label="MD" showValue />
      <Progress value={60} size="lg" label="LG" showValue />
      <Progress value={60} size="xl" label="XL" showValue />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Yukleniyor...',
  },
};

export const Striped: Story = {
  args: {
    value: 70,
    striped: true,
    label: 'Striped',
    showValue: true,
  },
};

export const StripedAnimated: Story = {
  args: {
    value: 70,
    striped: true,
    animated: true,
    label: 'Animated Stripes',
    showValue: true,
  },
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Progress value={80} color="#e11d48" label="Kirmizi" showValue />
      <Progress value={60} color="#16a34a" label="Yesil" showValue />
      <Progress value={40} color="#f59e0b" label="Sari" showValue />
      <Progress value={90} color="#7c3aed" label="Mor" showValue />
    </div>
  ),
};

export const Circular: Story = {
  args: {
    type: 'circular',
    value: 75,
    showValue: true,
  },
};

export const CircularSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Progress type="circular" value={75} size="xs" />
      <Progress type="circular" value={75} size="sm" />
      <Progress type="circular" value={75} size="md" showValue />
      <Progress type="circular" value={75} size="lg" showValue />
      <Progress type="circular" value={75} size="xl" showValue />
    </div>
  ),
};

export const CircularIndeterminate: Story = {
  args: {
    type: 'circular',
    indeterminate: true,
    size: 'lg',
  },
};

export const Chunk: Story = {
  args: {
    type: 'chunk',
    value: 60,
    chunks: 5,
    showValue: true,
    label: 'Ilerleme',
  },
};

export const ChunkSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <Progress type="chunk" value={60} chunks={10} size="xs" label="XS" />
      <Progress type="chunk" value={60} chunks={10} size="sm" label="SM" />
      <Progress type="chunk" value={60} chunks={10} size="md" label="MD" />
      <Progress type="chunk" value={60} chunks={10} size="lg" label="LG" />
      <Progress type="chunk" value={60} chunks={10} size="xl" label="XL" />
    </div>
  ),
};

export const FormatValue: Story = {
  args: {
    value: 750,
    min: 0,
    max: 1000,
    showValue: true,
    label: 'Dosya yuklemesi',
    formatValue: (val, pct) => `${val}MB / 1000MB (${Math.round(pct)}%)`,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 400 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'system-ui' }}>Bar</h4>
        <Progress value={65} showValue label="Yukleniyor" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'system-ui' }}>Circular</h4>
        <Progress type="circular" value={65} showValue size="lg" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'system-ui' }}>Chunk</h4>
        <Progress type="chunk" value={65} chunks={8} showValue label="Adimlar" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'system-ui' }}>Indeterminate Bar</h4>
        <Progress indeterminate label="Yukleniyor..." />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'system-ui' }}>Indeterminate Circular</h4>
        <Progress type="circular" indeterminate size="lg" />
      </div>
    </div>
  ),
};
