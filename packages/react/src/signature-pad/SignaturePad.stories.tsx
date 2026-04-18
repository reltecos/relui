/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SignaturePad } from './SignaturePad';

const meta: Meta<typeof SignaturePad> = {
  title: 'Data Entry/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    width: { control: { type: 'range', min: 200, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 100, max: 400, step: 25 } },
  },
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = { args: { width: 400, height: 200 } };
export const Small: Story = { name: 'Kucuk / Small', args: { width: 250, height: 120 } };
export const Large: Story = { name: 'Buyuk / Large', args: { width: 600, height: 300 } };
export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <SignaturePad width={400} height={200}>
      <SignaturePad.Canvas />
      <SignaturePad.Controls />
    </SignaturePad>
  ),
};
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: { width: 400, height: 200, styles: { root: { padding: 8 }, controls: { padding: '4px' } }, classNames: { root: 'custom-sp' } },
};
export const CanvasOnly: Story = {
  name: 'Sadece Canvas',
  render: () => (
    <SignaturePad width={400} height={200}>
      <SignaturePad.Canvas />
    </SignaturePad>
  ),
};
export const Playground: Story = { args: { width: 400, height: 200 } };
