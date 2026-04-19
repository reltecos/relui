/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createFunnelChart, type FunnelChartAPI, type FunnelLayer } from '@relteco/relui-core';

export interface UseFunnelChartProps {
  layers?: FunnelLayer[];
  width?: number;
  height?: number;
  padding?: number;
}

export type UseFunnelChartReturn = ReturnType<FunnelChartAPI['getContext']> & { api: FunnelChartAPI };

export function useFunnelChart(props: UseFunnelChartProps = {}): UseFunnelChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<FunnelChartAPI | null>(null);
  const prevRef = useRef<UseFunnelChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createFunnelChart({ layers: props.layers, width: props.width, height: props.height, padding: props.padding });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.layers !== props.layers && props.layers) {
      api.send({ type: 'SET_LAYERS', layers: props.layers });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}
