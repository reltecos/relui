/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { PivotField, PivotPlacement } from '@relteco/relui-core';
import { PivotTable } from './PivotTable';

const fields: PivotField[] = [
  { key: 'category', label: 'Kategori' },
  { key: 'year', label: 'Yil' },
  { key: 'region', label: 'Bolge' },
  { key: 'amount', label: 'Tutar' },
  { key: 'quantity', label: 'Adet' },
];

const salesData = [
  { category: 'Elektronik', year: '2023', region: 'Istanbul', amount: 15000, quantity: 100 },
  { category: 'Elektronik', year: '2024', region: 'Istanbul', amount: 18000, quantity: 120 },
  { category: 'Elektronik', year: '2023', region: 'Ankara', amount: 8000, quantity: 60 },
  { category: 'Elektronik', year: '2024', region: 'Ankara', amount: 9500, quantity: 70 },
  { category: 'Gida', year: '2023', region: 'Istanbul', amount: 12000, quantity: 500 },
  { category: 'Gida', year: '2024', region: 'Istanbul', amount: 14000, quantity: 600 },
  { category: 'Gida', year: '2023', region: 'Ankara', amount: 6000, quantity: 300 },
  { category: 'Gida', year: '2024', region: 'Ankara', amount: 7500, quantity: 350 },
  { category: 'Giyim', year: '2023', region: 'Istanbul', amount: 9000, quantity: 200 },
  { category: 'Giyim', year: '2024', region: 'Istanbul', amount: 11000, quantity: 250 },
  { category: 'Giyim', year: '2023', region: 'Ankara', amount: 5000, quantity: 150 },
  { category: 'Giyim', year: '2024', region: 'Ankara', amount: 6500, quantity: 180 },
];

const defaultPlacement: PivotPlacement = {
  rowFields: ['category'],
  columnFields: ['year'],
  valueFields: [{ key: 'amount', aggregate: 'sum' }],
};

const meta: Meta<typeof PivotTable> = {
  title: 'Data Display/PivotTable',
  component: PivotTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof PivotTable>;

export const Default: Story = {
  args: { data: salesData, fields, defaultPlacement },
};

export const ByRegion: Story = {
  name: 'Bolge Bazinda / By Region',
  args: {
    data: salesData, fields,
    defaultPlacement: {
      rowFields: ['region'],
      columnFields: ['category'],
      valueFields: [{ key: 'amount', aggregate: 'sum' }],
    },
  },
};

export const CountAggregate: Story = {
  name: 'Sayi Agregasyonu / Count',
  args: {
    data: salesData, fields,
    defaultPlacement: {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'count' }],
    },
  },
};

export const AverageAggregate: Story = {
  name: 'Ortalama / Average',
  args: {
    data: salesData, fields,
    defaultPlacement: {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'average' }],
    },
  },
};

export const EmptyPlacement: Story = {
  name: 'Bos Yerlestirme / Empty',
  args: { data: salesData, fields },
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <PivotTable data={salesData} fields={fields} defaultPlacement={defaultPlacement}>
      <PivotTable.FieldChooser />
      <PivotTable.Grid />
    </PivotTable>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    data: salesData, fields, defaultPlacement,
    styles: { root: { padding: 8 }, fieldChooser: { padding: '8px' } },
    classNames: { root: 'custom-pt' },
  },
};

export const Playground: Story = {
  args: { data: salesData, fields, defaultPlacement },
};
