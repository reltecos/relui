/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Data Display/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['circle', 'square'],
    },
    max: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const ITEMS = [
  { name: 'Ali Veli' },
  { name: 'Zeynep Kara' },
  { name: 'Mehmet Oz' },
  { name: 'Ayse Yilmaz' },
  { name: 'Can Demir' },
];

// ── Default ──

export const Default: Story = {
  args: {
    items: ITEMS,
    size: 'md',
  },
};

// ── WithMax ──

export const WithMax: Story = {
  args: {
    items: ITEMS,
    max: 3,
    size: 'md',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 30, fontSize: 12, color: 'var(--rel-color-text-muted, #6b7280)' }}>{size}</span>
          <AvatarGroup items={ITEMS} size={size} max={3} />
        </div>
      ))}
    </div>
  ),
};

// ── SquareVariant ──

export const SquareVariant: Story = {
  args: {
    items: ITEMS,
    max: 4,
    size: 'lg',
    variant: 'square',
  },
};

// ── WithImages ──

export const WithImages: Story = {
  args: {
    items: [
      {
        name: 'Ali Veli',
        src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      },
      {
        name: 'Zeynep Kara',
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      { name: 'Mehmet Oz' },
      { name: 'Ayse Yilmaz' },
    ],
    max: 3,
    size: 'lg',
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <AvatarGroup size="lg" max={3}>
      <AvatarGroup.Avatar name="Ali Veli" />
      <AvatarGroup.Avatar name="Zeynep Kara" />
      <AvatarGroup.Avatar name="Mehmet Oz" />
      <AvatarGroup.Avatar name="Ayse Yilmaz" />
      <AvatarGroup.Avatar name="Can Demir" />
    </AvatarGroup>
  ),
};

// ── CompoundSquare ──

export const CompoundSquare: Story = {
  render: () => (
    <AvatarGroup size="lg" variant="square">
      <AvatarGroup.Avatar name="Ali Veli" />
      <AvatarGroup.Avatar name="Zeynep Kara" />
      <AvatarGroup.Avatar name="Mehmet Oz" />
    </AvatarGroup>
  ),
};
