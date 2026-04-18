/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createBarChart, type BarChartConfig, type BarChartAPI, type BarSeries, type BarChartMode } from '@relteco/relui-core';

export interface UseBarChartProps {
  series?: BarSeries[];
  categories?: string[];
  mode?: BarChartMode;
  orientation?: BarChartConfig['orientation'];
  width?: number;
  height?: number;
}

export type UseBarChartReturn = ReturnType<BarChartAPI['getContext']> & { api: BarChartAPI };

export function useBarChart(props: UseBarChartProps = {}): UseBarChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<BarChartAPI | null>(null);
  const prevRef = useRef<UseBarChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createBarChart({
      series: props.series, categories: props.categories,
      mode: props.mode, orientation: props.orientation,
      width: props.width, height: props.height,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.series !== props.series && props.series) { api.send({ type: 'SET_SERIES', series: props.series }); forceRender(); }
    if (prev.categories !== props.categories && props.categories) { api.send({ type: 'SET_CATEGORIES', categories: props.categories }); forceRender(); }
    if (prev.mode !== props.mode && props.mode) { api.send({ type: 'SET_MODE', mode: props.mode }); forceRender(); }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
