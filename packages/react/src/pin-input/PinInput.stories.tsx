/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PinInput } from './PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Form/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    length: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['number', 'alphanumeric'] },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof PinInput>;

// 1. Default — 4 haneli numerik
export const Default: Story = {
  args: {
    length: 4,
    type: 'number',
  },
};

// 2. SixDigit — 6 haneli
export const SixDigit: Story = {
  args: {
    length: 6,
    type: 'number',
  },
};

// 3. Alphanumeric — harf + rakam
export const Alphanumeric: Story = {
  args: {
    length: 4,
    type: 'alphanumeric',
  },
};

// 4. Masked — gizli karakterler
export const Masked: Story = {
  args: {
    length: 4,
    mask: true,
    defaultValue: '1234',
  },
};

// 5. AllSizes — tum boyutlar
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ margin: '0 0 8px', color: 'var(--rel-color-text-muted, #6b7280)', fontSize: 'var(--rel-text-sm, 14px)' }}>Small</p>
        <PinInput size="sm" />
      </div>
      <div>
        <p style={{ margin: '0 0 8px', color: 'var(--rel-color-text-muted, #6b7280)', fontSize: 'var(--rel-text-sm, 14px)' }}>Medium</p>
        <PinInput size="md" />
      </div>
      <div>
        <p style={{ margin: '0 0 8px', color: 'var(--rel-color-text-muted, #6b7280)', fontSize: 'var(--rel-text-sm, 14px)' }}>Large</p>
        <PinInput size="lg" />
      </div>
    </div>
  ),
};

// 6. Compound — sub-component kullanimi
export const Compound: Story = {
  render: () => (
    <PinInput length={4}>
      <PinInput.Field index={0} />
      <PinInput.Field index={1} />
      <PinInput.Field index={2} />
      <PinInput.Field index={3} />
    </PinInput>
  ),
};

// 7. CustomSlotStyles — styles prop ile ozellestirme
export const CustomSlotStyles: Story = {
  args: {
    length: 4,
    styles: {
      root: { padding: 16 },
      field: { fontSize: 'var(--rel-text-xl, 20px)', fontWeight: 700 },
    },
  },
};
