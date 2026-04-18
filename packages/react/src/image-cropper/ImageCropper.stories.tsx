/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ImageCropper } from './ImageCropper';

const placeholder = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop';

const meta: Meta<typeof ImageCropper> = {
  title: 'Data Entry/ImageCropper',
  component: ImageCropper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { aspectRatio: { control: 'select', options: ['free', '1:1', '4:3', '16:9'] } },
};
export default meta;
type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = { args: { src: placeholder } };
export const Square: Story = { name: 'Kare / Square', args: { src: placeholder, aspectRatio: '1:1' } };
export const Wide: Story = { name: 'Genis / Wide', args: { src: placeholder, aspectRatio: '16:9' } };
export const Compound: Story = { name: 'Compound API', render: () => (<ImageCropper src={placeholder}><ImageCropper.Preview /><ImageCropper.Controls /></ImageCropper>) };
export const CustomSlotStyles: Story = { name: 'Slot Customization', args: { src: placeholder, styles: { root: { padding: 8 } }, classNames: { root: 'custom-ic' } } };
export const PreviewOnly: Story = { name: 'Sadece Preview', render: () => (<ImageCropper src={placeholder}><ImageCropper.Preview /></ImageCropper>) };
export const Zoomed: Story = { name: 'Yakinlastirilmis / Zoomed', args: { src: placeholder, defaultZoom: 2 } };
export const Playground: Story = { args: { src: placeholder, aspectRatio: 'free' } };
