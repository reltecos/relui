/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ImageConfig, ImageContext, ImageEvent, ImageAPI, ImageLoadState } from './image.types';

export function createImage(config: ImageConfig = {}): ImageAPI {
  let loadState: ImageLoadState = config.lazy ? 'idle' : 'loading';
  let lightboxOpen = false;
  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  return {
    getContext(): ImageContext { return { loadState, lightboxOpen }; },
    send(event: ImageEvent) {
      switch (event.type) {
        case 'START_LOAD': loadState = 'loading'; notify(); break;
        case 'LOAD_SUCCESS': loadState = 'loaded'; config.onLoad?.(); notify(); break;
        case 'LOAD_ERROR': loadState = 'error'; config.onError?.(); notify(); break;
        case 'OPEN_LIGHTBOX': lightboxOpen = true; notify(); break;
        case 'CLOSE_LIGHTBOX': if (!lightboxOpen) return; lightboxOpen = false; notify(); break;
      }
    },
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    destroy() { listeners.clear(); },
  };
}
