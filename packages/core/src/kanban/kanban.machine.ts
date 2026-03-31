/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Kanban state machine.
 *
 * @packageDocumentation
 */

import type {
  KanbanConfig,
  KanbanContext,
  KanbanEvent,
  KanbanAPI,
  KanbanCard,
  KanbanColumn,
  KanbanSwimlane,
  KanbanDragState,
} from './kanban.types';

export function createKanban(config: KanbanConfig = {}): KanbanAPI {
  const { onCardMove, onCardAdd, onCardRemove } = config;

  let columns: KanbanColumn[] = [...(config.columns ?? [])];
  let cards: KanbanCard[] = [...(config.cards ?? [])];
  let swimlanes: KanbanSwimlane[] = [...(config.swimlanes ?? [])];
  let dragState: KanbanDragState | null = null;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getContext(): KanbanContext {
    return {
      columns: [...columns],
      cards: [...cards],
      swimlanes: [...swimlanes],
      dragState,
    };
  }

  function getCardsInColumn(columnId: string, swimlaneId?: string): KanbanCard[] {
    return cards
      .filter((c) => c.columnId === columnId && (swimlaneId === undefined || c.swimlaneId === swimlaneId))
      .sort((a, b) => a.order - b.order);
  }

  function send(event: KanbanEvent): void {
    switch (event.type) {
      case 'ADD_CARD': {
        const colCards = getCardsInColumn(event.card.columnId, event.card.swimlaneId);
        const col = columns.find((c) => c.id === event.card.columnId);
        if (col?.wipLimit !== undefined) {
          const allColCards = cards.filter((c) => c.columnId === event.card.columnId);
          if (allColCards.length >= col.wipLimit) break;
        }
        const newCard: KanbanCard = { ...event.card, order: colCards.length };
        cards = [...cards, newCard];
        onCardAdd?.(newCard);
        notify();
        break;
      }
      case 'REMOVE_CARD': {
        const card = cards.find((c) => c.id === event.cardId);
        if (!card) break;
        cards = cards.filter((c) => c.id !== event.cardId);
        onCardRemove?.(event.cardId);
        notify();
        break;
      }
      case 'UPDATE_CARD': {
        cards = cards.map((c) => c.id === event.cardId ? { ...c, ...event.updates } : c);
        notify();
        break;
      }
      case 'MOVE_CARD': {
        const card = cards.find((c) => c.id === event.cardId);
        if (!card) break;
        const targetCol = columns.find((c) => c.id === event.toColumnId);
        if (!targetCol) break;

        // WIP limit check
        if (targetCol.wipLimit !== undefined && event.toColumnId !== card.columnId) {
          const targetCards = cards.filter((c) => c.columnId === event.toColumnId);
          if (targetCards.length >= targetCol.wipLimit) break;
        }

        const targetIndex = event.toIndex ?? getCardsInColumn(event.toColumnId, event.toSwimlaneId).length;

        cards = cards.map((c) => {
          if (c.id === event.cardId) {
            return { ...c, columnId: event.toColumnId, swimlaneId: event.toSwimlaneId ?? c.swimlaneId, order: targetIndex };
          }
          return c;
        });

        // Reorder
        const colCards = getCardsInColumn(event.toColumnId, event.toSwimlaneId);
        cards = cards.map((c) => {
          const idx = colCards.findIndex((cc) => cc.id === c.id);
          if (idx !== -1) return { ...c, order: idx };
          return c;
        });

        onCardMove?.(event.cardId, event.toColumnId, event.toSwimlaneId);
        notify();
        break;
      }
      case 'ADD_COLUMN': {
        const newCol: KanbanColumn = { ...event.column, order: columns.length };
        columns = [...columns, newCol];
        notify();
        break;
      }
      case 'REMOVE_COLUMN': {
        columns = columns.filter((c) => c.id !== event.columnId);
        cards = cards.filter((c) => c.columnId !== event.columnId);
        notify();
        break;
      }
      case 'UPDATE_COLUMN': {
        columns = columns.map((c) => c.id === event.columnId ? { ...c, ...event.updates } : c);
        notify();
        break;
      }
      case 'SET_WIP_LIMIT': {
        columns = columns.map((c) => c.id === event.columnId ? { ...c, wipLimit: event.limit } : c);
        notify();
        break;
      }
      case 'START_DRAG': {
        const card = cards.find((c) => c.id === event.cardId);
        if (!card) break;
        dragState = { cardId: event.cardId, sourceColumnId: card.columnId, sourceSwimlaneId: card.swimlaneId };
        notify();
        break;
      }
      case 'END_DRAG':
        dragState = null;
        notify();
        break;
      case 'ADD_SWIMLANE': {
        const newSl: KanbanSwimlane = { ...event.swimlane, order: swimlanes.length };
        swimlanes = [...swimlanes, newSl];
        notify();
        break;
      }
      case 'REMOVE_SWIMLANE': {
        swimlanes = swimlanes.filter((s) => s.id !== event.swimlaneId);
        notify();
        break;
      }
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
