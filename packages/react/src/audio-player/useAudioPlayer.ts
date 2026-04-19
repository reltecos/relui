/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createAudioPlayer, type AudioPlayerConfig, type AudioPlayerAPI } from '@relteco/relui-core';

export type UseAudioPlayerProps = AudioPlayerConfig;
export type UseAudioPlayerReturn = ReturnType<AudioPlayerAPI['getContext']> & {
  play: () => void; pause: () => void; toggle: () => void; seek: (t: number) => void;
  setVolume: (v: number) => void; toggleMute: () => void; nextTrack: () => void; prevTrack: () => void;
  setTrack: (id: string) => void; timeUpdate: (ct: number, d: number) => void; loaded: (d: number) => void;
  api: AudioPlayerAPI;
};

export function useAudioPlayer(props: UseAudioPlayerProps = {}): UseAudioPlayerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<AudioPlayerAPI | null>(null);
  if (apiRef.current === null) apiRef.current = createAudioPlayer(props);
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
    nextTrack: useCallback(() => api.send({ type: 'NEXT_TRACK' }), [api]),
    prevTrack: useCallback(() => api.send({ type: 'PREV_TRACK' }), [api]),
    setTrack: useCallback((id: string) => api.send({ type: 'SET_TRACK', trackId: id }), [api]),
    timeUpdate: useCallback((ct: number, d: number) => api.send({ type: 'TIME_UPDATE', currentTime: ct, duration: d }), [api]),
    loaded: useCallback((d: number) => api.send({ type: 'LOADED', duration: d }), [api]),
  };
}
