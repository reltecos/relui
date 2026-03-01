/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Resizable state machine — boyutlandırılabilir eleman state yönetimi.
 *
 * Pointer drag ile boyut hesaplama, min/max sınırlar, yön kontrolleri.
 *
 * @packageDocumentation
 */

import type {
  ResizableProps,
  ResizableEvent,
  ResizableAPI,
  ResizableState,
  ResizeDirection,
} from './resizable.types';

/** Varsayılan izin verilen yönler. */
const ALL_DIRECTIONS: ResizeDirection[] = [
  'top', 'right', 'bottom', 'left',
  'topLeft', 'topRight', 'bottomLeft', 'bottomRight',
];

/**
 * Resizable state machine oluşturur.
 *
 * @param props - Resizable yapılandırması.
 * @returns Resizable API.
 */
export function createResizable(props: ResizableProps = {}): ResizableAPI {
  let width = props.defaultWidth ?? 200;
  let height = props.defaultHeight ?? 200;
  const minWidth = props.minWidth ?? 50;
  const minHeight = props.minHeight ?? 50;
  const maxWidth = props.maxWidth ?? Infinity;
  const maxHeight = props.maxHeight ?? Infinity;
  const directions = props.directions ?? ALL_DIRECTIONS;
  let disabled = props.disabled ?? false;

  let state: ResizableState = 'idle';
  let activeDirection: ResizeDirection | null = null;
  let startPointerX = 0;
  let startPointerY = 0;
  let startWidth = 0;
  let startHeight = 0;

  function clampWidth(w: number): number {
    return Math.max(minWidth, Math.min(maxWidth, w));
  }

  function clampHeight(h: number): number {
    return Math.max(minHeight, Math.min(maxHeight, h));
  }

  function send(event: ResizableEvent): void {
    switch (event.type) {
      case 'RESIZE_START': {
        if (disabled) break;
        if (!directions.includes(event.direction)) break;

        state = 'resizing';
        activeDirection = event.direction;
        startPointerX = event.pointerX;
        startPointerY = event.pointerY;
        startWidth = width;
        startHeight = height;
        break;
      }

      case 'RESIZE_MOVE': {
        if (state !== 'resizing' || activeDirection === null) break;

        const deltaX = event.pointerX - startPointerX;
        const deltaY = event.pointerY - startPointerY;

        switch (activeDirection) {
          case 'right':
            width = clampWidth(startWidth + deltaX);
            break;
          case 'left':
            width = clampWidth(startWidth - deltaX);
            break;
          case 'bottom':
            height = clampHeight(startHeight + deltaY);
            break;
          case 'top':
            height = clampHeight(startHeight - deltaY);
            break;
          case 'topLeft':
            width = clampWidth(startWidth - deltaX);
            height = clampHeight(startHeight - deltaY);
            break;
          case 'topRight':
            width = clampWidth(startWidth + deltaX);
            height = clampHeight(startHeight - deltaY);
            break;
          case 'bottomLeft':
            width = clampWidth(startWidth - deltaX);
            height = clampHeight(startHeight + deltaY);
            break;
          case 'bottomRight':
            width = clampWidth(startWidth + deltaX);
            height = clampHeight(startHeight + deltaY);
            break;
        }
        break;
      }

      case 'RESIZE_END':
        state = 'idle';
        activeDirection = null;
        break;

      case 'SET_SIZE':
        width = clampWidth(event.width);
        height = clampHeight(event.height);
        break;

      case 'SET_DISABLED':
        disabled = event.value;
        if (disabled && state === 'resizing') {
          state = 'idle';
          activeDirection = null;
        }
        break;
    }
  }

  return {
    getResizeState: () => state,
    isResizing: () => state === 'resizing',
    getSize: () => ({ width, height }),
    getActiveDirection: () => activeDirection,
    isDisabled: () => disabled,
    send,
  };
}
