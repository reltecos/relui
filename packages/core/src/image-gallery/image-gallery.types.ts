/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface GalleryImageDef { id: string; src: string; alt?: string; thumbnail?: string }

export type ImageGalleryEvent =
  | { type: 'SELECT'; index: number }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'OPEN_LIGHTBOX'; index: number }
  | { type: 'CLOSE_LIGHTBOX' };

export interface ImageGalleryContext {
  readonly activeIndex: number;
  readonly lightboxOpen: boolean;
  readonly totalImages: number;
}

export interface ImageGalleryConfig { images: GalleryImageDef[]; defaultIndex?: number; onIndexChange?: (index: number) => void }
export interface ImageGalleryAPI {
  getContext(): ImageGalleryContext;
  send(event: ImageGalleryEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
