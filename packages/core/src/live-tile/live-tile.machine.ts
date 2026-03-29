/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LiveTile state machine.
 *
 * @packageDocumentation
 */

import type {
  LiveTileConfig,
  LiveTileContext,
  LiveTileEvent,
  LiveTileDirection,
  LiveTileAPI,
} from './live-tile.types';

/**
 * LiveTile state machine olusturur.
 * Creates a LiveTile state machine.
 */
export function createLiveTile(config: LiveTileConfig = {}): LiveTileAPI {
  const {
    faceCount: initFaceCount = 2,
    defaultIndex = 0,
    loop = true,
    onChange,
  } = config;

  // ── State ──
  let faceCount = Math.max(1, initFaceCount);
  let activeIndex = clampIndex(defaultIndex, faceCount);
  let paused = false;
  let direction: LiveTileDirection = 'next';

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    onChange?.(activeIndex);
    listeners.forEach((fn) => fn());
  }

  function clampIndex(idx: number, count: number): number {
    if (count <= 0) return 0;
    return Math.min(Math.max(0, idx), count - 1);
  }

  // ── Send ──
  function send(event: LiveTileEvent): void {
    switch (event.type) {
      case 'NEXT': {
        const next = activeIndex + 1;
        if (next >= faceCount) {
          if (loop) {
            activeIndex = 0;
          } else {
            return;
          }
        } else {
          activeIndex = next;
        }
        direction = 'next';
        notify();
        break;
      }
      case 'PREV': {
        const prev = activeIndex - 1;
        if (prev < 0) {
          if (loop) {
            activeIndex = faceCount - 1;
          } else {
            return;
          }
        } else {
          activeIndex = prev;
        }
        direction = 'prev';
        notify();
        break;
      }
      case 'GOTO': {
        const idx = clampIndex(event.index, faceCount);
        if (idx === activeIndex) return;
        direction = idx > activeIndex ? 'next' : 'prev';
        activeIndex = idx;
        notify();
        break;
      }
      case 'PAUSE': {
        if (paused) return;
        paused = true;
        notify();
        break;
      }
      case 'RESUME': {
        if (!paused) return;
        paused = false;
        notify();
        break;
      }
      case 'SET_FACE_COUNT': {
        const count = Math.max(1, event.count);
        if (count === faceCount) return;
        faceCount = count;
        activeIndex = clampIndex(activeIndex, faceCount);
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): LiveTileContext {
      return { activeIndex, faceCount, paused, direction };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
