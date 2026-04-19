/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createBoxPlotChart } from '@relteco/relui-core';
import type { BoxPlotChartConfig, BoxPlotChartContext, BoxPlotChartEvent, BoxPlotChartAPI } from '@relteco/relui-core';

export type UseBoxPlotChartProps = BoxPlotChartConfig;
export interface UseBoxPlotChartReturn { context: BoxPlotChartContext; send: (e: BoxPlotChartEvent) => void; api: BoxPlotChartAPI }

export function useBoxPlotChart(props: UseBoxPlotChartProps): UseBoxPlotChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<BoxPlotChartAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createBoxPlotChart(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: BoxPlotChartEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}
