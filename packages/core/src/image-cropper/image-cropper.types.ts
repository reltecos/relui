/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Aspect ratio tanimi / Aspect ratio definition */
export type CropAspectRatio = '1:1' | '4:3' | '16:9' | 'free';

/** Crop alani / Crop area */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** ImageCropper event tipleri / ImageCropper event types */
export type ImageCropperEvent =
  | { type: 'SET_CROP'; crop: CropArea }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_ROTATION'; rotation: number }
  | { type: 'SET_ASPECT_RATIO'; aspectRatio: CropAspectRatio }
  | { type: 'RESET' };

/** ImageCropper context / ImageCropper context */
export interface ImageCropperContext {
  readonly crop: CropArea;
  readonly zoom: number;
  readonly rotation: number;
  readonly aspectRatio: CropAspectRatio;
}

/** ImageCropper yapilandirma / ImageCropper config */
export interface ImageCropperConfig {
  /** Baslangic aspect ratio / Default aspect ratio */
  defaultAspectRatio?: CropAspectRatio;
  /** Baslangic zoom / Default zoom */
  defaultZoom?: number;
  /** Crop degisince / On crop change */
  onCropChange?: (crop: CropArea) => void;
}

/** ImageCropper API / ImageCropper API */
export interface ImageCropperAPI {
  getContext(): ImageCropperContext;
  send(event: ImageCropperEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
