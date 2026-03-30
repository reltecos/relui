/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** VirtualList event tipleri / VirtualList event types */
export type VirtualListEvent =
  | { type: 'SCROLL'; scrollTop: number }
  | { type: 'RESIZE'; containerHeight: number }
  | { type: 'SET_TOTAL_COUNT'; totalCount: number }
  | { type: 'SET_ITEM_HEIGHT'; itemHeight: number };

/** VirtualList gorunur aralik / VirtualList visible range */
export interface VirtualListRange {
  readonly startIndex: number;
  readonly endIndex: number;
}

/** VirtualList context / VirtualList context */
export interface VirtualListContext {
  readonly scrollTop: number;
  readonly containerHeight: number;
  readonly totalCount: number;
  readonly itemHeight: number;
  readonly overscan: number;
  readonly totalHeight: number;
  readonly visibleRange: VirtualListRange;
}

/** VirtualList yapilandirma / VirtualList config */
export interface VirtualListConfig {
  /** Toplam oge sayisi / Total item count */
  totalCount: number;
  /** Sabit oge yuksekligi (px) / Fixed item height (px) */
  itemHeight: number;
  /** Gorunur alan yuksekligi (px) / Container height (px) */
  containerHeight?: number;
  /** Viewport disinda ekstra render edilecek oge sayisi / Extra items outside viewport */
  overscan?: number;
  /** Scroll degisim callback / Scroll change callback */
  onScroll?: (scrollTop: number) => void;
}

/** VirtualList API / VirtualList API */
export interface VirtualListAPI {
  getContext(): VirtualListContext;
  send(event: VirtualListEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
