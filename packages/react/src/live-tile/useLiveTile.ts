/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useLiveTile — LiveTile React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createLiveTile,
  type LiveTileConfig,
  type LiveTileAPI,
  type LiveTileAnimationType,
  type LiveTileDirection,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseLiveTileProps extends LiveTileConfig {
  /** Otomatik gecis suresi (ms) / Auto-advance interval (ms) */
  interval?: number;
  /** Animasyon tipi / Animation type */
  animation?: LiveTileAnimationType;
  /** Duraklatildi mi / Is paused (controlled) */
  paused?: boolean;
}

// ── Hook Return ─────────────────────────────────────

export interface UseLiveTileReturn {
  /** Aktif face indexi / Active face index */
  activeIndex: number;
  /** Toplam face sayisi / Total face count */
  faceCount: number;
  /** Duraklatildi mi / Is paused */
  paused: boolean;
  /** Son gecis yonu / Last transition direction */
  direction: LiveTileDirection;
  /** Animasyon tipi / Animation type */
  animation: LiveTileAnimationType;
  /** Sonraki face / Next face */
  next: () => void;
  /** Onceki face / Previous face */
  prev: () => void;
  /** Belirli face e git / Go to specific face */
  goto: (index: number) => void;
  /** Duraklat / Pause */
  pause: () => void;
  /** Devam ettir / Resume */
  resume: () => void;
  /** Core API / Core API */
  api: LiveTileAPI;
}

/**
 * useLiveTile — LiveTile yonetim hook.
 * useLiveTile — LiveTile management hook.
 */
export function useLiveTile(props: UseLiveTileProps = {}): UseLiveTileReturn {
  const {
    interval = 3000,
    animation = 'slide',
  } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<LiveTileAPI | null>(null);
  const prevRef = useRef<UseLiveTileProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createLiveTile({
      faceCount: props.faceCount,
      defaultIndex: props.defaultIndex,
      loop: props.loop,
      onChange: props.onChange,
    });
    // Initial paused state
    if (props.paused) {
      apiRef.current.send({ type: 'PAUSE' });
    }
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }

    if (prev.paused !== props.paused && props.paused !== undefined) {
      api.send({ type: props.paused ? 'PAUSE' : 'RESUME' });
      forceRender();
    }
    if (prev.faceCount !== props.faceCount && props.faceCount !== undefined) {
      api.send({ type: 'SET_FACE_COUNT', count: props.faceCount });
      forceRender();
    }

    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  // ── Auto-advance interval ──
  useEffect(() => {
    const ctx = api.getContext();
    if (ctx.paused || interval <= 0 || ctx.faceCount <= 1) return;

    const timer = setInterval(() => {
      api.send({ type: 'NEXT' });
    }, interval);

    return () => clearInterval(timer);
  }, [api, interval, api.getContext().paused, api.getContext().faceCount]);

  const ctx = api.getContext();

  const next = useCallback(() => api.send({ type: 'NEXT' }), [api]);
  const prev = useCallback(() => api.send({ type: 'PREV' }), [api]);
  const goto = useCallback((index: number) => api.send({ type: 'GOTO', index }), [api]);
  const pause = useCallback(() => api.send({ type: 'PAUSE' }), [api]);
  const resume = useCallback(() => api.send({ type: 'RESUME' }), [api]);

  return {
    activeIndex: ctx.activeIndex,
    faceCount: ctx.faceCount,
    paused: ctx.paused,
    direction: ctx.direction,
    animation,
    next,
    prev,
    goto,
    pause,
    resume,
    api,
  };
}
