/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createLottieAnimation, type LottieAnimationConfig, type LottieAnimationAPI, type LottieData } from '@relteco/relui-core';

export type UseLottieAnimationProps = LottieAnimationConfig;

export interface UseLottieAnimationReturn {
  playing: boolean;
  currentFrame: number;
  totalFrames: number;
  speed: number;
  loop: boolean;
  data: LottieData | null;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setFrame: (frame: number) => void;
  setSpeed: (speed: number) => void;
  toggleLoop: () => void;
  setData: (data: LottieData) => void;
  api: LottieAnimationAPI;
}

export function useLottieAnimation(props: UseLottieAnimationProps = {}): UseLottieAnimationReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<LottieAnimationAPI | null>(null);

  if (apiRef.current === null) { apiRef.current = createLottieAnimation(props); }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  // Auto-advance when playing
  useEffect(() => {
    const ctx = api.getContext();
    if (!ctx.playing || !ctx.data) return;
    const interval = 1000 / (ctx.data.frameRate * ctx.speed);
    const timer = setInterval(() => {
      const c = api.getContext();
      if (!c.playing) return;
      const next = c.currentFrame + 1;
      if (next >= c.totalFrames) {
        if (c.loop) { api.send({ type: 'SET_FRAME', frame: 0 }); }
        else { api.send({ type: 'PAUSE' }); }
      } else {
        api.send({ type: 'SET_FRAME', frame: next });
      }
    }, interval);
    return () => clearInterval(timer);
  }, [api, api.getContext().playing, api.getContext().speed, api.getContext().data]);

  const ctx = api.getContext();

  return {
    ...ctx,
    play: useCallback(() => api.send({ type: 'PLAY' }), [api]),
    pause: useCallback(() => api.send({ type: 'PAUSE' }), [api]),
    stop: useCallback(() => api.send({ type: 'STOP' }), [api]),
    setFrame: useCallback((f: number) => api.send({ type: 'SET_FRAME', frame: f }), [api]),
    setSpeed: useCallback((s: number) => api.send({ type: 'SET_SPEED', speed: s }), [api]),
    toggleLoop: useCallback(() => api.send({ type: 'TOGGLE_LOOP' }), [api]),
    setData: useCallback((d: LottieData) => api.send({ type: 'SET_DATA', data: d }), [api]),
    api,
  };
}
