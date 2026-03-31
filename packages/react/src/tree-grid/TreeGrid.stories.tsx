/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { TreeGridColumnDef, TreeGridRowDef } from '@relteco/relui-core';
import { TreeGrid } from './TreeGrid';

const cols: TreeGridColumnDef[] = [
  { key: 'name', title: 'Dosya Adi', sortable: true, width: 250 },
  { key: 'size', title: 'Boyut', sortable: true, align: 'right', width: 100 },
  { key: 'type', title: 'Tur', width: 120 },
];

const rows: TreeGridRowDef[] = [
  {
    id: 'src', cells: { name: 'src', size: '-', type: 'Klasor' },
    children: [
      {
        id: 'components', cells: { name: 'components', size: '-', type: 'Klasor' },
        children: [
          { id: 'btn', cells: { name: 'Button.tsx', size: '2.1KB', type: 'TSX' } },
          { id: 'inp', cells: { name: 'Input.tsx', size: '1.8KB', type: 'TSX' } },
        ],
      },
      { id: 'idx', cells: { name: 'index.ts', size: '0.4KB', type: 'TS' } },
    ],
  },
  {
    id: 'pub', cells: { name: 'public', size: '-', type: 'Klasor' },
    children: [
      { id: 'fav', cells: { name: 'favicon.ico', size: '1.1KB', type: 'ICO' } },
    ],
  },
  { id: 'pkg', cells: { name: 'package.json', size: '0.9KB', type: 'JSON' } },
  { id: 'rm', cells: { name: 'README.md', size: '2.3KB', type: 'MD' } },
];

const meta: Meta<typeof TreeGrid> = {
  title: 'Data Display/TreeGrid',
  component: TreeGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    selectionMode: { control: 'select', options: ['none', 'single', 'multiple'] },
  },
};

export default meta;
type Story = StoryObj<typeof TreeGrid>;

export const Default: Story = {
  args: { columns: cols, rows, defaultExpanded: ['src'] },
};

export const FullyExpanded: Story = {
  name: 'Tam Acik / Fully Expanded',
  args: { columns: cols, rows, defaultExpanded: ['src', 'components', 'pub'] },
};

export const SingleSelection: Story = {
  name: 'Tekli Secim / Single Selection',
  args: { columns: cols, rows, defaultExpanded: ['src'], selectionMode: 'single' },
};

export const MultipleSelection: Story = {
  name: 'Coklu Secim / Multiple Selection',
  args: { columns: cols, rows, defaultExpanded: ['src'], selectionMode: 'multiple' },
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <TreeGrid columns={cols} defaultExpanded={['src']}>
      <TreeGrid.Header />
      <TreeGrid.Body rows={rows} />
    </TreeGrid>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    columns: cols, rows, defaultExpanded: ['src'],
    styles: { root: { padding: 4 }, header: { padding: '4px' } },
    classNames: { root: 'custom-tg' },
  },
};

export const Playground: Story = {
  args: { columns: cols, rows, selectionMode: 'none', defaultExpanded: ['src'] },
};
