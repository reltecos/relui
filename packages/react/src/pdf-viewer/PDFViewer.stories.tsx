/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PDFViewer } from './PDFViewer';

const meta: Meta<typeof PDFViewer> = { title: 'Media/PDFViewer', component: PDFViewer, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof PDFViewer>;

export const Default: Story = { args: { totalPages: 10 }, decorators: [(S) => <div style={{ width: 600, height: 500 }}><S /></div>] };
export const WithSrc: Story = { args: { totalPages: 5, src: '/sample.pdf' }, decorators: [(S) => <div style={{ width: 600, height: 500 }}><S /></div>] };
export const StartPage3: Story = { args: { totalPages: 10, defaultPage: 3 }, decorators: [(S) => <div style={{ width: 600, height: 500 }}><S /></div>] };
export const ZoomWidth: Story = { args: { totalPages: 10, defaultZoom: 'width' }, decorators: [(S) => <div style={{ width: 600, height: 500 }}><S /></div>] };
export const ZoomPercent: Story = { args: { totalPages: 10, defaultZoom: 'percent', defaultZoomPercent: 150 }, decorators: [(S) => <div style={{ width: 600, height: 500 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 600, height: 500 }}><PDFViewer totalPages={10}><PDFViewer.Toolbar /><PDFViewer.PageDisplay>Custom content</PDFViewer.PageDisplay></PDFViewer></div>) };
export const CustomSlotStyles: Story = { args: { totalPages: 10, styles: { root: { borderRadius: 16 }, toolbar: { padding: '12px 16px' } } }, decorators: [(S) => <div style={{ width: 600, height: 500 }}><S /></div>] };
