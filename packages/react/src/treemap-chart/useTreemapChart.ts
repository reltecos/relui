/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createTreemapChart, type TreemapChartAPI, type TreemapNode } from '@relteco/relui-core';

export interface UseTreemapChartProps {
  data?: TreemapNode[];
  width?: number;
  height?: number;
  padding?: number;
}

export type UseTreemapChartReturn = ReturnType<TreemapChartAPI['getContext']> & { api: TreemapChartAPI };

export function useTreemapChart(props: UseTreemapChartProps = {}): UseTreemapChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<TreemapChartAPI | null>(null);
  const prevRef = useRef<UseTreemapChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createTreemapChart({
      data: props.data, width: props.width, height: props.height, padding: props.padding,
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
