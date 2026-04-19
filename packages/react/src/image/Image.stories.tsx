/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop';

const meta: Meta<typeof Image> = { title: 'Media/Image', component: Image, tags: ['autodocs'], parameters: { layout: 'centered' }, argTypes: { lightbox: { control: 'boolean' }, lazy: { control: 'boolean' } } };
export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = { args: { src, alt: 'Nature', width: 400, height: 300 } };
export const WithLightbox: Story = { name: 'Lightbox', args: { src, alt: 'Nature', width: 400, height: 300, lightbox: true } };
export const ErrorState: Story = { name: 'Hata Durumu', args: { src: 'invalid.jpg', alt: 'Error', width: 400, height: 300 } };
export const LazyLoad: Story = { name: 'Lazy Loading', args: { src, alt: 'Lazy', width: 400, height: 300, lazy: true } };
export const CustomSize: Story = { name: 'Ozel Boyut', args: { src, alt: 'Custom', width: 200, height: 200 } };
export const Compound: Story = { render: () => (<Image src={src} alt="Compound" width={400} height={300}><Image.Placeholder>Yukleniyor...</Image.Placeholder><Image.Img /><Image.Fallback>Hata</Image.Fallback></Image>) };
export const CustomSlotStyles: Story = { args: { src, alt: 'Styled', width: 400, height: 300, styles: { root: { padding: 4 } }, classNames: { root: 'custom-img' } } };
export const Playground: Story = { args: { src, alt: 'Playground', width: 400, height: 300, lightbox: false, lazy: false } };
