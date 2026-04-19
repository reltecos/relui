/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ImageGalleryConfig, ImageGalleryContext, ImageGalleryEvent, ImageGalleryAPI } from './image-gallery.types';

export function createImageGallery(config: ImageGalleryConfig): ImageGalleryAPI {
  const { images, defaultIndex = 0, onIndexChange } = config;
  let activeIndex = Math.min(defaultIndex, images.length - 1);
  let lightboxOpen = false;
  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  return {
    getContext(): ImageGalleryContext { return { activeIndex, lightboxOpen, totalImages: images.length }; },
    send(event: ImageGalleryEvent) {
      switch (event.type) {
        case 'SELECT': if (event.index < 0 || event.index >= images.length || event.index === activeIndex) return; activeIndex = event.index; onIndexChange?.(activeIndex); notify(); break;
        case 'NEXT': if (activeIndex >= images.length - 1) return; activeIndex++; onIndexChange?.(activeIndex); notify(); break;
        case 'PREV': if (activeIndex <= 0) return; activeIndex--; onIndexChange?.(activeIndex); notify(); break;
        case 'OPEN_LIGHTBOX': activeIndex = event.index; lightboxOpen = true; notify(); break;
        case 'CLOSE_LIGHTBOX': if (!lightboxOpen) return; lightboxOpen = false; notify(); break;
      }
    },
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    destroy() { listeners.clear(); },
  };
}
