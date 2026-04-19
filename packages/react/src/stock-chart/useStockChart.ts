/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createStockChart, type StockChartAPI, type StockDataPoint } from '@relteco/relui-core';

export interface UseStockChartProps {
  data?: StockDataPoint[];
  width?: number;
  height?: number;
  volumeHeight?: number;
  padding?: number;
  bullishColor?: string;
  bearishColor?: string;
}

export type UseStockChartReturn = ReturnType<StockChartAPI['getContext']> & { api: StockChartAPI };

export function useStockChart(props: UseStockChartProps = {}): UseStockChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<StockChartAPI | null>(null);
  const prevRef = useRef<UseStockChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createStockChart({
      data: props.data, width: props.width, height: props.height,
      volumeHeight: props.volumeHeight, padding: props.padding,
      bullishColor: props.bullishColor, bearishColor: props.bearishColor,
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
