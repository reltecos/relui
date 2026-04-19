/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * WebcamCapture tipleri.
 * WebcamCapture types.
 *
 * @packageDocumentation
 */

export type WebcamState = 'idle' | 'requesting' | 'active' | 'error';
export type FacingMode = 'user' | 'environment';

export type WebcamCaptureEvent =
  | { type: 'START' }
  | { type: 'STARTED' }
  | { type: 'STOP' }
  | { type: 'ERROR'; message: string }
  | { type: 'CAPTURE_PHOTO'; dataUrl: string }
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING'; blobUrl: string }
  | { type: 'SET_FACING'; facingMode: FacingMode }
  | { type: 'SET_MIRROR'; mirror: boolean };

export interface WebcamCaptureContext {
  readonly state: WebcamState;
  readonly mirror: boolean;
  readonly facingMode: FacingMode;
  readonly lastPhotoUrl: string | null;
  readonly recording: boolean;
  readonly lastVideoUrl: string | null;
  readonly error: string | null;
}

export interface WebcamCaptureConfig {
  defaultFacingMode?: FacingMode;
  defaultMirror?: boolean;
  onPhoto?: (dataUrl: string) => void;
  onVideo?: (blobUrl: string) => void;
  onError?: (message: string) => void;
}

export interface WebcamCaptureAPI {
  getContext(): WebcamCaptureContext;
  send(event: WebcamCaptureEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
