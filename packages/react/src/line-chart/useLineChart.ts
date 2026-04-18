/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createLineChart, type LineChartConfig, type LineChartAPI, type LineSeries } from '@relteco/relui-core';

export interface UseLineChartProps {
  series?: LineSeries[];
  width?: number;
  height?: number;
  margin?: LineChartConfig['margin'];
}

export type UseLineChartReturn = ReturnType<LineChartAPI['getContext']> & { api: LineChartAPI };

export function useLineChart(props: UseLineChartProps = {}): UseLineChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<LineChartAPI | null>(null);
  const prevRef = useRef<UseLineChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createLineChart({ series: props.series, width: props.width, height: props.height, margin: props.margin });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.series !== props.series && props.series !== undefined) {
      api.send({ type: 'SET_SERIES', series: props.series }); forceRender();
    }
    if ((prev.width !== props.width || prev.height !== props.height) && props.width !== undefined && props.height !== undefined) {
      api.send({ type: 'SET_SIZE', width: props.width, height: props.height }); forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
