/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanColumn, KanbanCard } from '@relteco/relui-core';

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', order: 0 },
  { id: 'doing', title: 'Doing', order: 1, wipLimit: 3 },
  { id: 'done', title: 'Done', order: 2 },
];

const cards: KanbanCard[] = [
  { id: 'c1', title: 'Task 1', description: 'Desc 1', columnId: 'todo', order: 0 },
  { id: 'c2', title: 'Task 2', columnId: 'todo', order: 1 },
  { id: 'c3', title: 'Task 3', columnId: 'doing', order: 0 },
];

describe('KanbanBoard', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getByTestId('kanban-root')).toBeInTheDocument();
  });

  it('role region ve aria-label set edilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getByTestId('kanban-root')).toHaveAttribute('role', 'region');
    expect(screen.getByTestId('kanban-root')).toHaveAttribute('aria-label', 'Kanban board');
  });

  // ── Columns ──

  it('sutunlar render edilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getAllByTestId('kanban-column')).toHaveLength(3);
  });

  it('sutun basliklari gosterilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    const headers = screen.getAllByTestId('kanban-column-header');
    expect(headers[0]).toHaveTextContent('To Do');
    expect(headers[1]).toHaveTextContent('Doing');
    expect(headers[2]).toHaveTextContent('Done');
  });

  it('WIP indicator gosterilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getByTestId('kanban-wip-indicator')).toHaveTextContent('1/3');
  });

  // ── Cards ──

  it('kartlar render edilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getAllByTestId('kanban-card')).toHaveLength(3);
  });

  it('kart basligi gosterilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getAllByTestId('kanban-card-title')[0]).toHaveTextContent('Task 1');
  });

  it('kart aciklamasi gosterilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getByTestId('kanban-card-description')).toHaveTextContent('Desc 1');
  });

  it('kart draggable', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    expect(screen.getAllByTestId('kanban-card')[0]).toHaveAttribute('draggable', 'true');
  });

  // ── Drag & Drop ──

  it('drag start ile dragState set edilir', () => {
    render(<KanbanBoard columns={columns} cards={cards} />);
    const card = screen.getAllByTestId('kanban-card')[0];
    fireEvent.dragStart(card);
    // dragState internal - gorunur efekt yok ama hata vermemeli
    expect(card).toBeInTheDocument();
  });

  it('drop ile kart tasima tetiklenir', () => {
    const onCardMove = vi.fn();
    render(<KanbanBoard columns={columns} cards={cards} onCardMove={onCardMove} />);
    const card = screen.getAllByTestId('kanban-card')[0];
    const targetCol = screen.getAllByTestId('kanban-column')[2]; // Done
    fireEvent.dragStart(card);
    fireEvent.dragOver(targetCol);
    fireEvent.drop(targetCol);
    expect(onCardMove).toHaveBeenCalledWith('c1', 'done', undefined);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} className="my-kb" />);
    expect(screen.getByTestId('kanban-root').className).toContain('my-kb');
  });

  it('style root elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} style={{ padding: '24px' }} />);
    expect(screen.getByTestId('kanban-root')).toHaveStyle({ padding: '24px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('kanban-root').className).toContain('custom-root');
  });

  it('classNames.column column elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} classNames={{ column: 'custom-col' }} />);
    expect(screen.getAllByTestId('kanban-column')[0].className).toContain('custom-col');
  });

  it('classNames.columnHeader columnHeader elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} classNames={{ columnHeader: 'custom-ch' }} />);
    expect(screen.getAllByTestId('kanban-column-header')[0].className).toContain('custom-ch');
  });

  it('classNames.card card elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} classNames={{ card: 'custom-card' }} />);
    expect(screen.getAllByTestId('kanban-card')[0].className).toContain('custom-card');
  });

  it('classNames.cardTitle cardTitle elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} classNames={{ cardTitle: 'custom-ct' }} />);
    expect(screen.getAllByTestId('kanban-card-title')[0].className).toContain('custom-ct');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} styles={{ root: { padding: '32px' } }} />);
    expect(screen.getByTestId('kanban-root')).toHaveStyle({ padding: '32px' });
  });

  it('styles.column column elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} styles={{ column: { padding: '12px' } }} />);
    expect(screen.getAllByTestId('kanban-column')[0]).toHaveStyle({ padding: '12px' });
  });

  it('styles.columnHeader columnHeader elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} styles={{ columnHeader: { fontSize: '18px' } }} />);
    expect(screen.getAllByTestId('kanban-column-header')[0]).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.card card elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} styles={{ card: { padding: '20px' } }} />);
    expect(screen.getAllByTestId('kanban-card')[0]).toHaveStyle({ padding: '20px' });
  });

  it('styles.cardTitle cardTitle elemana eklenir', () => {
    render(<KanbanBoard columns={columns} cards={cards} styles={{ cardTitle: { letterSpacing: '0.05em' } }} />);
    expect(screen.getAllByTestId('kanban-card-title')[0]).toHaveStyle({ letterSpacing: '0.05em' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<KanbanBoard columns={columns} cards={cards} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('KanbanBoard (Compound)', () => {
  it('compound: column render edilir', () => {
    render(
      <KanbanBoard columns={columns} cards={cards}>
        <KanbanBoard.Column columnId="todo" />
        <KanbanBoard.Column columnId="doing" />
      </KanbanBoard>,
    );
    expect(screen.getAllByTestId('kanban-column')).toHaveLength(2);
  });

  it('compound: card render edilir', () => {
    render(
      <KanbanBoard columns={columns} cards={cards}>
        <KanbanBoard.Card>Custom Card</KanbanBoard.Card>
      </KanbanBoard>,
    );
    expect(screen.getByTestId('kanban-card')).toHaveTextContent('Custom Card');
  });

  it('compound: swimlane render edilir', () => {
    render(
      <KanbanBoard columns={columns} cards={cards}>
        <KanbanBoard.Swimlane title="Feature">
          <KanbanBoard.Column columnId="todo" />
        </KanbanBoard.Swimlane>
      </KanbanBoard>,
    );
    expect(screen.getByTestId('kanban-swimlane')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-swimlane-header')).toHaveTextContent('Feature');
  });

  it('compound: add button render edilir', () => {
    render(
      <KanbanBoard columns={columns} cards={cards}>
        <KanbanBoard.AddButton columnId="todo" />
      </KanbanBoard>,
    );
    expect(screen.getByTestId('kanban-add-btn')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} classNames={{ card: 'cmp-card' }}>
        <KanbanBoard.Column columnId="todo" />
      </KanbanBoard>,
    );
    expect(screen.getAllByTestId('kanban-card')[0].className).toContain('cmp-card');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <KanbanBoard columns={columns} cards={cards} styles={{ column: { padding: '16px' } }}>
        <KanbanBoard.Column columnId="todo" />
      </KanbanBoard>,
    );
    expect(screen.getAllByTestId('kanban-column')[0]).toHaveStyle({ padding: '16px' });
  });

  it('KanbanBoard.Column context disinda hata firlatir', () => {
    expect(() => render(<KanbanBoard.Column columnId="todo" />)).toThrow();
  });
});
