/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Form/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    count: {
      control: { type: 'number', min: 1, max: 20 },
    },
    allowHalf: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

// ── Default ──

export const Default: Story = {
  args: {
    defaultValue: 3,
    count: 5,
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
      <Rating defaultValue={3} size="sm" />
      <Rating defaultValue={3} size="md" />
      <Rating defaultValue={3} size="lg" />
    </div>
  ),
};

// ── HalfStars ──

export const HalfStars: Story = {
  args: {
    allowHalf: true,
    defaultValue: 2.5,
    count: 5,
  },
};

// ── ReadOnly ──

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 4,
    count: 5,
  },
};

// ── CustomCount ──

export const CustomCount: Story = {
  args: {
    count: 10,
    defaultValue: 7,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <Rating defaultValue={2} count={5}>
      <Rating.Star index={0} />
      <Rating.Star index={1} />
      <Rating.Star index={2} />
      <Rating.Star index={3} />
      <Rating.Star index={4} />
      <Rating.Label>2 of 5</Rating.Label>
    </Rating>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    defaultValue: 4,
    count: 5,
    styles: {
      root: { padding: 16 },
      star: { padding: 4 },
    },
  },
};
