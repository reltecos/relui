/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  WebcamState,
  FacingMode,
  WebcamCaptureConfig,
  WebcamCaptureContext,
  WebcamCaptureEvent,
  WebcamCaptureAPI,
} from './webcam-capture.types';

export function createWebcamCapture(config: WebcamCaptureConfig = {}): WebcamCaptureAPI {
  const { defaultFacingMode = 'user', defaultMirror = true, onPhoto, onVideo, onError } = config;

  let state: WebcamState = 'idle';
  let mirror = defaultMirror;
  let facingMode: FacingMode = defaultFacingMode;
  let lastPhotoUrl: string | null = null;
  let lastVideoUrl: string | null = null;
  let recording = false;
  let error: string | null = null;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: WebcamCaptureEvent): void {
    switch (event.type) {
      case 'START': {
        if (state === 'active' || state === 'requesting') return;
        state = 'requesting';
        error = null;
        notify();
        break;
      }
      case 'STARTED': {
        state = 'active';
        error = null;
        notify();
        break;
      }
      case 'STOP': {
        state = 'idle';
        recording = false;
        notify();
        break;
      }
      case 'ERROR': {
        state = 'error';
        error = event.message;
        onError?.(event.message);
        notify();
        break;
      }
      case 'CAPTURE_PHOTO': {
        if (state !== 'active') return;
        lastPhotoUrl = event.dataUrl;
        onPhoto?.(event.dataUrl);
        notify();
        break;
      }
      case 'START_RECORDING': {
        if (state !== 'active' || recording) return;
        recording = true;
        notify();
        break;
      }
      case 'STOP_RECORDING': {
        if (!recording) return;
        recording = false;
        lastVideoUrl = event.blobUrl;
        onVideo?.(event.blobUrl);
        notify();
        break;
      }
      case 'SET_FACING': {
        if (facingMode === event.facingMode) return;
        facingMode = event.facingMode;
        notify();
        break;
      }
      case 'SET_MIRROR': {
        if (mirror === event.mirror) return;
        mirror = event.mirror;
        notify();
        break;
      }
    }
  }

  return {
    getContext(): WebcamCaptureContext {
      return { state, mirror, facingMode, lastPhotoUrl, recording, lastVideoUrl, error };
    },
    send,
    subscribe(cb: () => void): () => void {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    destroy(): void { listeners.clear(); },
  };
}
