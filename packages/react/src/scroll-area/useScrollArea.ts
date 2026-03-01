/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useScrollArea — React hook for scroll area state machine.
 * useScrollArea — ScrollArea state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Scroll, resize, thumb drag ve scrollbar görünürlük yönetimi.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { createScrollArea } from '@relteco/relui-core';
import type {
  ScrollAreaType,
  ScrollAreaOrientation,
  ScrollAreaAPI,
} from '@relteco/relui-core';

/** useScrollArea hook props. */
export interface UseScrollAreaProps {
  /** Scrollbar görünürlük modu. Varsayılan: 'hover'. */
  type?: ScrollAreaType;
  /** Scroll yönü. Varsayılan: 'vertical'. */
  orientation?: ScrollAreaOrientation;
  /** Minimum thumb boyutu (px). Varsayılan: 20. */
  minThumbSize?: number;
}

/** useScrollArea hook dönüş değeri. */
export interface UseScrollAreaReturn {
  /** Root ref — scroll container'ı saran en dış element. */
  rootRef: React.RefObject<HTMLDivElement | null>;
  /** Viewport ref — scroll edilebilir alan. */
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Core API erişimi. */
  api: ScrollAreaAPI;
  /** Dikey thumb boyutu (0-1 oran). */
  verticalThumbSize: number;
  /** Dikey thumb pozisyonu (0-1 oran). */
  verticalThumbPosition: number;
  /** Yatay thumb boyutu (0-1 oran). */
  horizontalThumbSize: number;
  /** Yatay thumb pozisyonu (0-1 oran). */
  horizontalThumbPosition: number;
  /** Dikey scrollbar görünür mü. */
  verticalVisible: boolean;
  /** Yatay scrollbar görünür mü. */
  horizontalVisible: boolean;
  /** Scrollbar'lar gösterilmeli mi (type + hover state). */
  showScrollbars: boolean;
  /** Thumb sürükleniyor mu. */
  dragging: boolean;
  /** Root element pointer event handler'ları. */
  getRootProps: () => {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
  /** Viewport scroll event handler. */
  getViewportProps: () => {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  };
  /** Scrollbar props. */
  getScrollbarProps: (axis: 'x' | 'y') => {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: (e: React.PointerEvent) => void;
  };
  /** Thumb props. */
  getThumbProps: (axis: 'x' | 'y') => {
    onPointerDown: (e: React.PointerEvent) => void;
  };
}

/**
 * ScrollArea React hook'u.
 *
 * Core state machine'i React lifecycle'a bağlar.
 * Viewport scroll/resize dinleme, thumb drag, scrollbar hover yönetimi.
 */
export function useScrollArea(props: UseScrollAreaProps = {}): UseScrollAreaReturn {
  const { type = 'hover', orientation = 'vertical', minThumbSize = 20 } = props;

  const apiRef = useRef<ScrollAreaAPI | null>(null);
  if (apiRef.current === null) {
    apiRef.current = createScrollArea({ type, orientation, minThumbSize });
  }
  const api = apiRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // ── Prop senkronizasyonu ──────────────────────────────

  useEffect(() => {
    api.send({ type: 'SET_TYPE', value: type });
    forceRender();
  }, [api, type]);

  useEffect(() => {
    api.send({ type: 'SET_ORIENTATION', value: orientation });
    forceRender();
  }, [api, orientation]);

  // ── ResizeObserver ────────────────────────────────────

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateDimensions = () => {
      api.send({
        type: 'RESIZE',
        dimensions: {
          viewportWidth: viewport.clientWidth,
          viewportHeight: viewport.clientHeight,
          contentWidth: viewport.scrollWidth,
          contentHeight: viewport.scrollHeight,
        },
      });
      forceRender();
    };

    updateDimensions();

    const ro = new ResizeObserver(updateDimensions);
    ro.observe(viewport);

    // İçerik değiştiğinde de gözlemle
    if (viewport.firstElementChild) {
      ro.observe(viewport.firstElementChild);
    }

    return () => ro.disconnect();
  }, [api]);

  // ── Thumb drag global listener'lar ─────────────────────

  useEffect(() => {
    if (!api.isDragging()) return;

    const handlePointerMove = (e: PointerEvent) => {
      api.send({ type: 'THUMB_POINTER_MOVE', pointerPos: api.getDragAxis() === 'y' ? e.clientY : e.clientX });

      // Viewport'u güncelle
      const viewport = viewportRef.current;
      if (viewport) {
        const pos = api.getScrollPosition();
        viewport.scrollTop = pos.scrollTop;
        viewport.scrollLeft = pos.scrollLeft;
      }

      forceRender();
    };

    const handlePointerUp = () => {
      api.send({ type: 'THUMB_POINTER_UP' });
      forceRender();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [api, api.isDragging()]);

  // ── Event handler'lar ──────────────────────────────────

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      api.send({
        type: 'SCROLL',
        scrollLeft: target.scrollLeft,
        scrollTop: target.scrollTop,
      });
      forceRender();
    },
    [api],
  );

  const handlePointerEnter = useCallback(() => {
    api.send({ type: 'POINTER_ENTER' });
    forceRender();
  }, [api]);

  const handlePointerLeave = useCallback(() => {
    api.send({ type: 'POINTER_LEAVE' });
    forceRender();
  }, [api]);

  const handleScrollbarPointerEnter = useCallback(
    (axis: 'x' | 'y') => {
      api.send({ type: 'SCROLLBAR_POINTER_ENTER', axis });
      forceRender();
    },
    [api],
  );

  const handleScrollbarPointerLeave = useCallback(
    (axis: 'x' | 'y') => {
      api.send({ type: 'SCROLLBAR_POINTER_LEAVE', axis });
      forceRender();
    },
    [api],
  );

  const handleThumbPointerDown = useCallback(
    (axis: 'x' | 'y', e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

      api.send({
        type: 'THUMB_POINTER_DOWN',
        axis,
        pointerPos: axis === 'y' ? e.clientY : e.clientX,
      });
      forceRender();
    },
    [api],
  );

  const handleTrackClick = useCallback(
    (axis: 'x' | 'y', e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPos = axis === 'y' ? e.clientY - rect.top : e.clientX - rect.left;
      const trackSize = axis === 'y' ? rect.height : rect.width;

      api.send({ type: 'TRACK_CLICK', axis, clickPos, trackSize });

      // Viewport'u güncelle
      const viewport = viewportRef.current;
      if (viewport) {
        const pos = api.getScrollPosition();
        viewport.scrollTop = pos.scrollTop;
        viewport.scrollLeft = pos.scrollLeft;
      }

      forceRender();
    },
    [api],
  );

  // ── Computed values ────────────────────────────────────

  const verticalThumb = api.getVerticalThumb();
  const horizontalThumb = api.getHorizontalThumb();

  return {
    rootRef,
    viewportRef,
    api,
    verticalThumbSize: verticalThumb.size,
    verticalThumbPosition: verticalThumb.position,
    horizontalThumbSize: horizontalThumb.size,
    horizontalThumbPosition: horizontalThumb.position,
    verticalVisible: api.isVerticalVisible(),
    horizontalVisible: api.isHorizontalVisible(),
    showScrollbars: api.shouldShowScrollbars(),
    dragging: api.isDragging(),

    getRootProps: () => ({
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    }),

    getViewportProps: () => ({
      onScroll: handleScroll,
    }),

    getScrollbarProps: (axis: 'x' | 'y') => ({
      onPointerEnter: () => handleScrollbarPointerEnter(axis),
      onPointerLeave: () => handleScrollbarPointerLeave(axis),
      onPointerDown: (e: React.PointerEvent) => handleTrackClick(axis, e),
    }),

    getThumbProps: (axis: 'x' | 'y') => ({
      onPointerDown: (e: React.PointerEvent) => handleThumbPointerDown(axis, e),
    }),
  };
}
