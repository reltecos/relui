/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  DragDropConfig, DragDropContext, DragDropEvent,
  DragDropAPI, DragItem, DropTarget, DragPosition,
} from './drag-drop.types';

function hitTest(pos: DragPosition, rect: DropTarget['rect']): boolean {
  if (!rect) return false;
  return pos.x >= rect.x && pos.x <= rect.x + rect.width &&
         pos.y >= rect.y && pos.y <= rect.y + rect.height;
}

export function createDragDrop(config: DragDropConfig = {}): DragDropAPI {
  const { onDrop, onDragStart, onDragEnd } = config;

  let activeItem: DragItem | null = null;
  let position: DragPosition | null = null;
  let overTargetId: string | null = null;
  const targets = new Map<string, DropTarget>();

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function findOverTarget(pos: DragPosition): string | null {
    if (!activeItem) return null;
    for (const [id, target] of targets) {
      if (target.accepts.includes(activeItem.type) && hitTest(pos, target.rect)) {
        return id;
      }
    }
    return null;
  }

  function getContext(): DragDropContext {
    return { activeItem, position, overTargetId, isDragging: activeItem !== null };
  }

  function send(event: DragDropEvent): void {
    switch (event.type) {
      case 'DRAG_START': {
        activeItem = event.item;
        position = event.position;
        overTargetId = findOverTarget(event.position);
        onDragStart?.(event.item);
        notify();
        break;
      }
      case 'DRAG_MOVE': {
        if (!activeItem) return;
        position = event.position;
        overTargetId = findOverTarget(event.position);
        notify();
        break;
      }
      case 'DRAG_END': {
        if (!activeItem) return;
        if (overTargetId && activeItem) {
          onDrop?.(activeItem, overTargetId);
        }
        activeItem = null;
        position = null;
        overTargetId = null;
        onDragEnd?.();
        notify();
        break;
      }
      case 'REGISTER_DROPPABLE': {
        targets.set(event.target.id, event.target);
        break;
      }
      case 'UNREGISTER_DROPPABLE': {
        targets.delete(event.targetId);
        break;
      }
      case 'UPDATE_DROPPABLE_RECT': {
        const t = targets.get(event.targetId);
        if (t) {
          targets.set(event.targetId, { ...t, rect: event.rect });
        }
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void { listeners.clear(); targets.clear(); }

  return { getContext, send, subscribe, destroy };
}
