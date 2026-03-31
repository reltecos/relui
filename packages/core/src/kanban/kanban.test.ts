/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createKanban } from './kanban.machine';
import type { KanbanColumn, KanbanCard } from './kanban.types';

const cols: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', order: 0 },
  { id: 'doing', title: 'Doing', order: 1, wipLimit: 3 },
  { id: 'done', title: 'Done', order: 2 },
];

const cards: KanbanCard[] = [
  { id: 'c1', title: 'Task 1', columnId: 'todo', order: 0 },
  { id: 'c2', title: 'Task 2', columnId: 'todo', order: 1 },
  { id: 'c3', title: 'Task 3', columnId: 'doing', order: 0 },
];

function make(overrides = {}) {
  return createKanban({ columns: cols, cards, ...overrides });
}

describe('createKanban', () => {
  // ── Initial ──

  it('baslangic state dogru', () => {
    const api = make();
    const ctx = api.getContext();
    expect(ctx.columns).toHaveLength(3);
    expect(ctx.cards).toHaveLength(3);
    expect(ctx.swimlanes).toHaveLength(0);
    expect(ctx.dragState).toBeNull();
  });

  // ── Cards ──

  it('ADD_CARD kart ekler', () => {
    const api = make();
    api.send({ type: 'ADD_CARD', card: { id: 'c4', title: 'Task 4', columnId: 'todo' } });
    expect(api.getContext().cards).toHaveLength(4);
  });

  it('ADD_CARD WIP limit asildiysa eklemez', () => {
    const api = createKanban({
      columns: [{ id: 'col', title: 'Col', order: 0, wipLimit: 1 }],
      cards: [{ id: 'c1', title: 'T1', columnId: 'col', order: 0 }],
    });
    api.send({ type: 'ADD_CARD', card: { id: 'c2', title: 'T2', columnId: 'col' } });
    expect(api.getContext().cards).toHaveLength(1);
  });

  it('REMOVE_CARD kart siler', () => {
    const api = make();
    api.send({ type: 'REMOVE_CARD', cardId: 'c1' });
    expect(api.getContext().cards).toHaveLength(2);
  });

  it('REMOVE_CARD olmayan kart icin hata vermez', () => {
    const api = make();
    api.send({ type: 'REMOVE_CARD', cardId: 'nonexistent' });
    expect(api.getContext().cards).toHaveLength(3);
  });

  it('UPDATE_CARD title gunceller', () => {
    const api = make();
    api.send({ type: 'UPDATE_CARD', cardId: 'c1', updates: { title: 'Updated' } });
    const card = api.getContext().cards.find((c) => c.id === 'c1');
    expect(card?.title).toBe('Updated');
  });

  it('MOVE_CARD karti baska sutuna tasir', () => {
    const api = make();
    api.send({ type: 'MOVE_CARD', cardId: 'c1', toColumnId: 'doing' });
    const card = api.getContext().cards.find((c) => c.id === 'c1');
    expect(card?.columnId).toBe('doing');
  });

  it('MOVE_CARD WIP limit asildiysa tasimaz', () => {
    const api = createKanban({
      columns: [
        { id: 'a', title: 'A', order: 0 },
        { id: 'b', title: 'B', order: 1, wipLimit: 1 },
      ],
      cards: [
        { id: 'c1', title: 'T1', columnId: 'a', order: 0 },
        { id: 'c2', title: 'T2', columnId: 'b', order: 0 },
      ],
    });
    api.send({ type: 'MOVE_CARD', cardId: 'c1', toColumnId: 'b' });
    const card = api.getContext().cards.find((c) => c.id === 'c1');
    expect(card?.columnId).toBe('a');
  });

  it('onCardMove callback cagrilir', () => {
    const onCardMove = vi.fn();
    const api = createKanban({ columns: cols, cards, onCardMove });
    api.send({ type: 'MOVE_CARD', cardId: 'c1', toColumnId: 'doing' });
    expect(onCardMove).toHaveBeenCalledWith('c1', 'doing', undefined);
  });

  it('onCardAdd callback cagrilir', () => {
    const onCardAdd = vi.fn();
    const api = createKanban({ columns: cols, cards: [], onCardAdd });
    api.send({ type: 'ADD_CARD', card: { id: 'c1', title: 'T', columnId: 'todo' } });
    expect(onCardAdd).toHaveBeenCalled();
  });

  it('onCardRemove callback cagrilir', () => {
    const onCardRemove = vi.fn();
    const api = createKanban({ columns: cols, cards, onCardRemove });
    api.send({ type: 'REMOVE_CARD', cardId: 'c1' });
    expect(onCardRemove).toHaveBeenCalledWith('c1');
  });

  // ── Columns ──

  it('ADD_COLUMN sutun ekler', () => {
    const api = make();
    api.send({ type: 'ADD_COLUMN', column: { id: 'review', title: 'Review' } });
    expect(api.getContext().columns).toHaveLength(4);
  });

  it('REMOVE_COLUMN sutun ve kartlarini siler', () => {
    const api = make();
    api.send({ type: 'REMOVE_COLUMN', columnId: 'todo' });
    expect(api.getContext().columns).toHaveLength(2);
    expect(api.getContext().cards.filter((c) => c.columnId === 'todo')).toHaveLength(0);
  });

  it('UPDATE_COLUMN baslik gunceller', () => {
    const api = make();
    api.send({ type: 'UPDATE_COLUMN', columnId: 'todo', updates: { title: 'Backlog' } });
    expect(api.getContext().columns.find((c) => c.id === 'todo')?.title).toBe('Backlog');
  });

  it('SET_WIP_LIMIT limit ayarlar', () => {
    const api = make();
    api.send({ type: 'SET_WIP_LIMIT', columnId: 'todo', limit: 5 });
    expect(api.getContext().columns.find((c) => c.id === 'todo')?.wipLimit).toBe(5);
  });

  it('SET_WIP_LIMIT undefined ile kaldirir', () => {
    const api = make();
    api.send({ type: 'SET_WIP_LIMIT', columnId: 'doing', limit: undefined });
    expect(api.getContext().columns.find((c) => c.id === 'doing')?.wipLimit).toBeUndefined();
  });

  // ── Drag ──

  it('START_DRAG drag state set eder', () => {
    const api = make();
    api.send({ type: 'START_DRAG', cardId: 'c1' });
    expect(api.getContext().dragState).toEqual({ cardId: 'c1', sourceColumnId: 'todo', sourceSwimlaneId: undefined });
  });

  it('END_DRAG drag state temizler', () => {
    const api = make();
    api.send({ type: 'START_DRAG', cardId: 'c1' });
    api.send({ type: 'END_DRAG' });
    expect(api.getContext().dragState).toBeNull();
  });

  // ── Swimlanes ──

  it('ADD_SWIMLANE swimlane ekler', () => {
    const api = make();
    api.send({ type: 'ADD_SWIMLANE', swimlane: { id: 'sl1', title: 'Feature' } });
    expect(api.getContext().swimlanes).toHaveLength(1);
  });

  it('REMOVE_SWIMLANE swimlane siler', () => {
    const api = createKanban({ columns: cols, swimlanes: [{ id: 'sl1', title: 'F', order: 0 }] });
    api.send({ type: 'REMOVE_SWIMLANE', swimlaneId: 'sl1' });
    expect(api.getContext().swimlanes).toHaveLength(0);
  });

  // ── Subscribe ──

  it('subscribe bildirim alir', () => {
    const api = make();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'ADD_CARD', card: { id: 'x', title: 'X', columnId: 'todo' } });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('unsubscribe sonrasi bildirim alinmaz', () => {
    const api = make();
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    unsub();
    api.send({ type: 'END_DRAG' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const api = make();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'END_DRAG' });
    expect(fn).not.toHaveBeenCalled();
  });
});
