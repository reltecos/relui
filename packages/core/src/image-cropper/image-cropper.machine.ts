/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  ImageCropperConfig, ImageCropperContext, ImageCropperEvent,
  ImageCropperAPI, CropArea, CropAspectRatio,
} from './image-cropper.types';

const ASPECT_RATIOS: Record<CropAspectRatio, number | null> = {
  '1:1': 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  'free': null,
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function createImageCropper(config: ImageCropperConfig = {}): ImageCropperAPI {
  const {
    defaultAspectRatio = 'free',
    defaultZoom = 1,
    onCropChange,
  } = config;

  let crop: CropArea = { x: 0, y: 0, width: 100, height: 100 };
  let zoom = clamp(defaultZoom, 0.1, 5);
  let rotation = 0;
  let aspectRatio: CropAspectRatio = defaultAspectRatio;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getContext(): ImageCropperContext {
    return { crop, zoom, rotation, aspectRatio };
  }

  function send(event: ImageCropperEvent): void {
    switch (event.type) {
      case 'SET_CROP': {
        crop = { ...event.crop };
        onCropChange?.(crop);
        notify();
        break;
      }
      case 'SET_ZOOM': {
        zoom = clamp(event.zoom, 0.1, 5);
        notify();
        break;
      }
      case 'SET_ROTATION': {
        rotation = ((event.rotation % 360) + 360) % 360;
        notify();
        break;
      }
      case 'SET_ASPECT_RATIO': {
        aspectRatio = event.aspectRatio;
        const ratio = ASPECT_RATIOS[aspectRatio];
        if (ratio !== null) {
          crop = { ...crop, height: crop.width / ratio };
        }
        notify();
        break;
      }
      case 'RESET': {
        crop = { x: 0, y: 0, width: 100, height: 100 };
        zoom = 1;
        rotation = 0;
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
