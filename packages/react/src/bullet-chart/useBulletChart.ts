/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createBulletChart } from '@relteco/relui-core';
import type { BulletChartConfig, BulletChartContext, BulletChartEvent, BulletChartAPI } from '@relteco/relui-core';

export type UseBulletChartProps = BulletChartConfig;
export interface UseBulletChartReturn { context: BulletChartContext; send: (e: BulletChartEvent) => void; api: BulletChartAPI }

export function useBulletChart(props: UseBulletChartProps): UseBulletChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<BulletChartAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createBulletChart(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: BulletChartEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}
