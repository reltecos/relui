/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createSunburstChart, type SunburstChartAPI, type SunburstNode } from '@relteco/relui-core';

export interface UseSunburstChartProps {
  data?: SunburstNode[];
  size?: number;
  innerRadius?: number;
  maxDepth?: number;
}

export type UseSunburstChartReturn = ReturnType<SunburstChartAPI['getContext']> & { api: SunburstChartAPI };

export function useSunburstChart(props: UseSunburstChartProps = {}): UseSunburstChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<SunburstChartAPI | null>(null);
  const prevRef = useRef<UseSunburstChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createSunburstChart({
      data: props.data, size: props.size, innerRadius: props.innerRadius, maxDepth: props.maxDepth,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.data !== props.data && props.data) {
      api.send({ type: 'SET_DATA', data: props.data });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
