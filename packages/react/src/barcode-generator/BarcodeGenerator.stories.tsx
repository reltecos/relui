/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BarcodeGenerator } from './BarcodeGenerator';

const meta: Meta<typeof BarcodeGenerator> = {
  title: 'Data Display/BarcodeGenerator',
  component: BarcodeGenerator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    format: { control: 'select', options: ['code128', 'code39', 'ean13'] },
    showValue: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof BarcodeGenerator>;

export const Default: Story = {
  args: { value: 'RELUI-2025', format: 'code128', label: 'Product ID' },
};

export const Code39: Story = {
  args: { value: 'HELLO WORLD', format: 'code39', label: 'Code39' },
};

export const EAN13: Story = {
  args: { value: '590123412345', format: 'ean13', label: 'EAN-13' },
};

export const NoValue: Story = {
  args: { value: 'SECRET', format: 'code128', showValue: false },
};

export const CustomSize: Story = {
  args: { value: 'CUSTOM', format: 'code128', width: 300, height: 100, label: 'Large' },
};

export const AllFormats: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      <BarcodeGenerator value="RELUI" format="code128" label="Code128" />
      <BarcodeGenerator value="RELUI" format="code39" label="Code39" />
      <BarcodeGenerator value="590123412345" format="ean13" label="EAN-13" />
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <BarcodeGenerator value="12345" format="code128">
      <BarcodeGenerator.Label>Product ID</BarcodeGenerator.Label>
      <BarcodeGenerator.Svg />
      <BarcodeGenerator.Value />
    </BarcodeGenerator>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    value: 'STYLED',
    format: 'code128',
    label: 'Styled Barcode',
    styles: {
      root: { padding: 16 },
      label: { fontSize: 14, letterSpacing: '0.1em' },
      value: { fontSize: 18, fontWeight: 700 },
    },
  },
};
