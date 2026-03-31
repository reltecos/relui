/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback, useMemo } from 'react';
import { createPivotTable, computePivot } from '@relteco/relui-core';
import type { PivotTableConfig, PivotTableContext, PivotTableEvent, PivotTableAPI, PivotResult } from '@relteco/relui-core';

export interface UsePivotTableProps extends PivotTableConfig {
  /** Ham veri / Raw data */
  data: Record<string, string | number>[];
}

export interface UsePivotTableReturn {
  context: PivotTableContext;
  result: PivotResult;
  send: (event: PivotTableEvent) => void;
  api: PivotTableAPI;
}

export function usePivotTable(props: UsePivotTableProps): UsePivotTableReturn {
  const { data, ...coreConfig } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<PivotTableAPI | null>(null);
  const prevRef = useRef<UsePivotTableProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createPivotTable(coreConfig);
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const send = useCallback(
    (event: PivotTableEvent) => { api.send(event); },
    [api],
  );

  const context = api.getContext();

  const result = useMemo(
    () => computePivot(data, context.placement),
    [data, context.placement],
  );

  return { context, result, send, api };
}
