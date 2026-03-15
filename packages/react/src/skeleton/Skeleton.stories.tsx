/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'text',
    animation: 'shimmer',
  },
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
    animation: { control: 'select', options: ['shimmer', 'pulse', 'none'] },
    width: { control: 'text' },
    height: { control: 'text' },
    radius: { control: 'number' },
    lines: { control: { type: 'number', min: 1, max: 10 } },
    lineGap: { control: { type: 'number', min: 2, max: 24 } },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '100%',
    height: 16,
  },
};

export const TextLines: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <Skeleton lines={4} height={14} />
    </div>
  ),
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 64,
  },
};

export const Rect: Story = {
  args: {
    variant: 'rect',
    width: '100%',
    height: 200,
    radius: 8,
  },
};

export const PulseAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <Skeleton animation="pulse" height={16} />
      <Skeleton animation="pulse" height={16} width="80%" />
      <Skeleton animation="pulse" height={16} width="60%" />
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div
      style={{
        width: 320,
        padding: 16,
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Skeleton variant="rect" width="100%" height={180} radius={8} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" width={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={14} width="70%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <Skeleton lines={3} height={12} />
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', width: 300 }}>
      <Skeleton variant="circle" width={56} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="90%" />
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton variant="circle" width={32} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Skeleton height={14} width={`${80 - i * 10}%`} />
            <Skeleton height={10} width="50%" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div
      style={{
        width: 320,
        padding: 16,
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Skeleton compound>
        <Skeleton.Rect width="100%" height={180} radius={8} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
          <Skeleton.Circle width={40} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton.Text height={14} width="70%" />
            <Skeleton.Text height={12} width="40%" />
          </div>
        </div>
        <Skeleton.Text lines={3} height={12} />
      </Skeleton>
    </div>
  ),
};

export const LoadedState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      <div>
        <p style={{ margin: '0 0 4px', fontFamily: 'system-ui', fontSize: 12, color: '#888' }}>
          loaded=false (skeleton)
        </p>
        <Skeleton loaded={false} height={16}>
          <span>Bu metin skeleton iken gorunmez</span>
        </Skeleton>
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontFamily: 'system-ui', fontSize: 12, color: '#888' }}>
          loaded=true (icerik)
        </p>
        <Skeleton loaded={true} height={16}>
          <span style={{ fontFamily: 'system-ui' }}>Gercek icerik burada!</span>
        </Skeleton>
      </div>
    </div>
  ),
};
