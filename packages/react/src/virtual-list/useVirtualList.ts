/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useVirtualList — VirtualList core binding hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createVirtualList } from '@relteco/relui-core';
import type { VirtualListConfig, VirtualListContext, VirtualListAPI } from '@relteco/relui-core';

export interface UseVirtualListProps {
  /** Toplam oge sayisi / Total item count */
  totalCount: number;
  /** Sabit oge yuksekligi (px) / Fixed item height (px) */
  itemHeight: number;
  /** Gorunur alan yuksekligi (px) / Container height (px) */
  height?: number;
  /** Overscan oge sayisi / Overscan item count */
  overscan?: number;
  /** Scroll degisim callback / Scroll change callback */
  onScroll?: (scrollTop: number) => void;
}

export interface UseVirtualListReturn {
  /** Mevcut context / Current context */
  context: VirtualListContext;
  /** Scroll handler / Scroll handler */
  handleScroll: (scrollTop: number) => void;
  /** Container resize handler / Container resize handler */
  handleResize: (height: number) => void;
  /** Core API referansi / Core API reference */
  api: VirtualListAPI;
}

export function useVirtualList(props: UseVirtualListProps): UseVirtualListReturn {
  const { totalCount, itemHeight, height, overscan, onScroll } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<VirtualListAPI | null>(null);
  const prevRef = useRef<UseVirtualListProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createVirtualList({
      totalCount,
      itemHeight,
      containerHeight: height ?? 0,
      overscan,
      onScroll,
    } satisfies VirtualListConfig);
  }
  const api = apiRef.current;

  // Prop sync
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.totalCount !== totalCount) {
      api.send({ type: 'SET_TOTAL_COUNT', totalCount });
      forceRender();
    }
    if (prev.itemHeight !== itemHeight) {
      api.send({ type: 'SET_ITEM_HEIGHT', itemHeight });
      forceRender();
    }
    if (prev.height !== height && height !== undefined) {
      api.send({ type: 'RESIZE', containerHeight: height });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const handleScroll = useCallback(
    (scrollTop: number) => { api.send({ type: 'SCROLL', scrollTop }); },
    [api],
  );

  const handleResize = useCallback(
    (h: number) => { api.send({ type: 'RESIZE', containerHeight: h }); },
    [api],
  );

  return {
    context: api.getContext(),
    handleScroll,
    handleResize,
    api,
  };
}
