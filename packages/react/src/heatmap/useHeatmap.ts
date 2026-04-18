/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createHeatmap, type HeatmapConfig, type HeatmapAPI } from '@relteco/relui-core';

export interface UseHeatmapProps {
  data?: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
  lowColor?: string;
  highColor?: string;
}

export type UseHeatmapReturn = ReturnType<HeatmapAPI['getContext']> & { api: HeatmapAPI };

export function useHeatmap(props: UseHeatmapProps = {}): UseHeatmapReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<HeatmapAPI | null>(null);
  const prevRef = useRef<UseHeatmapProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createHeatmap(props as HeatmapConfig);
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.data !== props.data && props.data) { api.send({ type: 'SET_DATA', data: props.data }); forceRender(); }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
