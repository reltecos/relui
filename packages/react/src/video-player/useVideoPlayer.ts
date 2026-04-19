/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createVideoPlayer, type VideoPlayerConfig, type VideoPlayerAPI, type PlaybackSpeed } from '@relteco/relui-core';

export type UseVideoPlayerProps = VideoPlayerConfig;

export type UseVideoPlayerReturn = ReturnType<VideoPlayerAPI['getContext']> & {
  play: () => void; pause: () => void; toggle: () => void;
  seek: (t: number) => void; setVolume: (v: number) => void; toggleMute: () => void;
  setSpeed: (s: PlaybackSpeed) => void; setFullscreen: (f: boolean) => void;
  timeUpdate: (currentTime: number, duration: number, buffered: number) => void;
  loaded: (duration: number) => void;
  api: VideoPlayerAPI;
};

export function useVideoPlayer(props: UseVideoPlayerProps = {}): UseVideoPlayerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<VideoPlayerAPI | null>(null);

  if (apiRef.current === null) { apiRef.current = createVideoPlayer(props); }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();
  return {
    ...ctx, api,
    play: useCallback(() => api.send({ type: 'PLAY' }), [api]),
    pause: useCallback(() => api.send({ type: 'PAUSE' }), [api]),
    toggle: useCallback(() => api.send({ type: 'TOGGLE' }), [api]),
    seek: useCallback((t: number) => api.send({ type: 'SEEK', time: t }), [api]),
    setVolume: useCallback((v: number) => api.send({ type: 'SET_VOLUME', volume: v }), [api]),
    toggleMute: useCallback(() => api.send({ type: 'TOGGLE_MUTE' }), [api]),
    setSpeed: useCallback((s: PlaybackSpeed) => api.send({ type: 'SET_SPEED', speed: s }), [api]),
    setFullscreen: useCallback((f: boolean) => api.send({ type: 'SET_FULLSCREEN', fullscreen: f }), [api]),
    timeUpdate: useCallback((ct: number, d: number, b: number) => api.send({ type: 'TIME_UPDATE', currentTime: ct, duration: d, buffered: b }), [api]),
    loaded: useCallback((d: number) => api.send({ type: 'LOADED', duration: d }), [api]),
  };
}
