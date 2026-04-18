/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createSpreadsheet } from '@relteco/relui-core';
import type { SpreadsheetConfig, SpreadsheetContext, SpreadsheetEvent, SpreadsheetAPI, CellData } from '@relteco/relui-core';

export type UseSpreadsheetProps = SpreadsheetConfig;

export interface UseSpreadsheetReturn {
  context: SpreadsheetContext;
  send: (event: SpreadsheetEvent) => void;
  getCellData: (row: number, col: number) => CellData | undefined;
  api: SpreadsheetAPI;
}

export function useSpreadsheet(props: UseSpreadsheetProps): UseSpreadsheetReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<SpreadsheetAPI | null>(null);
  const prevRef = useRef<UseSpreadsheetProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createSpreadsheet(props);
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
    (event: SpreadsheetEvent) => { api.send(event); },
    [api],
  );

  const getCellData = useCallback(
    (row: number, col: number) => api.getCellData(row, col),
    [api],
  );

  return { context: api.getContext(), send, getCellData, api };
}
