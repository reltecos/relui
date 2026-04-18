/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NodeEditor } from './NodeEditor';
import type { GraphNode, GraphEdge } from '@relteco/relui-core';

const meta: Meta<typeof NodeEditor> = {
  title: 'Editors/NodeEditor',
  component: NodeEditor,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    snapToGrid: { control: 'boolean' },
    gridSize: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof NodeEditor>;

const NODES: GraphNode[] = [
  {
    id: 'input', type: 'source', label: 'Data Input', x: 50, y: 50, width: 180, height: 80,
    ports: [{ id: 'input-out', name: 'output', direction: 'output', dataType: 'number' }],
    collapsed: false,
  },
  {
    id: 'process', type: 'transform', label: 'Transform', x: 320, y: 30, width: 180, height: 120,
    ports: [
      { id: 'proc-in', name: 'input', direction: 'input', dataType: 'number' },
      { id: 'proc-out', name: 'result', direction: 'output', dataType: 'string' },
    ],
    collapsed: false,
  },
  {
    id: 'output', type: 'sink', label: 'Output', x: 600, y: 60, width: 180, height: 80,
    ports: [{ id: 'out-in', name: 'input', direction: 'input', dataType: 'string' }],
    collapsed: false,
  },
];

const EDGES: GraphEdge[] = [
  { id: 'e1', sourceNodeId: 'input', sourcePortId: 'input-out', targetNodeId: 'process', targetPortId: 'proc-in' },
  { id: 'e2', sourceNodeId: 'process', sourcePortId: 'proc-out', targetNodeId: 'output', targetPortId: 'out-in' },
];

export const Default: Story = {
  args: { nodes: NODES, edges: EDGES },
  decorators: [(Story) => <div style={{ width: 900, height: 500 }}><Story /></div>],
};

export const SingleNode: Story = {
  args: { nodes: [NODES[0] as GraphNode] },
  decorators: [(Story) => <div style={{ width: 600, height: 400 }}><Story /></div>],
};

export const WithoutEdges: Story = {
  args: { nodes: NODES },
  decorators: [(Story) => <div style={{ width: 900, height: 500 }}><Story /></div>],
};

export const SnapToGrid: Story = {
  args: { nodes: NODES, edges: EDGES, snapToGrid: true, gridSize: 20 },
  decorators: [(Story) => <div style={{ width: 900, height: 500 }}><Story /></div>],
};

export const Empty: Story = {
  args: {},
  decorators: [(Story) => <div style={{ width: 900, height: 500 }}><Story /></div>],
};

export const ManyNodes: Story = {
  args: {
    nodes: Array.from({ length: 8 }, (_, i) => ({
      id: `n${i}`,
      type: 'default',
      label: `Node ${i + 1}`,
      x: (i % 4) * 220 + 20,
      y: Math.floor(i / 4) * 150 + 20,
      width: 180,
      height: 80,
      ports: [
        { id: `n${i}-in`, name: 'in', direction: 'input' as const, dataType: 'number' },
        { id: `n${i}-out`, name: 'out', direction: 'output' as const, dataType: 'number' },
      ],
      collapsed: false,
    })),
  },
  decorators: [(Story) => <div style={{ width: 1000, height: 500 }}><Story /></div>],
};

export const Compound: Story = {
  render: () => (
    <div style={{ width: 900, height: 500 }}>
      <NodeEditor nodes={NODES} edges={EDGES}>
        <NodeEditor.Toolbar />
        <NodeEditor.Canvas />
        <NodeEditor.Minimap />
      </NodeEditor>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    nodes: NODES,
    edges: EDGES,
    styles: {
      root: { padding: 4 },
      toolbar: { padding: '8px 12px' },
    },
  },
  decorators: [(Story) => <div style={{ width: 900, height: 500 }}><Story /></div>],
};
