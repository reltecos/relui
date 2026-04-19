/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ImageEditor } from './ImageEditor';

const meta: Meta<typeof ImageEditor> = { title: 'Media/ImageEditor', component: ImageEditor, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof ImageEditor>;

const SRC = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop';

export const Default: Story = { args: { src: SRC }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const WithFilters: Story = { args: { src: SRC, showFilters: true }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const NoImage: Story = { args: {}, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 600 }}><ImageEditor><ImageEditor.Toolbar /><ImageEditor.Canvas src={SRC} /><ImageEditor.FilterPanel /></ImageEditor></div>) };
export const CustomSlotStyles: Story = { args: { src: SRC, styles: { root: { borderRadius: 16 }, toolbar: { padding: '12px 16px' }, canvas: { padding: 24 } } }, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const SmallSize: Story = { args: { src: SRC }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const LargeSize: Story = { args: { src: SRC, showFilters: true }, decorators: [(S) => <div style={{ width: 800 }}><S /></div>] };
