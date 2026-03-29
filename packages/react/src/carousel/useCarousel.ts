/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCarousel — Carousel React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createCarousel,
  type CarouselConfig,
  type CarouselAPI,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseCarouselProps {
  /** Toplam slayt sayisi / Total slide count */
  slideCount?: number;
  /** Baslangic index / Default index */
  defaultIndex?: number;
  /** Otomatik oynatim / Autoplay */
  autoplay?: boolean;
  /** Otomatik oynatim araligi (ms) / Autoplay interval */
  autoplayInterval?: number;
  /** Dongu / Loop */
  loop?: boolean;
  /** Slayt degisince / On slide change */
  onSlideChange?: (index: number) => void;
}

// ── Hook Return ─────────────────────────────────────

export interface UseCarouselReturn {
  /** Aktif slayt indexi / Active slide index */
  activeIndex: number;
  /** Toplam slayt sayisi / Total slide count */
  slideCount: number;
  /** Autoplay aktif mi / Is autoplay active */
  isAutoPlaying: boolean;
  /** Dongu modu / Loop mode */
  loop: boolean;
  /** Sonraki slayt / Go to next slide */
  next: () => void;
  /** Onceki slayt / Go to previous slide */
  prev: () => void;
  /** Belirli slayta git / Go to specific slide */
  goTo: (index: number) => void;
  /** Autoplay ayarla / Set autoplay */
  setAutoplay: (enabled: boolean) => void;
  /** Core API / Core API */
  api: CarouselAPI;
}

/**
 * useCarousel — Carousel yonetim hook.
 * useCarousel — Carousel management hook.
 */
export function useCarousel(props: UseCarouselProps = {}): UseCarouselReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<CarouselAPI | null>(null);
  const prevRef = useRef<UseCarouselProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: CarouselConfig = {
      slideCount: props.slideCount,
      defaultIndex: props.defaultIndex,
      autoplay: props.autoplay,
      autoplayInterval: props.autoplayInterval,
      loop: props.loop,
      onSlideChange: props.onSlideChange,
    };
    apiRef.current = createCarousel(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.slideCount !== props.slideCount && props.slideCount !== undefined) {
      api.send({ type: 'SET_SLIDE_COUNT', count: props.slideCount });
      forceRender();
    }
    if (prev.autoplay !== props.autoplay && props.autoplay !== undefined) {
      api.send({ type: 'SET_AUTOPLAY', enabled: props.autoplay });
      forceRender();
    }
    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);

  // ── Cleanup ──
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const next = useCallback(() => api.send({ type: 'NEXT' }), [api]);
  const prev = useCallback(() => api.send({ type: 'PREV' }), [api]);
  const goTo = useCallback((index: number) => api.send({ type: 'GO_TO', index }), [api]);
  const setAutoplay = useCallback(
    (enabled: boolean) => api.send({ type: 'SET_AUTOPLAY', enabled }),
    [api],
  );

  return {
    activeIndex: ctx.activeIndex,
    slideCount: ctx.slideCount,
    isAutoPlaying: ctx.isAutoPlaying,
    loop: ctx.loop,
    next,
    prev,
    goTo,
    setAutoplay,
    api,
  };
}
