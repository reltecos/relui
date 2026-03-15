/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TileLayout } from './TileLayout';

const meta: Meta<typeof TileLayout> = {
  title: 'Window Manager/TileLayout',
  component: TileLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof TileLayout>;

const tileStyle = {
  background: 'var(--rel-color-bg-subtle, #f8fafc)',
  border: '1px solid var(--rel-color-border, #e2e8f0)',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 600,
  height: '100%',
};

export const Default: Story = {
  render: () => (
    <TileLayout
      columns={3}
      gap={8}
      rowHeight={150}
      tiles={[
        { id: 'a', row: 0, col: 0 },
        { id: 'b', row: 0, col: 1 },
        { id: 'c', row: 0, col: 2 },
        { id: 'd', row: 1, col: 0 },
        { id: 'e', row: 1, col: 1 },
        { id: 'f', row: 1, col: 2 },
      ]}
      renderTile={(tile) => <div style={tileStyle}>Tile {tile.id.toUpperCase()}</div>}
    />
  ),
};

export const WithSpans: Story = {
  render: () => (
    <TileLayout
      columns={4}
      gap={8}
      rowHeight={120}
      tiles={[
        { id: 'header', row: 0, col: 0, colSpan: 4 },
        { id: 'sidebar', row: 1, col: 0, rowSpan: 2 },
        { id: 'main', row: 1, col: 1, colSpan: 2, rowSpan: 2 },
        { id: 'widget', row: 1, col: 3 },
        { id: 'info', row: 2, col: 3 },
        { id: 'footer', row: 3, col: 0, colSpan: 4 },
      ]}
      renderTile={(tile) => (
        <div style={{ ...tileStyle, background: '#e0f2fe' }}>
          {tile.id}
          {tile.colSpan && tile.colSpan > 1 ? ` (${tile.colSpan} cols)` : ''}
          {tile.rowSpan && tile.rowSpan > 1 ? ` (${tile.rowSpan} rows)` : ''}
        </div>
      )}
    />
  ),
};

export const TwoColumns: Story = {
  render: () => (
    <TileLayout
      columns={2}
      gap={12}
      rowHeight={200}
      tiles={[
        { id: 'a', row: 0, col: 0 },
        { id: 'b', row: 0, col: 1 },
        { id: 'c', row: 1, col: 0, colSpan: 2 },
      ]}
      renderTile={(tile) => <div style={tileStyle}>Panel {tile.id.toUpperCase()}</div>}
    />
  ),
};

export const Dashboard: Story = {
  render: () => (
    <TileLayout
      columns={4}
      gap={8}
      rowHeight={100}
      tiles={[
        { id: 'kpi1', row: 0, col: 0 },
        { id: 'kpi2', row: 0, col: 1 },
        { id: 'kpi3', row: 0, col: 2 },
        { id: 'kpi4', row: 0, col: 3 },
        { id: 'chart', row: 1, col: 0, colSpan: 3, rowSpan: 2 },
        { id: 'activity', row: 1, col: 3, rowSpan: 2 },
        { id: 'table', row: 3, col: 0, colSpan: 4 },
      ]}
      renderTile={(tile) => {
        const colors: Record<string, string> = {
          kpi1: '#dbeafe', kpi2: '#dcfce7', kpi3: '#fef9c3', kpi4: '#fce7f3',
          chart: '#f0f9ff', activity: '#f0fdf4', table: '#fafafa',
        };
        return (
          <div style={{ ...tileStyle, background: colors[tile.id] ?? '#fff' }}>
            {tile.id}
          </div>
        );
      }}
    />
  ),
};

export const SingleColumn: Story = {
  render: () => (
    <TileLayout
      columns={1}
      gap={4}
      rowHeight={80}
      tiles={[
        { id: '1', row: 0, col: 0 },
        { id: '2', row: 1, col: 0 },
        { id: '3', row: 2, col: 0 },
      ]}
      renderTile={(tile) => <div style={tileStyle}>Row {tile.id}</div>}
    />
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <TileLayout
      columns={3}
      gap={8}
      rowHeight={120}
      tiles={[
        { id: 'a', row: 0, col: 0 },
        { id: 'b', row: 0, col: 1, colSpan: 2 },
        { id: 'c', row: 1, col: 0, colSpan: 3 },
      ]}
      classNames={{ root: 'custom-grid' }}
      styles={{
        root: { padding: 16, background: '#f8fafc', borderRadius: 12 },
        tile: { borderRadius: 8, background: '#e0f2fe', padding: 16 },
      }}
      renderTile={(tile) => <div style={{ fontWeight: 600 }}>{tile.id.toUpperCase()}</div>}
    />
  ),
};

export const Compound: Story = {
  render: () => (
    <TileLayout columns={3} gap={8} rowHeight={150}>
      <TileLayout.Tile row={0} col={0} id="header" colSpan={3}>
        <div style={tileStyle}>Header (Compound API)</div>
      </TileLayout.Tile>
      <TileLayout.Tile row={1} col={0} id="sidebar" rowSpan={2}>
        <div style={tileStyle}>Sidebar</div>
      </TileLayout.Tile>
      <TileLayout.Tile row={1} col={1} id="main" colSpan={2}>
        <div style={tileStyle}>Main Content</div>
      </TileLayout.Tile>
      <TileLayout.Tile row={2} col={1} id="footer" colSpan={2}>
        <div style={tileStyle}>Footer</div>
      </TileLayout.Tile>
    </TileLayout>
  ),
};
