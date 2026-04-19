/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createWebcamCapture, type WebcamCaptureConfig, type WebcamCaptureAPI, type FacingMode } from '@relteco/relui-core';

export type UseWebcamCaptureProps = WebcamCaptureConfig;

export interface UseWebcamCaptureReturn {
  state: ReturnType<WebcamCaptureAPI['getContext']>['state'];
  mirror: boolean;
  facingMode: FacingMode;
  lastPhotoUrl: string | null;
  recording: boolean;
  lastVideoUrl: string | null;
  error: string | null;
  start: () => void;
  stop: () => void;
  capturePhoto: (dataUrl: string) => void;
  startRecording: () => void;
  stopRecording: (blobUrl: string) => void;
  setFacing: (mode: FacingMode) => void;
  setMirror: (mirror: boolean) => void;
  onStarted: () => void;
  onError: (msg: string) => void;
  api: WebcamCaptureAPI;
}

export function useWebcamCapture(props: UseWebcamCaptureProps = {}): UseWebcamCaptureReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<WebcamCaptureAPI | null>(null);

  if (apiRef.current === null) { apiRef.current = createWebcamCapture(props); }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    ...ctx,
    start: useCallback(() => api.send({ type: 'START' }), [api]),
    stop: useCallback(() => api.send({ type: 'STOP' }), [api]),
    capturePhoto: useCallback((d: string) => api.send({ type: 'CAPTURE_PHOTO', dataUrl: d }), [api]),
    startRecording: useCallback(() => api.send({ type: 'START_RECORDING' }), [api]),
    stopRecording: useCallback((b: string) => api.send({ type: 'STOP_RECORDING', blobUrl: b }), [api]),
    setFacing: useCallback((m: FacingMode) => api.send({ type: 'SET_FACING', facingMode: m }), [api]),
    setMirror: useCallback((m: boolean) => api.send({ type: 'SET_MIRROR', mirror: m }), [api]),
    onStarted: useCallback(() => api.send({ type: 'STARTED' }), [api]),
    onError: useCallback((msg: string) => api.send({ type: 'ERROR', message: msg }), [api]),
    api,
  };
}
