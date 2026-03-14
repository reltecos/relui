/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Loading...',
    size: 'md',
  },
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner color="#3b82f6" />
      <Spinner color="#22c55e" />
      <Spinner color="#f59e0b" />
      <Spinner color="#ef4444" />
      <Spinner color="#8b5cf6" />
    </div>
  ),
};

export const CustomThickness: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner thickness={2} size="lg" />
      <Spinner thickness={3} size="lg" />
      <Spinner thickness={4} size="lg" />
      <Spinner thickness={6} size="lg" />
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    size: 'lg',
    label: 'Please wait...',
    styles: {
      label: { letterSpacing: '0.5px', fontWeight: 500 },
    },
  },
};

export const Playground: Story = {
  args: {
    size: 'md',
    color: 'var(--rel-color-primary, #3b82f6)',
    thickness: 3,
  },
};
