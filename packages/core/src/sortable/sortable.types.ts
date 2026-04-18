/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Siralanabilir oge / Sortable item */
export interface SortableItemDef {
  id: string;
}

/** Siralama yonu / Sort direction */
export type SortableDirection = 'vertical' | 'horizontal';

/** Sortable event tipleri / Sortable event types */
export type SortableEvent =
  | { type: 'DRAG_START'; itemId: string }
  | { type: 'DRAG_OVER'; overIndex: number }
  | { type: 'DRAG_END' }
  | { type: 'REORDER'; fromIndex: number; toIndex: number };

/** Sortable context / Sortable context */
export interface SortableContext {
  readonly items: ReadonlyArray<string>;
  readonly activeId: string | null;
  readonly overIndex: number | null;
  readonly isDragging: boolean;
}

/** Sortable yapilandirma / Sortable config */
export interface SortableConfig {
  /** Oge id listesi / Item ID list */
  items: string[];
  /** Yon / Direction */
  direction?: SortableDirection;
  /** Siralama degisince / On reorder */
  onReorder?: (items: string[]) => void;
}

/** Sortable API / Sortable API */
export interface SortableAPI {
  getContext(): SortableContext;
  send(event: SortableEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
