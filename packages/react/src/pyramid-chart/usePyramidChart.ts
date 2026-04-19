/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createPyramidChart } from '@relteco/relui-core';
import type { PyramidChartConfig, PyramidChartContext, PyramidChartEvent, PyramidChartAPI } from '@relteco/relui-core';

export type UsePyramidChartProps = PyramidChartConfig;
export interface UsePyramidChartReturn { context: PyramidChartContext; send: (e: PyramidChartEvent) => void; api: PyramidChartAPI }

export function usePyramidChart(props: UsePyramidChartProps): UsePyramidChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<PyramidChartAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createPyramidChart(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: PyramidChartEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}
