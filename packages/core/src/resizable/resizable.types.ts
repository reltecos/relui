/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Resizable types — boyutlandırılabilir eleman tipleri.
 *
 * @packageDocumentation
 */

/** Boyutlandırma yönü. */
export type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' |
  'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/** Boyutlandırma state durumu. */
export type ResizableState = 'idle' | 'resizing';

/** Boyut bilgisi. */
export interface ResizeSize {
  /** Genişlik (px). */
  width: number;
  /** Yükseklik (px). */
  height: number;
}

/** Resizable yapılandırma prop'ları. */
export interface ResizableProps {
  /** Başlangıç genişliği. */
  defaultWidth?: number;
  /** Başlangıç yüksekliği. */
  defaultHeight?: number;
  /** Minimum genişlik. Varsayılan: 50. */
  minWidth?: number;
  /** Minimum yükseklik. Varsayılan: 50. */
  minHeight?: number;
  /** Maksimum genişlik. */
  maxWidth?: number;
  /** Maksimum yükseklik. */
  maxHeight?: number;
  /** İzin verilen yönler. Varsayılan: tümü. */
  directions?: ResizeDirection[];
  /** Devre dışı mı. */
  disabled?: boolean;
}

/** Resizable state machine event'leri. */
export type ResizableEvent =
  | { type: 'RESIZE_START'; direction: ResizeDirection; pointerX: number; pointerY: number }
  | { type: 'RESIZE_MOVE'; pointerX: number; pointerY: number }
  | { type: 'RESIZE_END' }
  | { type: 'SET_SIZE'; width: number; height: number }
  | { type: 'SET_DISABLED'; value: boolean };

/** Resizable state machine API. */
export interface ResizableAPI {
  /** Mevcut state. */
  getResizeState: () => ResizableState;
  /** Boyutlandırılıyor mu. */
  isResizing: () => boolean;
  /** Mevcut boyut. */
  getSize: () => ResizeSize;
  /** Aktif boyutlandırma yönü. */
  getActiveDirection: () => ResizeDirection | null;
  /** Devre dışı mı. */
  isDisabled: () => boolean;
  /** Event gönder. */
  send: (event: ResizableEvent) => void;
}
