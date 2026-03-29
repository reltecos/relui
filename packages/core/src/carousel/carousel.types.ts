/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Carousel tipleri.
 * Carousel types.
 *
 * @packageDocumentation
 */

// ── Events ───────────────────────────────────────────

/** Carousel event'leri / Carousel events */
export type CarouselEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; index: number }
  | { type: 'SET_AUTOPLAY'; enabled: boolean }
  | { type: 'SET_SLIDE_COUNT'; count: number };

// ── Context ──────────────────────────────────────────

/** Carousel state / Carousel context */
export interface CarouselContext {
  /** Aktif slayt indexi / Active slide index */
  readonly activeIndex: number;
  /** Toplam slayt sayisi / Total slide count */
  readonly slideCount: number;
  /** Otomatik oynatim aktif mi / Is autoplay active */
  readonly isAutoPlaying: boolean;
  /** Dongu modu / Loop mode */
  readonly loop: boolean;
}

// ── Config ───────────────────────────────────────────

/** Carousel yapilandirmasi / Carousel configuration */
export interface CarouselConfig {
  /** Toplam slayt sayisi / Total number of slides */
  slideCount?: number;
  /** Baslangic slayt indexi / Default active index */
  defaultIndex?: number;
  /** Otomatik oynatim / Autoplay */
  autoplay?: boolean;
  /** Otomatik oynatim araligi (ms) / Autoplay interval in ms */
  autoplayInterval?: number;
  /** Dongu modu / Loop mode */
  loop?: boolean;
  /** Slayt degisince callback / On slide change callback */
  onSlideChange?: (index: number) => void;
}

// ── API ──────────────────────────────────────────────

/** Carousel API / Carousel API */
export interface CarouselAPI {
  /** Guncel context / Get current context */
  getContext(): CarouselContext;
  /** Event gonder / Send event */
  send(event: CarouselEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
