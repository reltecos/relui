/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';

export type ImageEvent =
  | { type: 'START_LOAD' }
  | { type: 'LOAD_SUCCESS' }
  | { type: 'LOAD_ERROR' }
  | { type: 'OPEN_LIGHTBOX' }
  | { type: 'CLOSE_LIGHTBOX' };

export interface ImageContext {
  readonly loadState: ImageLoadState;
  readonly lightboxOpen: boolean;
}

export interface ImageConfig {
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export interface ImageAPI {
  getContext(): ImageContext;
  send(event: ImageEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
