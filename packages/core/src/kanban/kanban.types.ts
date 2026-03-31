/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Kanban tipleri.
 * Kanban types.
 *
 * @packageDocumentation
 */

/** Kanban kart / Kanban card */
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  swimlaneId?: string;
  order: number;
  data?: Record<string, unknown>;
}

/** Kanban sutun / Kanban column */
export interface KanbanColumn {
  id: string;
  title: string;
  wipLimit?: number;
  order: number;
}

/** Kanban swimlane / Kanban swimlane */
export interface KanbanSwimlane {
  id: string;
  title: string;
  order: number;
}

/** Surukleme durumu / Drag state */
export interface KanbanDragState {
  cardId: string;
  sourceColumnId: string;
  sourceSwimlaneId?: string;
}

/** Kanban context / Kanban context */
export interface KanbanContext {
  readonly columns: ReadonlyArray<KanbanColumn>;
  readonly cards: ReadonlyArray<KanbanCard>;
  readonly swimlanes: ReadonlyArray<KanbanSwimlane>;
  readonly dragState: KanbanDragState | null;
}

/** Kanban event leri / Kanban events */
export type KanbanEvent =
  | { type: 'ADD_CARD'; card: Omit<KanbanCard, 'order'> }
  | { type: 'REMOVE_CARD'; cardId: string }
  | { type: 'UPDATE_CARD'; cardId: string; updates: Partial<Pick<KanbanCard, 'title' | 'description' | 'data'>> }
  | { type: 'MOVE_CARD'; cardId: string; toColumnId: string; toSwimlaneId?: string; toIndex?: number }
  | { type: 'ADD_COLUMN'; column: Omit<KanbanColumn, 'order'> }
  | { type: 'REMOVE_COLUMN'; columnId: string }
  | { type: 'UPDATE_COLUMN'; columnId: string; updates: Partial<Pick<KanbanColumn, 'title' | 'wipLimit'>> }
  | { type: 'SET_WIP_LIMIT'; columnId: string; limit: number | undefined }
  | { type: 'START_DRAG'; cardId: string }
  | { type: 'END_DRAG' }
  | { type: 'ADD_SWIMLANE'; swimlane: Omit<KanbanSwimlane, 'order'> }
  | { type: 'REMOVE_SWIMLANE'; swimlaneId: string };

/** Kanban yapilandirmasi / Kanban configuration */
export interface KanbanConfig {
  columns?: KanbanColumn[];
  cards?: KanbanCard[];
  swimlanes?: KanbanSwimlane[];
  onCardMove?: (cardId: string, toColumnId: string, toSwimlaneId?: string) => void;
  onCardAdd?: (card: KanbanCard) => void;
  onCardRemove?: (cardId: string) => void;
}

/** Kanban API / Kanban API */
export interface KanbanAPI {
  getContext(): KanbanContext;
  send(event: KanbanEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
