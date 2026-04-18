/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SignaturePad state machine — dijital imza yonetimi.
 * SignaturePad state machine — digital signature management.
 *
 * @packageDocumentation
 */

import type {
  SignaturePadConfig,
  SignaturePadContext,
  SignaturePadEvent,
  SignaturePadAPI,
  SignaturePath,
  SignaturePoint,
} from './signature-pad.types';

export function createSignaturePad(config: SignaturePadConfig = {}): SignaturePadAPI {
  const {
    defaultStrokeWidth = 2,
    defaultStrokeColor = '#000000',
    onChange,
  } = config;

  let paths: SignaturePath[] = [];
  let currentPath: SignaturePath | null = null;
  let strokeWidth = defaultStrokeWidth;
  let strokeColor = defaultStrokeColor;

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getContext(): SignaturePadContext {
    return {
      paths: [...paths],
      currentPath,
      strokeWidth,
      strokeColor,
      canUndo: paths.length > 0,
      isEmpty: paths.length === 0 && currentPath === null,
    };
  }

  function send(event: SignaturePadEvent): void {
    switch (event.type) {
      case 'DRAW_START': {
        const point: SignaturePoint = { x: event.x, y: event.y, pressure: event.pressure ?? 0.5 };
        currentPath = { points: [point], strokeWidth, strokeColor };
        notify();
        break;
      }
      case 'DRAW_MOVE': {
        if (!currentPath) return;
        const point: SignaturePoint = { x: event.x, y: event.y, pressure: event.pressure ?? 0.5 };
        currentPath = {
          ...currentPath,
          points: [...currentPath.points, point],
        };
        notify();
        break;
      }
      case 'DRAW_END': {
        if (!currentPath) return;
        if (currentPath.points.length > 0) {
          paths = [...paths, currentPath];
          onChange?.(paths);
        }
        currentPath = null;
        notify();
        break;
      }
      case 'UNDO': {
        if (paths.length === 0) return;
        paths = paths.slice(0, -1);
        onChange?.(paths);
        notify();
        break;
      }
      case 'CLEAR': {
        if (paths.length === 0 && currentPath === null) return;
        paths = [];
        currentPath = null;
        onChange?.(paths);
        notify();
        break;
      }
      case 'SET_STROKE_WIDTH': {
        strokeWidth = event.width;
        notify();
        break;
      }
      case 'SET_STROKE_COLOR': {
        strokeColor = event.color;
        notify();
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
