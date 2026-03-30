/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from './DataGrid';
import type { ColumnDef } from '@relteco/relui-core';

const columns: ColumnDef[] = [
  { key: 'id', title: 'ID', sortable: true, width: 60, align: 'center' },
  { key: 'name', title: 'Ad', sortable: true, filterable: true, editable: true },
  { key: 'email', title: 'E-posta', sortable: true, filterable: true },
  { key: 'department', title: 'Departman', sortable: true, filterable: true },
  { key: 'salary', title: 'Maas', sortable: true, align: 'right' },
];

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: ['Ali', 'Veli', 'Ayse', 'Fatma', 'Mehmet', 'Zeynep', 'Hasan', 'Elif'][i % 8],
  email: `user${i + 1}@example.com`,
  department: ['Muhendislik', 'Pazarlama', 'Finans', 'IK'][i % 4],
  salary: 5000 + Math.floor(i * 500),
}));

const meta: Meta<typeof DataGrid> = {
  title: 'Data Display/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    sortable: { control: 'boolean' },
    filterable: { control: 'boolean' },
    paginated: { control: 'boolean' },
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

// ── Default ──

export const Default: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 10),
  },
};

// ── Sortable ──

export const Sortable: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 10),
    sortable: true,
  },
};

// ── Filterable ──

export const Filterable: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 15),
    sortable: true,
    filterable: true,
  },
};

// ── WithSelection ──

export const WithSelection: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 10),
    selectionMode: 'multiple',
    sortable: true,
  },
};

// ── WithPagination ──

export const WithPagination: Story = {
  args: {
    columns,
    data: sampleData,
    sortable: true,
    filterable: true,
    paginated: true,
    pageSize: 10,
  },
};

// ── MasterDetail ──

export const MasterDetail: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 10),
    renderDetail: (row) => (
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <strong>Ad:</strong> {String(row['name'])}
        </div>
        <div>
          <strong>E-posta:</strong> {String(row['email'])}
        </div>
        <div>
          <strong>Departman:</strong> {String(row['department'])}
        </div>
      </div>
    ),
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <DataGrid
      columns={columns}
      data={sampleData.slice(0, 10)}
      sortable
      filterable
      selectionMode="multiple"
      paginated
      pageSize={5}
    >
      <DataGrid.Toolbar>
        <DataGrid.ColumnChooser />
        <DataGrid.ExportButton format="csv" />
        <DataGrid.ExportButton format="json" />
      </DataGrid.Toolbar>
      <DataGrid.Header />
      <DataGrid.Body />
      <DataGrid.Footer>
        <DataGrid.Pagination />
      </DataGrid.Footer>
    </DataGrid>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 8),
    sortable: true,
    styles: {
      root: { borderRadius: 12 },
      header: { padding: '4px 0' },
      body: { fontSize: '13px' },
      footer: { padding: '12px 16px' },
    },
  },
};

// ── LargeDataset ──

export const LargeDataset: Story = {
  args: {
    columns,
    data: Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      department: ['Eng', 'Mkt', 'Fin', 'HR'][i % 4],
      salary: 3000 + i * 10,
    })),
    sortable: true,
    filterable: true,
    paginated: true,
    pageSize: 25,
    selectionMode: 'multiple',
  },
};
