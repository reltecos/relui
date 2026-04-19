/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { OrgChart } from './OrgChart';
import type { OrgNode } from '@relteco/relui-core';

const meta: Meta<typeof OrgChart> = { title: 'Visual/OrgChart', component: OrgChart, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof OrgChart>;

const NODES: OrgNode[] = [
  { id: 'ceo', name: 'Ali Veli', title: 'CEO', parentId: null, collapsed: false },
  { id: 'cto', name: 'Can Demir', title: 'CTO', parentId: 'ceo', collapsed: false },
  { id: 'cfo', name: 'Ayse Kara', title: 'CFO', parentId: 'ceo', collapsed: false },
  { id: 'dev1', name: 'Mehmet', title: 'Sr Developer', parentId: 'cto', collapsed: false },
  { id: 'dev2', name: 'Zeynep', title: 'Developer', parentId: 'cto', collapsed: false },
  { id: 'fin1', name: 'Omer', title: 'Accountant', parentId: 'cfo', collapsed: false },
];

export const Default: Story = { args: { nodes: NODES }, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
export const SingleNode: Story = { args: { nodes: [NODES[0] as OrgNode] }, decorators: [(S) => <div style={{ width: 400, height: 300 }}><S /></div>] };
export const Horizontal: Story = { args: { nodes: NODES, defaultOrientation: 'horizontal' }, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
export const Empty: Story = { args: {}, decorators: [(S) => <div style={{ width: 400, height: 300 }}><S /></div>] };
export const Compound: Story = { render: () => <div style={{ width: 800, height: 500 }}><OrgChart nodes={NODES}><OrgChart.Toolbar /><OrgChart.Canvas /></OrgChart></div> };
export const CompoundCanvasOnly: Story = { render: () => <div style={{ width: 800, height: 500 }}><OrgChart nodes={NODES}><OrgChart.Canvas /></OrgChart></div> };
export const CustomSlotStyles: Story = { args: { nodes: NODES, styles: { root: { padding: 4 }, toolbar: { padding: '8px 12px' } } }, decorators: [(S) => <div style={{ width: 800, height: 500 }}><S /></div>] };
