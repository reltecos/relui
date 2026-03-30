/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * VirtualList state machine — sanal scroll hesaplama.
 * VirtualList state machine — virtual scroll computation.
 *
 * @packageDocumentation
 */

import type {
  VirtualListConfig,
  VirtualListContext,
  VirtualListEvent,
  VirtualListRange,
  VirtualListAPI,
} from './virtual-list.types';

function computeRange(
  scrollTop: number,
  containerHeight: number,
  totalCount: number,
  itemHeight: number,
  overscan: number,
): VirtualListRange {
  if (totalCount === 0 || itemHeight === 0 || containerHeight === 0) {
    return { startIndex: 0, endIndex: 0 };
  }

  const rawStart = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const rawEnd = rawStart + visibleCount;

  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalCount, rawEnd + overscan);

  return { startIndex, endIndex };
}

/**
 * VirtualList state machine olusturur.
 * Creates a VirtualList state machine.
 */
export function createVirtualList(config: VirtualListConfig): VirtualListAPI {
  let scrollTop = 0;
  let containerHeight = config.containerHeight ?? 0;
  let totalCount = config.totalCount;
  let itemHeight = config.itemHeight;
  const overscan = config.overscan ?? 5;

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getTotalHeight(): number {
    return totalCount * itemHeight;
  }

  function getVisibleRange(): VirtualListRange {
    return computeRange(scrollTop, containerHeight, totalCount, itemHeight, overscan);
  }

  function getContext(): VirtualListContext {
    return {
      scrollTop,
      containerHeight,
      totalCount,
      itemHeight,
      overscan,
      totalHeight: getTotalHeight(),
      visibleRange: getVisibleRange(),
    };
  }

  function send(event: VirtualListEvent): void {
    switch (event.type) {
      case 'SCROLL': {
        const clamped = Math.max(0, Math.min(event.scrollTop, getTotalHeight() - containerHeight));
        if (clamped === scrollTop) return;
        scrollTop = clamped;
        config.onScroll?.(scrollTop);
        notify();
        break;
      }
      case 'RESIZE': {
        if (event.containerHeight === containerHeight) return;
        containerHeight = event.containerHeight;
        notify();
        break;
      }
      case 'SET_TOTAL_COUNT': {
        if (event.totalCount === totalCount) return;
        totalCount = event.totalCount;
        notify();
        break;
      }
      case 'SET_ITEM_HEIGHT': {
        if (event.itemHeight === itemHeight) return;
        itemHeight = event.itemHeight;
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
