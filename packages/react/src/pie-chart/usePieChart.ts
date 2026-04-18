/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createPieChart, type PieChartAPI, type PieSliceDef } from '@relteco/relui-core';

export interface UsePieChartProps {
  slices?: PieSliceDef[];
  donut?: boolean;
  innerRadius?: number;
}

export type UsePieChartReturn = ReturnType<PieChartAPI['getContext']> & { api: PieChartAPI };

export function usePieChart(props: UsePieChartProps = {}): UsePieChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<PieChartAPI | null>(null);
  const prevRef = useRef<UsePieChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createPieChart({ slices: props.slices, donut: props.donut, innerRadius: props.innerRadius });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.slices !== props.slices && props.slices !== undefined) {
      api.send({ type: 'SET_SLICES', slices: props.slices });
      forceRender();
    }
    if (prev.donut !== props.donut && props.donut !== undefined) {
      api.send({ type: 'SET_DONUT', donut: props.donut });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
