/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LiveTile } from './LiveTile';

const meta: Meta<typeof LiveTile> = {
  title: 'Data Display/LiveTile',
  component: LiveTile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    animation: {
      control: 'select',
      options: ['slide', 'flip', 'fade'],
    },
    interval: {
      control: 'number',
    },
    paused: {
      control: 'boolean',
    },
    showIndicator: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LiveTile>;

const makeFace = (text: string, bg: string) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bg,
      color: 'var(--rel-color-bg, #ffffff)',
      fontSize: 'var(--rel-text-2xl, 24px)',
      fontWeight: 700,
    }}
  >
    {text}
  </div>
);

const FACES = [
  makeFace('Face 1', 'var(--rel-color-primary, #3b82f6)'),
  makeFace('Face 2', 'var(--rel-color-success, #10b981)'),
  makeFace('Face 3', 'var(--rel-color-warning, #f59e0b)'),
];

// ── Default ──

export const Default: Story = {
  args: {
    faces: FACES,
    interval: 3000,
    animation: 'slide',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <LiveTile faces={FACES} size="sm" paused />
      <LiveTile faces={FACES} size="md" paused />
      <LiveTile faces={FACES} size="lg" paused />
    </div>
  ),
};

// ── SlideAnimation ──

export const SlideAnimation: Story = {
  args: {
    faces: FACES,
    animation: 'slide',
    interval: 2000,
  },
};

// ── FlipAnimation ──

export const FlipAnimation: Story = {
  args: {
    faces: FACES,
    animation: 'flip',
    interval: 2000,
  },
};

// ── FadeAnimation ──

export const FadeAnimation: Story = {
  args: {
    faces: FACES,
    animation: 'fade',
    interval: 2000,
  },
};

// ── Paused ──

export const Paused: Story = {
  args: {
    faces: FACES,
    paused: true,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <LiveTile animation="fade" interval={2500} size="lg">
      {makeFace('Haber 1', 'var(--rel-color-primary, #3b82f6)')}
      {makeFace('Haber 2', 'var(--rel-color-error, #ef4444)')}
      {makeFace('Haber 3', 'var(--rel-color-info, #8b5cf6)')}
    </LiveTile>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    faces: FACES,
    paused: true,
    styles: {
      root: { padding: 4 },
    },
  },
};
