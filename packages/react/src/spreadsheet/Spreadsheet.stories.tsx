/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Spreadsheet } from './Spreadsheet';

const meta: Meta<typeof Spreadsheet> = {
  title: 'Data Entry/Spreadsheet',
  component: Spreadsheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    columns: { control: { type: 'range', min: 5, max: 52, step: 1 } },
    rows: { control: { type: 'range', min: 10, max: 500, step: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof Spreadsheet>;

export const Default: Story = {
  args: { columns: 10, rows: 20 },
};

export const Small: Story = {
  name: 'Kucuk / Small',
  args: { columns: 5, rows: 10 },
};

export const Large: Story = {
  name: 'Buyuk / Large',
  args: { columns: 26, rows: 100 },
};

export const MultiSheet: Story = {
  name: 'Coklu Sheet / Multi Sheet',
  args: { columns: 10, rows: 20, initialSheets: 3 },
};

export const Compact: Story = {
  name: 'Kompakt / Compact',
  args: { columns: 8, rows: 15 },
  decorators: [(Story) => <div style={{ width: 600 }}><Story /></div>],
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <Spreadsheet columns={8} rows={15}>
      <Spreadsheet.Toolbar />
      <Spreadsheet.FormulaBar />
      <Spreadsheet.Grid />
      <Spreadsheet.SheetTabs />
    </Spreadsheet>
  ),
};

export const WithoutToolbar: Story = {
  name: 'Aracsiz / Without Toolbar',
  render: () => (
    <Spreadsheet columns={8} rows={15}>
      <Spreadsheet.FormulaBar />
      <Spreadsheet.Grid />
      <Spreadsheet.SheetTabs />
    </Spreadsheet>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    columns: 8, rows: 10,
    styles: { root: { padding: 4 }, toolbar: { padding: '6px' } },
    classNames: { root: 'custom-ss' },
  },
};

export const Playground: Story = {
  args: { columns: 10, rows: 20, initialSheets: 1 },
};
