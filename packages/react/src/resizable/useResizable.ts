/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useResizable — React hook for resizable element state machine.
 *
 * Core state machine'i React lifecycle'a bağlar.
 * Pointer drag, min/max sınırlar, yön kontrolleri.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { createResizable } from '@relteco/relui-core';
import type {
  ResizeDirection,
  ResizableAPI,
} from '@relteco/relui-core';

/** useResizable hook props. */
export interface UseResizableProps {
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
  /** İzin verilen yönler. */
  directions?: ResizeDirection[];
  /** Devre dışı mı. */
  disabled?: boolean;
  /** Boyut değiştiğinde çağrılır. */
  onResize?: (size: { width: number; height: number }) => void;
  /** Boyutlandırma bittiğinde çağrılır. */
  onResizeEnd?: (size: { width: number; height: number }) => void;
}

/** useResizable hook dönüş değeri. */
export interface UseResizableReturn {
  /** Root ref. */
  rootRef: React.RefObject<HTMLDivElement | null>;
  /** Core API. */
  api: ResizableAPI;
  /** Mevcut genişlik. */
  width: number;
  /** Mevcut yükseklik. */
  height: number;
  /** Boyutlandırılıyor mu. */
  isResizing: boolean;
  /** Aktif yön. */
  activeDirection: ResizeDirection | null;
  /** Handle pointer down handler. */
  getHandleProps: (direction: ResizeDirection) => {
    onPointerDown: (e: React.PointerEvent) => void;
    style: React.CSSProperties;
    'data-direction': ResizeDirection;
  };
}

/** Yön bazlı cursor map. */
const cursorMap: Record<ResizeDirection, string> = {
  top: 'ns-resize',
  bottom: 'ns-resize',
  left: 'ew-resize',
  right: 'ew-resize',
  topLeft: 'nwse-resize',
  bottomRight: 'nwse-resize',
  topRight: 'nesw-resize',
  bottomLeft: 'nesw-resize',
};

/**
 * Resizable React hook'u.
 */
export function useResizable(props: UseResizableProps = {}): UseResizableReturn {
  const {
    defaultWidth = 200,
    defaultHeight = 200,
    minWidth = 50,
    minHeight = 50,
    maxWidth,
    maxHeight,
    directions,
    disabled = false,
    onResize,
    onResizeEnd,
  } = props;

  const apiRef = useRef<ResizableAPI | null>(null);
  if (apiRef.current === null) {
    apiRef.current = createResizable({
      defaultWidth,
      defaultHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      directions,
      disabled,
    });
  }
  const api = apiRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const onResizeRef = useRef(onResize);
  const onResizeEndRef = useRef(onResizeEnd);
  onResizeRef.current = onResize;
  onResizeEndRef.current = onResizeEnd;

  // ── Prop sync ────────────────────────────────────────

  useEffect(() => {
    api.send({ type: 'SET_DISABLED', value: disabled });
    forceRender();
  }, [api, disabled]);

  // ── Global pointer listeners ──────────────────────────

  useEffect(() => {
    if (!api.isResizing()) return;

    const handlePointerMove = (e: PointerEvent) => {
      api.send({ type: 'RESIZE_MOVE', pointerX: e.clientX, pointerY: e.clientY });
      onResizeRef.current?.(api.getSize());
      forceRender();
    };

    const handlePointerUp = () => {
      api.send({ type: 'RESIZE_END' });
      onResizeEndRef.current?.(api.getSize());
      forceRender();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [api, api.isResizing()]);

  // ── Handle props ──────────────────────────────────────

  const getHandleProps = useCallback(
    (direction: ResizeDirection) => ({
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        api.send({
          type: 'RESIZE_START',
          direction,
          pointerX: e.clientX,
          pointerY: e.clientY,
        });
        forceRender();
      },
      style: { cursor: cursorMap[direction] } as React.CSSProperties,
      'data-direction': direction as ResizeDirection,
    }),
    [api],
  );

  const size = api.getSize();

  return {
    rootRef,
    api,
    width: size.width,
    height: size.height,
    isResizing: api.isResizing(),
    activeDirection: api.getActiveDirection(),
    getHandleProps,
  };
}
