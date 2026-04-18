/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSparkline — Sparkline React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect } from 'react';
import {
  createSparkline,
  type SparklineConfig,
  type SparklineAPI,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseSparklineProps {
  /** Veri / Data */
  data?: number[];
  /** Genislik / Width */
  width?: number;
  /** Yukseklik / Height */
  height?: number;
}

// ── Hook Return ─────────────────────────────────────

export type UseSparklineReturn = ReturnType<SparklineAPI['getContext']> & {
  /** Core API */
  api: SparklineAPI;
};

/**
 * useSparkline — Sparkline yonetim hook.
 * useSparkline — Sparkline management hook.
 */
export function useSparkline(props: UseSparklineProps = {}): UseSparklineReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<SparklineAPI | null>(null);
  const prevRef = useRef<UseSparklineProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: SparklineConfig = {
      data: props.data,
      width: props.width,
      height: props.height,
    };
    apiRef.current = createSparkline(cfg);
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.data !== props.data && props.data !== undefined) {
      api.send({ type: 'SET_DATA', data: props.data });
      forceRender();
    }
    if ((prev.width !== props.width || prev.height !== props.height) &&
        props.width !== undefined && props.height !== undefined) {
      api.send({ type: 'SET_SIZE', width: props.width, height: props.height });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();
  return { ...ctx, api };
}
