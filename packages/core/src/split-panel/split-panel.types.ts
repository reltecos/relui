/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplitPanel types — yatay/dikey bölme layout tipleri.
 *
 * @packageDocumentation
 */

/** Bölme yönü. */
export type SplitOrientation = 'horizontal' | 'vertical';

/** SplitPanel yapılandırma prop'ları. */
export interface SplitPanelProps {
  /** Panel sayısı. Varsayılan: 2. */
  panelCount?: number;
  /** Bölme yönü. Varsayılan: 'horizontal'. */
  orientation?: SplitOrientation;
  /** Gutter boyutu (px). Varsayılan: 8. */
  gutterSize?: number;
  /** Her panel için minimum boyut (px). */
  minSizes?: number[];
  /** Her panel için maksimum boyut (px). */
  maxSizes?: number[];
  /** Her panel daraltılabilir mi. */
  collapsible?: boolean[];
  /** Başlangıç boyutları (px). Belirtilmezse eşit bölünür. */
  defaultSizes?: number[];
  /** Container toplam boyutu (px). */
  containerSize?: number;
}

/** SplitPanel state machine event'leri. */
export type SplitPanelEvent =
  | { type: 'SET_CONTAINER_SIZE'; value: number }
  | { type: 'DRAG_START'; gutterIndex: number }
  | { type: 'DRAG'; delta: number }
  | { type: 'DRAG_END' }
  | { type: 'TOGGLE_COLLAPSE'; panelIndex: number }
  | { type: 'SET_SIZES'; sizes: number[] }
  | { type: 'SET_ORIENTATION'; value: SplitOrientation };

/** SplitPanel state machine API. */
export interface SplitPanelAPI {
  /** Panel boyutları (px, gutter hariç). */
  getSizes: () => number[];
  /** Panel daraltılmış mı. */
  isCollapsed: (panelIndex: number) => boolean;
  /** Sürükleme aktif mi. */
  isDragging: () => boolean;
  /** Aktif gutter indeksi. */
  getActiveGutter: () => number | null;
  /** Yön. */
  getOrientation: () => SplitOrientation;
  /** Gutter boyutu. */
  getGutterSize: () => number;
  /** Panel sayısı. */
  getPanelCount: () => number;
  /** Event gönder. */
  send: (event: SplitPanelEvent) => void;
}
