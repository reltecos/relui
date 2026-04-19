/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Canvas2D } from './Canvas2D';
import type { CanvasShape } from '@relteco/relui-core';

const meta: Meta<typeof Canvas2D> = { title: 'Visual/Canvas2D', component: Canvas2D, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof Canvas2D>;

const SHAPES: CanvasShape[] = [
  { id: 'r1', type: 'rect', x: 50, y: 50, width: 120, height: 80, rotation: 0, fill: 'var(--rel-color-primary, #3b82f6)', stroke: 'var(--rel-color-border, #000)', strokeWidth: 2, zIndex: 0, visible: true, locked: false },
  { id: 'e1', type: 'ellipse', x: 250, y: 80, width: 100, height: 60, rotation: 0, fill: 'var(--rel-color-success, #10b981)', stroke: 'var(--rel-color-border, #000)', strokeWidth: 1, zIndex: 1, visible: true, locked: false },
  { id: 't1', type: 'text', x: 100, y: 200, width: 200, height: 30, rotation: 0, fill: 'var(--rel-color-text, #374151)', stroke: 'transparent', strokeWidth: 0, text: 'Hello Canvas', fontSize: 18, zIndex: 2, visible: true, locked: false },
];

export const Default: Story = { args: { shapes: SHAPES }, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
export const Empty: Story = { args: {}, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
export const SingleShape: Story = { args: { shapes: [SHAPES[0] as CanvasShape] }, decorators: [(S) => <div style={{ width: 600, height: 400 }}><S /></div>] };
export const SnapToGrid: Story = { args: { shapes: SHAPES, snapToGrid: true, gridSize: 20 }, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
export const Compound: Story = { render: () => <div style={{ width: 800, height: 500 }}><Canvas2D shapes={SHAPES}><Canvas2D.Toolbar /><Canvas2D.Surface /><Canvas2D.LayerPanel /></Canvas2D></div> };
export const CompoundNoLayers: Story = { render: () => <div style={{ width: 800, height: 500 }}><Canvas2D shapes={SHAPES}><Canvas2D.Toolbar /><Canvas2D.Surface /></Canvas2D></div> };
export const CustomSlotStyles: Story = { args: { shapes: SHAPES, styles: { root: { padding: 4 }, toolbar: { padding: '8px 12px' } } }, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
