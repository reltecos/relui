/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SankeyDiagram } from './SankeyDiagram';
import type { SankeyNodeDef, SankeyLinkDef } from '@relteco/relui-core';

const nodes: SankeyNodeDef[] = [
  { id: 'coal', name: 'Coal' },
  { id: 'gas', name: 'Natural Gas' },
  { id: 'solar', name: 'Solar' },
  { id: 'electricity', name: 'Electricity' },
  { id: 'heat', name: 'Heat' },
  { id: 'residential', name: 'Residential' },
  { id: 'industry', name: 'Industry' },
];

const links: SankeyLinkDef[] = [
  { source: 'coal', target: 'electricity', value: 80 },
  { source: 'coal', target: 'heat', value: 30 },
  { source: 'gas', target: 'electricity', value: 60 },
  { source: 'gas', target: 'heat', value: 40 },
  { source: 'solar', target: 'electricity', value: 50 },
  { source: 'electricity', target: 'residential', value: 120 },
  { source: 'electricity', target: 'industry', value: 70 },
  { source: 'heat', target: 'residential', value: 50 },
  { source: 'heat', target: 'industry', value: 20 },
];

const meta: Meta<typeof SankeyDiagram> = {
  title: 'Charts/SankeyDiagram',
  component: SankeyDiagram,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof SankeyDiagram>;

export const Default: Story = { args: { nodes, links } };

export const SimpleFlow: Story = {
  args: {
    nodes: [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ],
    links: [
      { source: 'a', target: 'c', value: 50 },
      { source: 'b', target: 'c', value: 30 },
    ],
  },
};

export const NoLabels: Story = { args: { nodes, links, showLabels: false } };
export const NoLegend: Story = { args: { nodes, links, showLegend: false } };
export const CustomSize: Story = { args: { nodes, links, width: 700, height: 400 } };

export const Compound: Story = {
  render: () => (
    <SankeyDiagram nodes={nodes} links={links}>
      <SankeyDiagram.Link />
      <SankeyDiagram.Node />
      <SankeyDiagram.Label />
    </SankeyDiagram>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    nodes, links,
    styles: { root: { padding: 16 }, legend: { padding: 8 } },
  },
};
