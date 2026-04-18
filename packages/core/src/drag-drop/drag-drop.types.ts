/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Suruklenen oge / Drag item */
export interface DragItem {
  id: string;
  type: string;
  data?: Record<string, unknown>;
}

/** Birakilabilir hedef / Drop target */
export interface DropTarget {
  id: string;
  accepts: string[];
  rect?: { x: number; y: number; width: number; height: number };
}

/** Pozisyon / Position */
export interface DragPosition {
  x: number;
  y: number;
}

/** DragDrop event tipleri / DragDrop event types */
export type DragDropEvent =
  | { type: 'DRAG_START'; item: DragItem; position: DragPosition }
  | { type: 'DRAG_MOVE'; position: DragPosition }
  | { type: 'DRAG_END' }
  | { type: 'REGISTER_DROPPABLE'; target: DropTarget }
  | { type: 'UNREGISTER_DROPPABLE'; targetId: string }
  | { type: 'UPDATE_DROPPABLE_RECT'; targetId: string; rect: DropTarget['rect'] };

/** DragDrop context / DragDrop context */
export interface DragDropContext {
  readonly activeItem: DragItem | null;
  readonly position: DragPosition | null;
  readonly overTargetId: string | null;
  readonly isDragging: boolean;
}

/** DragDrop yapilandirma / DragDrop config */
export interface DragDropConfig {
  /** Birak callback / On drop callback */
  onDrop?: (item: DragItem, targetId: string) => void;
  /** Surukleme baslangic / On drag start */
  onDragStart?: (item: DragItem) => void;
  /** Surukleme bitis / On drag end */
  onDragEnd?: () => void;
}

/** DragDrop API / DragDrop API */
export interface DragDropAPI {
  getContext(): DragDropContext;
  send(event: DragDropEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
