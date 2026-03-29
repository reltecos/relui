/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useDigitalGauge — DigitalGauge React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect } from 'react';
import {
  createDigitalGauge,
  type DigitalGaugeConfig,
  type DigitalGaugeAPI,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseDigitalGaugeProps extends DigitalGaugeConfig {
  /** Controlled deger / Controlled value */
  value?: number;
}

// ── Hook Return ─────────────────────────────────────

export interface UseDigitalGaugeReturn {
  /** Guncel deger / Current value */
  value: number;
  /** Minimum sinir / Minimum bound */
  min: number;
  /** Maksimum sinir / Maximum bound */
  max: number;
  /** Ondalik basamak / Precision */
  precision: number;
  /** Formatlanmis deger / Formatted value */
  formattedValue: string;
  /** Her bir hane / Individual digits */
  digits: string[];
  /** Deger ayarla / Set value */
  setValue: (v: number) => void;
  /** Sifirla / Reset */
  reset: () => void;
  /** Core API / Core API */
  api: DigitalGaugeAPI;
}

/**
 * useDigitalGauge — DigitalGauge yonetim hook.
 * useDigitalGauge — DigitalGauge management hook.
 */
export function useDigitalGauge(props: UseDigitalGaugeProps = {}): UseDigitalGaugeReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<DigitalGaugeAPI | null>(null);
  const prevRef = useRef<UseDigitalGaugeProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createDigitalGauge({
      defaultValue: props.value ?? props.defaultValue,
      min: props.min,
      max: props.max,
      precision: props.precision,
      onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }

    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_VALUE', value: props.value });
      forceRender();
    }
    if (prev.min !== props.min && props.min !== undefined) {
      api.send({ type: 'SET_MIN', min: props.min });
      forceRender();
    }
    if (prev.max !== props.max && props.max !== undefined) {
      api.send({ type: 'SET_MAX', max: props.max });
      forceRender();
    }

    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();
  const formattedValue = ctx.value.toFixed(ctx.precision);
  const digits = formattedValue.split('');

  return {
    value: ctx.value,
    min: ctx.min,
    max: ctx.max,
    precision: ctx.precision,
    formattedValue,
    digits,
    setValue: (v: number) => api.send({ type: 'SET_VALUE', value: v }),
    reset: () => api.send({ type: 'RESET' }),
    api,
  };
}
