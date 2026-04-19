/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FlowChart } from './FlowChart';
import type { FlowNode, FlowEdge } from '@relteco/relui-core';

const meta: Meta<typeof FlowChart> = { title: 'Visual/FlowChart', component: FlowChart, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof FlowChart>;

const NODES: FlowNode[] = [
  { id: 's', type: 'start', label: 'Start', x: 50, y: 20, width: 100, height: 50 },
  { id: 'p1', type: 'process', label: 'Process A', x: 200, y: 10, width: 140, height: 60 },
  { id: 'd1', type: 'decision', label: '?', x: 400, y: 15, width: 60, height: 60 },
  { id: 'p2', type: 'process', label: 'Process B', x: 530, y: 10, width: 140, height: 60 },
  { id: 'e', type: 'end', label: 'End', x: 730, y: 20, width: 100, height: 50 },
];
const EDGES: FlowEdge[] = [
  { id: 'e1', sourceId: 's', targetId: 'p1' },
  { id: 'e2', sourceId: 'p1', targetId: 'd1' },
  { id: 'e3', sourceId: 'd1', targetId: 'p2', label: 'Yes' },
  { id: 'e4', sourceId: 'p2', targetId: 'e' },
];

export const Default: Story = { args: { nodes: NODES, edges: EDGES }, decorators: [(S) => <div style={{ width: 900, height: 300 }}><S /></div>] };
export const SimpleProcess: Story = { args: { nodes: NODES.slice(0, 3), edges: EDGES.slice(0, 2) }, decorators: [(S) => <div style={{ width: 600, height: 300 }}><S /></div>] };
export const Empty: Story = { args: {}, decorators: [(S) => <div style={{ width: 600, height: 300 }}><S /></div>] };
export const SnapToGrid: Story = { args: { nodes: NODES, edges: EDGES, snapToGrid: true }, decorators: [(S) => <div style={{ width: 900, height: 300 }}><S /></div>] };
export const Compound: Story = { render: () => <div style={{ width: 900, height: 300 }}><FlowChart nodes={NODES} edges={EDGES}><FlowChart.Toolbar /><FlowChart.Canvas /><FlowChart.Minimap /></FlowChart></div> };
export const CompoundNoMinimap: Story = { render: () => <div style={{ width: 900, height: 300 }}><FlowChart nodes={NODES} edges={EDGES}><FlowChart.Toolbar /><FlowChart.Canvas /></FlowChart></div> };
export const CustomSlotStyles: Story = { args: { nodes: NODES, edges: EDGES, styles: { root: { padding: 4 }, toolbar: { padding: '8px 12px' } } }, decorators: [(S) => <div style={{ width: 900, height: 300 }}><S /></div>] };
