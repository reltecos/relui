/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createWaterfallChart } from '@relteco/relui-core';
import type { WaterfallChartConfig, WaterfallChartContext, WaterfallChartEvent, WaterfallChartAPI } from '@relteco/relui-core';

export type UseWaterfallChartProps = WaterfallChartConfig;
export interface UseWaterfallChartReturn { context: WaterfallChartContext; send: (e: WaterfallChartEvent) => void; api: WaterfallChartAPI }

export function useWaterfallChart(props: UseWaterfallChartProps): UseWaterfallChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<WaterfallChartAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createWaterfallChart(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: WaterfallChartEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}
