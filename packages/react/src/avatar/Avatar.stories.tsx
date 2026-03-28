/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['circle', 'square'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ── Default (Initials) ──

export const Default: Story = {
  args: { name: 'Ali Veli', size: 'md', variant: 'circle' },
};

// ── WithImage ──

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    name: 'Ali Veli',
    size: 'lg',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} name={`Size ${size}`} size={size} />
      ))}
    </div>
  ),
};

// ── Variants ──

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar name="Ali Veli" variant="circle" size="lg" />
      <Avatar name="Ali Veli" variant="square" size="lg" />
    </div>
  ),
};

// ── Token Color ──

export const TokenColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Avatar name="P" color="primary" size="lg" />
      <Avatar name="S" color="success" size="lg" />
      <Avatar name="W" color="warning" size="lg" />
      <Avatar name="E" color="error" size="lg" />
      <Avatar name="I" color="info" size="lg" />
    </div>
  ),
};

// ── Compound API ──

export const CompoundAPI: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Avatar name="Ali Veli" size="lg">
        <Avatar.Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
        <Avatar.Fallback />
      </Avatar>
      <Avatar name="Zeynep Kara" size="lg">
        <Avatar.Fallback>ZK</Avatar.Fallback>
      </Avatar>
    </div>
  ),
};

// ── MultipleUsers ──

export const MultipleUsers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Avatar name="Ali Veli" />
      <Avatar name="Zeynep Kara" />
      <Avatar name="Mehmet Oz" />
      <Avatar name="Ayse Yilmaz" />
      <Avatar name="Can Demir" />
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    name: 'Relteco',
    size: 'xl',
    styles: {
      root: { boxShadow: 'var(--rel-shadow-md, 0 4px 12px rgba(0,0,0,0.15))' },
      fallback: { letterSpacing: '0.1em' },
    },
  },
};
