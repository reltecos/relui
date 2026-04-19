/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { WebcamCapture } from './WebcamCapture';

const meta: Meta<typeof WebcamCapture> = { title: 'Media/WebcamCapture', component: WebcamCapture, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof WebcamCapture>;

export const Default: Story = { args: {}, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const MirrorOff: Story = { args: { defaultMirror: false }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const BackCamera: Story = { args: { defaultFacingMode: 'environment' }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => <div style={{ width: 400 }}><WebcamCapture><WebcamCapture.Video /><WebcamCapture.Controls /></WebcamCapture></div> };
export const CompoundWithPreview: Story = { render: () => <div style={{ width: 400 }}><WebcamCapture><WebcamCapture.Video /><WebcamCapture.Controls /><WebcamCapture.Preview /></WebcamCapture></div> };
export const CustomSlotStyles: Story = { args: { styles: { root: { padding: 8 }, controls: { padding: '12px 16px' } } }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Empty: Story = { args: {}, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
