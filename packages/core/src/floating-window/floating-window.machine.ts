/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FloatingWindow state machine — taşınabilir/boyutlandırılabilir pencere yönetimi.
 *
 * Pozisyon, boyut, minimize/maximize ve sürükleme yönetir.
 *
 * @packageDocumentation
 */

import type {
  FloatingWindowProps,
  FloatingWindowEvent,
  FloatingWindowAPI,
  WindowState,
  WindowPosition,
  WindowSize,
} from './floating-window.types';

/**
 * FloatingWindow state machine oluşturur.
 *
 * @param props - FloatingWindow yapılandırması.
 * @returns FloatingWindow API.
 */
export function createFloatingWindow(props: FloatingWindowProps = {}): FloatingWindowAPI {
  let position: WindowPosition = { ...props.defaultPosition ?? { x: 100, y: 100 } };
  let size: WindowSize = { ...props.defaultSize ?? { width: 400, height: 300 } };
  const minSize: WindowSize = { ...props.minSize ?? { width: 200, height: 150 } };
  const maxSize: WindowSize = { ...props.maxSize ?? { width: Infinity, height: Infinity } };
  let state: WindowState = props.state ?? 'normal';
  const draggable = props.draggable ?? true;
  const resizable = props.resizable ?? true;
  let zIndex = props.zIndex ?? 1000;

  // Sürükleme state'i
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartPosition: WindowPosition = { x: 0, y: 0 };

  // Maximize'dan restore için kayıt
  let restorePosition: WindowPosition = { ...position };
  let restoreSize: WindowSize = { ...size };

  /** Boyutu min/max ile kısıtla. */
  function clampSize(w: number, h: number): WindowSize {
    return {
      width: Math.max(minSize.width, Math.min(maxSize.width, w)),
      height: Math.max(minSize.height, Math.min(maxSize.height, h)),
    };
  }

  function send(event: FloatingWindowEvent): void {
    switch (event.type) {
      case 'DRAG_START': {
        if (!draggable || state === 'maximized') break;
        dragging = true;
        dragStartX = event.startX;
        dragStartY = event.startY;
        dragStartPosition = { ...position };
        break;
      }

      case 'DRAG': {
        if (!dragging) break;
        const dx = event.currentX - dragStartX;
        const dy = event.currentY - dragStartY;
        position = {
          x: dragStartPosition.x + dx,
          y: dragStartPosition.y + dy,
        };
        break;
      }

      case 'DRAG_END': {
        dragging = false;
        break;
      }

      case 'RESIZE': {
        if (!resizable || state !== 'normal') break;
        const clamped = clampSize(event.width, event.height);
        size = clamped;
        break;
      }

      case 'SET_POSITION': {
        if (state === 'maximized') break;
        position = { x: event.x, y: event.y };
        break;
      }

      case 'SET_SIZE': {
        if (state !== 'normal') break;
        const clamped = clampSize(event.width, event.height);
        size = clamped;
        break;
      }

      case 'MINIMIZE': {
        if (state === 'normal') {
          restorePosition = { ...position };
          restoreSize = { ...size };
        }
        state = 'minimized';
        break;
      }

      case 'MAXIMIZE': {
        if (state === 'normal') {
          restorePosition = { ...position };
          restoreSize = { ...size };
        }
        state = 'maximized';
        position = { x: 0, y: 0 };
        size = { width: event.containerWidth, height: event.containerHeight };
        break;
      }

      case 'RESTORE': {
        if (state === 'minimized' || state === 'maximized') {
          state = 'normal';
          position = { ...restorePosition };
          size = { ...restoreSize };
        }
        break;
      }

      case 'SET_Z_INDEX': {
        zIndex = event.value;
        break;
      }

      case 'FOCUS': {
        // z-index artışı React tarafında yönetilir
        break;
      }
    }
  }

  return {
    getPosition: () => ({ ...position }),
    getSize: () => ({ ...size }),
    getState: () => state,
    getZIndex: () => zIndex,
    isDragging: () => dragging,
    isDraggable: () => draggable,
    isResizable: () => resizable,
    send,
  };
}
