/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ImageGallery } from './ImageGallery';

const images = Array.from({ length: 8 }, (_, i) => ({
  id: String(i),
  src: `https://picsum.photos/seed/${i}/600/400`,
  alt: `Photo ${i + 1}`,
  thumbnail: `https://picsum.photos/seed/${i}/150/100`,
}));

const meta: Meta<typeof ImageGallery> = { title: 'Media/ImageGallery', component: ImageGallery, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof ImageGallery>;

export const Default: Story = { args: { images }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const FewImages: Story = { name: 'Az Resim', args: { images: images.slice(0, 3) }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 600 }}><ImageGallery images={images}><ImageGallery.Grid /><ImageGallery.Thumbnails /><ImageGallery.Lightbox /></ImageGallery></div>) };
export const GridOnly: Story = { name: 'Sadece Grid', render: () => (<div style={{ width: 600 }}><ImageGallery images={images}><ImageGallery.Grid /></ImageGallery></div>) };
export const CustomSlotStyles: Story = { args: { images, styles: { root: { padding: 8 }, grid: { gap: 16 } }, classNames: { root: 'custom-ig' } }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const ManyImages: Story = { name: 'Cok Resim', args: { images: Array.from({ length: 20 }, (_, i) => ({ id: String(i), src: `https://picsum.photos/seed/${i + 100}/600/400`, alt: `P${i}` })) }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const Playground: Story = { args: { images }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
