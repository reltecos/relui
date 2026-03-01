/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TileLayout types — grid tabanlı panel yerleşimi tipleri.
 *
 * @packageDocumentation
 */

/** Tile öğesi. */
export interface TileItem {
  /** Benzersiz kimlik. */
  id: string;
  /** Grid satırı (0-based). */
  row: number;
  /** Grid kolonu (0-based). */
  col: number;
  /** Kaç satır kaplar. Varsayılan: 1. */
  rowSpan?: number;
  /** Kaç kolon kaplar. Varsayılan: 1. */
  colSpan?: number;
}

/** TileLayout yapılandırma prop'ları. */
export interface TileLayoutProps {
  /** Grid kolon sayısı. Varsayılan: 3. */
  columns?: number;
  /** Satır yüksekliği (px). Varsayılan: 200. */
  rowHeight?: number;
  /** Tile arası boşluk (px). Varsayılan: 8. */
  gap?: number;
  /** Başlangıç tile listesi. */
  tiles?: TileItem[];
}

/** TileLayout state machine event'leri. */
export type TileLayoutEvent =
  | { type: 'ADD_TILE'; tile: TileItem }
  | { type: 'REMOVE_TILE'; id: string }
  | { type: 'MOVE_TILE'; id: string; row: number; col: number }
  | { type: 'RESIZE_TILE'; id: string; rowSpan: number; colSpan: number }
  | { type: 'SET_COLUMNS'; value: number }
  | { type: 'SET_ROW_HEIGHT'; value: number }
  | { type: 'SET_GAP'; value: number }
  | { type: 'REORDER'; orderedIds: string[] };

/** TileLayout state machine API. */
export interface TileLayoutAPI {
  /** Tüm tile'ları al. */
  getTiles: () => TileItem[];
  /** Belirli tile'ı al. */
  getTile: (id: string) => TileItem | undefined;
  /** Kolon sayısı. */
  getColumns: () => number;
  /** Satır yüksekliği. */
  getRowHeight: () => number;
  /** Gap değeri. */
  getGap: () => number;
  /** Toplam satır sayısı. */
  getTotalRows: () => number;
  /** Event gönder. */
  send: (event: TileLayoutEvent) => void;
}
