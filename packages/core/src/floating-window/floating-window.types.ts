/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FloatingWindow types — taşınabilir/boyutlandırılabilir pencere tipleri.
 *
 * @packageDocumentation
 */

/** Pencere durumu. */
export type WindowState = 'normal' | 'minimized' | 'maximized';

/** Pencere pozisyonu. */
export interface WindowPosition {
  x: number;
  y: number;
}

/** Pencere boyutu. */
export interface WindowSize {
  width: number;
  height: number;
}

/** FloatingWindow yapılandırma prop'ları. */
export interface FloatingWindowProps {
  /** Başlangıç pozisyonu. */
  defaultPosition?: WindowPosition;
  /** Başlangıç boyutu. */
  defaultSize?: WindowSize;
  /** Minimum boyut. */
  minSize?: WindowSize;
  /** Maksimum boyut. */
  maxSize?: WindowSize;
  /** Pencere durumu. Varsayılan: 'normal'. */
  state?: WindowState;
  /** Taşınabilir mi. Varsayılan: true. */
  draggable?: boolean;
  /** Boyutlandırılabilir mi. Varsayılan: true. */
  resizable?: boolean;
  /** z-index. */
  zIndex?: number;
}

/** FloatingWindow state machine event'leri. */
export type FloatingWindowEvent =
  | { type: 'DRAG_START'; startX: number; startY: number }
  | { type: 'DRAG'; currentX: number; currentY: number }
  | { type: 'DRAG_END' }
  | { type: 'RESIZE'; width: number; height: number }
  | { type: 'SET_POSITION'; x: number; y: number }
  | { type: 'SET_SIZE'; width: number; height: number }
  | { type: 'MINIMIZE' }
  | { type: 'MAXIMIZE'; containerWidth: number; containerHeight: number }
  | { type: 'RESTORE' }
  | { type: 'SET_Z_INDEX'; value: number }
  | { type: 'FOCUS' };

/** FloatingWindow state machine API. */
export interface FloatingWindowAPI {
  /** Pencere pozisyonu. */
  getPosition: () => WindowPosition;
  /** Pencere boyutu. */
  getSize: () => WindowSize;
  /** Pencere durumu. */
  getState: () => WindowState;
  /** z-index. */
  getZIndex: () => number;
  /** Sürükleme aktif mi. */
  isDragging: () => boolean;
  /** Taşınabilir mi. */
  isDraggable: () => boolean;
  /** Boyutlandırılabilir mi. */
  isResizable: () => boolean;
  /** Event gönder. */
  send: (event: FloatingWindowEvent) => void;
}
