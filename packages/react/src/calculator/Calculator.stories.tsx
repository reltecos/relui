/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Calculator } from './Calculator';

const meta: Meta<typeof Calculator> = {
  title: 'Input/Calculator',
  component: Calculator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    showHistory: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Calculator>;

export const Default: Story = { args: {} };
export const WithHistory: Story = { args: { showHistory: true } };
export const HighPrecision: Story = { args: { precision: 4 } };

export const Compact: Story = {
  args: { style: { width: 240 } },
};

export const WithCallback: Story = {
  args: {
    onResult: (_result: number) => {
      /* storybook action log */
    },
  },
};

export const Compound: Story = {
  render: () => (
    <Calculator>
      <Calculator.Display />
      <Calculator.Keypad />
      <Calculator.History />
    </Calculator>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    styles: {
      root: { borderRadius: 16, width: 300 },
      display: { padding: '24px 20px' },
      keypad: { padding: 8 },
    },
  },
};
