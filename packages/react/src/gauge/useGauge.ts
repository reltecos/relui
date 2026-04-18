/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useGauge — Gauge React hook.
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createGauge, type GaugeConfig, type GaugeAPI } from '@relteco/relui-core';

export interface UseGaugeProps {
  value?: number;
  min?: number;
  max?: number;
  startAngle?: number;
  endAngle?: number;
  segments?: GaugeConfig['segments'];
  onChange?: (value: number) => void;
}

export type UseGaugeReturn = ReturnType<GaugeAPI['getContext']> & {
  setValue: (v: number) => void;
  api: GaugeAPI;
};

export function useGauge(props: UseGaugeProps = {}): UseGaugeReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<GaugeAPI | null>(null);
  const prevRef = useRef<UseGaugeProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createGauge({
      value: props.value, min: props.min, max: props.max,
      startAngle: props.startAngle, endAngle: props.endAngle,
      segments: props.segments, onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_VALUE', value: props.value });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();
  const setValue = useCallback((v: number) => api.send({ type: 'SET_VALUE', value: v }), [api]);

  return { ...ctx, setValue, api };
}
