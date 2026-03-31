/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanColumn, KanbanCard } from '@relteco/relui-core';

const columns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', order: 0 },
  { id: 'todo', title: 'To Do', order: 1 },
  { id: 'doing', title: 'In Progress', order: 2, wipLimit: 3 },
  { id: 'done', title: 'Done', order: 3 },
];

const cards: KanbanCard[] = [
  { id: '1', title: 'Setup project', description: 'Initialize monorepo', columnId: 'done', order: 0 },
  { id: '2', title: 'Design tokens', description: 'CSS variables', columnId: 'done', order: 1 },
  { id: '3', title: 'Button component', columnId: 'doing', order: 0 },
  { id: '4', title: 'Input component', description: 'Text, number, password', columnId: 'doing', order: 1 },
  { id: '5', title: 'Select component', columnId: 'todo', order: 0 },
  { id: '6', title: 'Modal component', columnId: 'todo', order: 1 },
  { id: '7', title: 'DataGrid', description: 'Enterprise data grid', columnId: 'backlog', order: 0 },
  { id: '8', title: 'Calendar', columnId: 'backlog', order: 1 },
];

const meta: Meta<typeof KanbanBoard> = {
  title: 'Data Display/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  args: { columns, cards },
};

export const WithWipLimit: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', order: 0 },
      { id: 'doing', title: 'Doing', order: 1, wipLimit: 2 },
      { id: 'done', title: 'Done', order: 2 },
    ],
    cards: [
      { id: '1', title: 'Task A', columnId: 'doing', order: 0 },
      { id: '2', title: 'Task B', columnId: 'doing', order: 1 },
      { id: '3', title: 'Task C', columnId: 'todo', order: 0 },
    ],
  },
};

export const EmptyBoard: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', order: 0 },
      { id: 'doing', title: 'In Progress', order: 1 },
      { id: 'done', title: 'Done', order: 2 },
    ],
    cards: [],
  },
};

export const ManyCards: Story = {
  args: {
    columns,
    cards: Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      title: `Task ${i + 1}`,
      description: i % 3 === 0 ? `Description for task ${i + 1}` : undefined,
      columnId: ['backlog', 'todo', 'doing', 'done'][i % 4] as string,
      order: Math.floor(i / 4),
    })),
  },
};

export const Compound: Story = {
  render: () => (
    <KanbanBoard columns={columns} cards={cards}>
      <KanbanBoard.Column columnId="backlog" />
      <KanbanBoard.Column columnId="todo" />
      <KanbanBoard.Column columnId="doing" />
      <KanbanBoard.Column columnId="done" />
    </KanbanBoard>
  ),
};

export const CompoundWithSwimlane: Story = {
  render: () => (
    <KanbanBoard columns={columns} cards={cards}>
      <KanbanBoard.Swimlane title="Feature Work">
        <div style={{ display: 'flex', gap: 16 }}>
          <KanbanBoard.Column columnId="todo" />
          <KanbanBoard.Column columnId="doing" />
        </div>
      </KanbanBoard.Swimlane>
      <KanbanBoard.Swimlane title="Bug Fixes">
        <div style={{ display: 'flex', gap: 16 }}>
          <KanbanBoard.Column columnId="backlog" />
          <KanbanBoard.Column columnId="done" />
        </div>
      </KanbanBoard.Swimlane>
    </KanbanBoard>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    columns: columns.slice(0, 3),
    cards: cards.slice(0, 5),
    styles: {
      root: { padding: 24 },
      column: { borderRadius: 12 },
      columnHeader: { padding: '16px 20px' },
      card: { padding: '16px 20px' },
      cardTitle: { fontSize: '15px' },
    },
  },
};
