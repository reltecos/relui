/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Carousel state machine.
 *
 * @packageDocumentation
 */

import type {
  CarouselConfig,
  CarouselContext,
  CarouselEvent,
  CarouselAPI,
} from './carousel.types';

/**
 * Carousel state machine olusturur.
 * Creates a carousel state machine.
 */
export function createCarousel(config: CarouselConfig = {}): CarouselAPI {
  const {
    slideCount: initialSlideCount = 0,
    defaultIndex = 0,
    autoplay = false,
    autoplayInterval = 3000,
    loop = false,
    onSlideChange,
  } = config;

  // ── State ──
  let activeIndex = defaultIndex;
  let slideCount = initialSlideCount;
  let isAutoPlaying = autoplay;
  let autoplayTimer: ReturnType<typeof setInterval> | null = null;

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──
  function clampIndex(index: number): number {
    if (slideCount <= 0) return 0;
    if (loop) {
      return ((index % slideCount) + slideCount) % slideCount;
    }
    return Math.max(0, Math.min(index, slideCount - 1));
  }

  function goTo(index: number): void {
    const next = clampIndex(index);
    if (next === activeIndex && slideCount > 0) return;
    activeIndex = next;
    onSlideChange?.(activeIndex);
    notify();
  }

  function startAutoplay(): void {
    stopAutoplay();
    if (slideCount <= 1) return;
    autoplayTimer = setInterval(() => {
      const next = activeIndex + 1;
      if (!loop && next >= slideCount) {
        goTo(0);
      } else {
        goTo(next);
      }
    }, autoplayInterval);
  }

  function stopAutoplay(): void {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // ── Init autoplay ──
  if (isAutoPlaying && slideCount > 1) {
    startAutoplay();
  }

  // ── Send ──
  function send(event: CarouselEvent): void {
    switch (event.type) {
      case 'NEXT': {
        goTo(activeIndex + 1);
        break;
      }
      case 'PREV': {
        goTo(activeIndex - 1);
        break;
      }
      case 'GO_TO': {
        goTo(event.index);
        break;
      }
      case 'SET_AUTOPLAY': {
        if (event.enabled === isAutoPlaying) return;
        isAutoPlaying = event.enabled;
        if (isAutoPlaying) {
          startAutoplay();
        } else {
          stopAutoplay();
        }
        notify();
        break;
      }
      case 'SET_SLIDE_COUNT': {
        if (event.count === slideCount) return;
        slideCount = event.count;
        if (activeIndex >= slideCount && slideCount > 0) {
          activeIndex = slideCount - 1;
        }
        if (isAutoPlaying) {
          startAutoplay();
        }
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): CarouselContext {
      return {
        activeIndex,
        slideCount,
        isAutoPlaying,
        loop,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    destroy(): void {
      stopAutoplay();
      listeners.clear();
    },
  };
}
