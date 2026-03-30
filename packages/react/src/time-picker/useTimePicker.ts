/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTimePicker — TimePicker React hook.
 * useTimePicker — TimePicker React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Synchronizes core state machine with React state.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createTimePicker,
  type TimePickerConfig,
  type TimePickerAPI,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

/** useTimePicker hook props. */
export interface UseTimePickerProps {
  /** Varsayilan deger ("HH:mm" veya "HH:mm:ss") / Default value */
  defaultValue?: string;
  /** 24 saat formati (varsayilan: false) / 24-hour format (default: false) */
  is24h?: boolean;
  /** Saniye gosterilsin mi (varsayilan: false) / Show seconds (default: false) */
  showSeconds?: boolean;
  /** Dakika adimi (varsayilan: 1) / Minute step (default: 1) */
  step?: number;
  /** Minimum zaman / Minimum time */
  minTime?: string;
  /** Maksimum zaman / Maximum time */
  maxTime?: string;
  /** Deger degistiginde / When value changes */
  onChange?: (value: string | null) => void;
  /** Dropdown acilip kapandiginda / When dropdown opens/closes */
  onOpenChange?: (isOpen: boolean) => void;
}

// ── Hook Return ─────────────────────────────────────

/** useTimePicker hook donus tipi / useTimePicker hook return type. */
export interface UseTimePickerReturn {
  /** Saat (12h: 1-12, 24h: 0-23) / Hours */
  hours: number;
  /** Dakika (0-59) / Minutes */
  minutes: number;
  /** Saniye (0-59) / Seconds */
  seconds: number;
  /** AM/PM gostergesi / AM/PM indicator */
  period: 'AM' | 'PM';
  /** 24 saat formati mi / Is 24-hour format */
  is24h: boolean;
  /** Dropdown acik mi / Is dropdown open */
  isOpen: boolean;
  /** Formatlanmis deger / Formatted value */
  value: string | null;
  /** Saat ayarla / Set hour */
  setHour: (h: number) => void;
  /** Dakika ayarla / Set minute */
  setMinute: (m: number) => void;
  /** Saniye ayarla / Set second */
  setSecond: (s: number) => void;
  /** Period ayarla / Set period */
  setPeriod: (p: 'AM' | 'PM') => void;
  /** Saati artir / Increment hour */
  incrementHour: () => void;
  /** Saati azalt / Decrement hour */
  decrementHour: () => void;
  /** Dakikayi artir / Increment minute */
  incrementMinute: () => void;
  /** Dakikayi azalt / Decrement minute */
  decrementMinute: () => void;
  /** Dropdown ac / Open dropdown */
  open: () => void;
  /** Dropdown kapat / Close dropdown */
  close: () => void;
  /** Dropdown ac/kapat / Toggle dropdown */
  toggle: () => void;
  /** Core API / Core API */
  api: TimePickerAPI;
}

/**
 * useTimePicker — TimePicker yonetim hook.
 * useTimePicker — TimePicker management hook.
 *
 * @example
 * ```tsx
 * const { hours, minutes, isOpen, setHour, toggle } = useTimePicker({
 *   defaultValue: '14:30',
 *   is24h: true,
 *   onChange: (v) => handleChange(v),
 * });
 * ```
 */
export function useTimePicker(props: UseTimePickerProps = {}): UseTimePickerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<TimePickerAPI | null>(null);
  const prevRef = useRef<UseTimePickerProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: TimePickerConfig = {
      defaultValue: props.defaultValue,
      is24h: props.is24h,
      showSeconds: props.showSeconds,
      step: props.step,
      minTime: props.minTime,
      maxTime: props.maxTime,
      onChange: props.onChange,
      onOpenChange: props.onOpenChange,
    };
    apiRef.current = createTimePicker(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.defaultValue !== props.defaultValue && props.defaultValue !== undefined) {
      api.send({ type: 'SET_VALUE', value: props.defaultValue });
      forceRender();
    }
    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);

  // ── Cleanup ──
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const setHour = useCallback((h: number) => api.send({ type: 'SET_HOUR', hour: h }), [api]);
  const setMinute = useCallback((m: number) => api.send({ type: 'SET_MINUTE', minute: m }), [api]);
  const setSecond = useCallback((s: number) => api.send({ type: 'SET_SECOND', second: s }), [api]);
  const setPeriod = useCallback(
    (p: 'AM' | 'PM') => api.send({ type: 'SET_PERIOD', period: p }),
    [api],
  );
  const incrementHour = useCallback(() => api.send({ type: 'INCREMENT_HOUR' }), [api]);
  const decrementHour = useCallback(() => api.send({ type: 'DECREMENT_HOUR' }), [api]);
  const incrementMinute = useCallback(() => api.send({ type: 'INCREMENT_MINUTE' }), [api]);
  const decrementMinute = useCallback(() => api.send({ type: 'DECREMENT_MINUTE' }), [api]);
  const open = useCallback(() => api.send({ type: 'OPEN' }), [api]);
  const close = useCallback(() => api.send({ type: 'CLOSE' }), [api]);
  const toggle = useCallback(() => api.send({ type: 'TOGGLE' }), [api]);

  return {
    hours: ctx.hours,
    minutes: ctx.minutes,
    seconds: ctx.seconds,
    period: ctx.period,
    is24h: ctx.is24h,
    isOpen: ctx.isOpen,
    value: ctx.value,
    setHour,
    setMinute,
    setSecond,
    setPeriod,
    incrementHour,
    decrementHour,
    incrementMinute,
    decrementMinute,
    open,
    close,
    toggle,
    api,
  };
}
