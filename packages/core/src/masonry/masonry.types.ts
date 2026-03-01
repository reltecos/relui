/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Masonry types — Pinterest tarzı grid tipleri.
 *
 * @packageDocumentation
 */

/** Masonry item pozisyon bilgisi. */
export interface MasonryItemPosition {
  /** Kolon indeksi (0-based). */
  column: number;
  /** Üstten uzaklık (px). */
  top: number;
  /** Soldan uzaklık (px). */
  left: number;
  /** Genişlik (px). */
  width: number;
}

/** Masonry yapılandırma prop'ları. */
export interface MasonryProps {
  /** Kolon sayısı. Varsayılan: 3. */
  columns?: number;
  /** Kolon arası boşluk (px). Varsayılan: 16. */
  gap?: number;
  /** Satır arası boşluk (px). Belirlenmezse gap kullanılır. */
  rowGap?: number;
  /** Container genişliği (px). */
  containerWidth?: number;
}

/** Masonry state machine event'leri. */
export type MasonryEvent =
  | { type: 'SET_ITEMS'; heights: number[] }
  | { type: 'SET_COLUMNS'; value: number }
  | { type: 'SET_GAP'; value: number }
  | { type: 'SET_CONTAINER_WIDTH'; value: number };

/** Masonry state machine API. */
export interface MasonryAPI {
  /** Item pozisyonlarını hesapla. */
  getPositions: () => MasonryItemPosition[];
  /** Toplam container yüksekliği. */
  getTotalHeight: () => number;
  /** Kolon sayısı. */
  getColumns: () => number;
  /** Gap değeri. */
  getGap: () => number;
  /** Event gönder. */
  send: (event: MasonryEvent) => void;
}
