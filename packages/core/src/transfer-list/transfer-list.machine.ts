/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TransferList state machine — iki liste arasi tasima yonetimi.
 * TransferList state machine — two-list transfer management.
 *
 * @packageDocumentation
 */

import type {
  TransferListConfig,
  TransferListContext,
  TransferListEvent,
  TransferListAPI,
} from './transfer-list.types';

/**
 * TransferList state machine olusturur.
 * Creates a TransferList state machine.
 */
export function createTransferList(config: TransferListConfig): TransferListAPI {
  const {
    allIds,
    defaultTargetIds = [],
    onSourceChange,
    onTargetChange,
  } = config;

  // ── State ──
  let targetIds = new Set<string>(defaultTargetIds);
  let sourceIds = new Set<string>(allIds.filter((id) => !targetIds.has(id)));
  let selectedSourceIds = new Set<string>();
  let selectedTargetIds = new Set<string>();
  let filterSource = '';
  let filterTarget = '';

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function emitChanges(): void {
    onSourceChange?.(Array.from(sourceIds));
    onTargetChange?.(Array.from(targetIds));
  }

  function getContext(): TransferListContext {
    return {
      sourceIds,
      targetIds,
      selectedSourceIds,
      selectedTargetIds,
      filterSource,
      filterTarget,
    };
  }

  function send(event: TransferListEvent): void {
    switch (event.type) {
      case 'MOVE_RIGHT': {
        if (selectedSourceIds.size === 0) return;
        const nextSource = new Set(sourceIds);
        const nextTarget = new Set(targetIds);
        for (const id of selectedSourceIds) {
          nextSource.delete(id);
          nextTarget.add(id);
        }
        sourceIds = nextSource;
        targetIds = nextTarget;
        selectedSourceIds = new Set();
        emitChanges();
        notify();
        break;
      }
      case 'MOVE_LEFT': {
        if (selectedTargetIds.size === 0) return;
        const nextSource = new Set(sourceIds);
        const nextTarget = new Set(targetIds);
        for (const id of selectedTargetIds) {
          nextTarget.delete(id);
          nextSource.add(id);
        }
        sourceIds = nextSource;
        targetIds = nextTarget;
        selectedTargetIds = new Set();
        emitChanges();
        notify();
        break;
      }
      case 'MOVE_ALL_RIGHT': {
        if (sourceIds.size === 0) return;
        const nextTarget = new Set(targetIds);
        for (const id of sourceIds) nextTarget.add(id);
        targetIds = nextTarget;
        sourceIds = new Set();
        selectedSourceIds = new Set();
        emitChanges();
        notify();
        break;
      }
      case 'MOVE_ALL_LEFT': {
        if (targetIds.size === 0) return;
        const nextSource = new Set(sourceIds);
        for (const id of targetIds) nextSource.add(id);
        sourceIds = nextSource;
        targetIds = new Set();
        selectedTargetIds = new Set();
        emitChanges();
        notify();
        break;
      }
      case 'SELECT_SOURCE': {
        const next = new Set(selectedSourceIds);
        next.add(event.itemId);
        selectedSourceIds = next;
        notify();
        break;
      }
      case 'DESELECT_SOURCE': {
        if (!selectedSourceIds.has(event.itemId)) return;
        const next = new Set(selectedSourceIds);
        next.delete(event.itemId);
        selectedSourceIds = next;
        notify();
        break;
      }
      case 'TOGGLE_SOURCE': {
        const next = new Set(selectedSourceIds);
        if (next.has(event.itemId)) {
          next.delete(event.itemId);
        } else {
          next.add(event.itemId);
        }
        selectedSourceIds = next;
        notify();
        break;
      }
      case 'SELECT_TARGET': {
        const next = new Set(selectedTargetIds);
        next.add(event.itemId);
        selectedTargetIds = next;
        notify();
        break;
      }
      case 'DESELECT_TARGET': {
        if (!selectedTargetIds.has(event.itemId)) return;
        const next = new Set(selectedTargetIds);
        next.delete(event.itemId);
        selectedTargetIds = next;
        notify();
        break;
      }
      case 'TOGGLE_TARGET': {
        const next = new Set(selectedTargetIds);
        if (next.has(event.itemId)) {
          next.delete(event.itemId);
        } else {
          next.add(event.itemId);
        }
        selectedTargetIds = next;
        notify();
        break;
      }
      case 'SET_FILTER_SOURCE': {
        filterSource = event.value;
        notify();
        break;
      }
      case 'SET_FILTER_TARGET': {
        filterTarget = event.value;
        notify();
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}
