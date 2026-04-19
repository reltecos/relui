/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createRadarChart, type RadarChartAPI, type RadarAxis, type RadarSeries } from '@relteco/relui-core';

export interface UseRadarChartProps {
  axes?: RadarAxis[];
  series?: RadarSeries[];
  gridLevels?: number;
  size?: number;
  padding?: number;
}

export type UseRadarChartReturn = ReturnType<RadarChartAPI['getContext']> & { api: RadarChartAPI };

export function useRadarChart(props: UseRadarChartProps = {}): UseRadarChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<RadarChartAPI | null>(null);
  const prevRef = useRef<UseRadarChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createRadarChart({
      axes: props.axes, series: props.series, gridLevels: props.gridLevels,
      size: props.size, padding: props.padding,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if ((prev.axes !== props.axes || prev.series !== props.series) && props.axes && props.series) {
      api.send({ type: 'SET_DATA', axes: props.axes, series: props.series });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
