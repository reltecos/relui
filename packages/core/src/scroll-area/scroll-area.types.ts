/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ScrollArea types — scroll bölgesi tipleri.
 *
 * @packageDocumentation
 */

/** Scrollbar görünürlük modu. */
export type ScrollAreaType = 'auto' | 'always' | 'hover' | 'scroll';

/** Scroll yönü. */
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

/** Scroll pozisyon bilgisi. */
export interface ScrollPosition {
  /** Yatay scroll pozisyonu (px). */
  scrollLeft: number;
  /** Dikey scroll pozisyonu (px). */
  scrollTop: number;
}

/** Viewport boyut bilgisi. */
export interface ScrollDimensions {
  /** Viewport genişliği (px). */
  viewportWidth: number;
  /** Viewport yüksekliği (px). */
  viewportHeight: number;
  /** İçerik genişliği (px). */
  contentWidth: number;
  /** İçerik yüksekliği (px). */
  contentHeight: number;
}

/** Thumb boyut ve pozisyon bilgisi (yüzde). */
export interface ThumbInfo {
  /** Thumb boyutu (0-1 arası oran). */
  size: number;
  /** Thumb pozisyonu (0-1 arası oran). */
  position: number;
}

/** ScrollArea prop'ları. */
export interface ScrollAreaProps {
  /** Scrollbar görünürlük modu. Varsayılan: 'hover'. */
  type?: ScrollAreaType;
  /** Scroll yönü. Varsayılan: 'vertical'. */
  orientation?: ScrollAreaOrientation;
  /**
   * Minimum thumb boyutu (px).
   * Çok uzun içerikte thumb'ın görünmez küçüklükte olmasını engeller.
   * Varsayılan: 20.
   */
  minThumbSize?: number;
}

/** ScrollArea state machine event'leri. */
export type ScrollAreaEvent =
  | { type: 'SCROLL'; scrollLeft: number; scrollTop: number }
  | { type: 'RESIZE'; dimensions: ScrollDimensions }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'SCROLLBAR_POINTER_ENTER'; axis: 'x' | 'y' }
  | { type: 'SCROLLBAR_POINTER_LEAVE'; axis: 'x' | 'y' }
  | { type: 'THUMB_POINTER_DOWN'; axis: 'x' | 'y'; pointerPos: number }
  | { type: 'THUMB_POINTER_MOVE'; pointerPos: number }
  | { type: 'THUMB_POINTER_UP' }
  | { type: 'TRACK_CLICK'; axis: 'x' | 'y'; clickPos: number; trackSize: number }
  | { type: 'SET_TYPE'; value: ScrollAreaType }
  | { type: 'SET_ORIENTATION'; value: ScrollAreaOrientation };

/** ScrollArea state machine API. */
export interface ScrollAreaAPI {
  /** Mevcut scroll pozisyonu. */
  getScrollPosition: () => ScrollPosition;
  /** Mevcut viewport boyutları. */
  getDimensions: () => ScrollDimensions;
  /** Dikey thumb bilgisi. */
  getVerticalThumb: () => ThumbInfo;
  /** Yatay thumb bilgisi. */
  getHorizontalThumb: () => ThumbInfo;
  /** Dikey scrollbar görünür mü. */
  isVerticalVisible: () => boolean;
  /** Yatay scrollbar görünür mü. */
  isHorizontalVisible: () => boolean;
  /** Scrollbar'lar şu an gösterilmeli mi (type + hover state'e göre). */
  shouldShowScrollbars: () => boolean;
  /** Hover durumu. */
  isHovered: () => boolean;
  /** Thumb sürükleniyor mu. */
  isDragging: () => boolean;
  /** Sürükleme ekseni. */
  getDragAxis: () => 'x' | 'y' | null;
  /** Scroll pozisyonunu hesapla — thumb sürükleme sırasında kullanılır. */
  getScrollFromThumbDrag: () => ScrollPosition | null;
  /** Track click'ten scroll pozisyonu hesapla. */
  getScrollFromTrackClick: (axis: 'x' | 'y', clickPos: number, trackSize: number) => number;
  /** Event gönder. */
  send: (event: ScrollAreaEvent) => void;
  /** Scrollbar type. */
  getType: () => ScrollAreaType;
  /** Scroll orientation. */
  getOrientation: () => ScrollAreaOrientation;
}
