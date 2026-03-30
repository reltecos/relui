/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useDatePicker — DatePicker React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createDatePicker,
  type DatePickerConfig,
  type DatePickerAPI,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseDatePickerProps {
  /** Varsayilan deger (ISO) / Default value (ISO) */
  defaultValue?: string;
  /** Minimum tarih / Minimum date */
  minDate?: string;
  /** Maksimum tarih / Maximum date */
  maxDate?: string;
  /** Devre disi tarihler / Disabled dates */
  disabledDates?: (date: string) => boolean;
  /** Haftanin ilk gunu (0=Paz, 1=Pzt) / First day of week (0=Sun, 1=Mon) */
  firstDayOfWeek?: 0 | 1;
  /** Degisim callback / Change callback */
  onChange?: (value: string | null) => void;
  /** Acilma callback / Open change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

// ── Hook Return ─────────────────────────────────────

export interface UseDatePickerReturn {
  /** Secili deger / Selected value */
  value: string | null;
  /** Gorunum yili / View year */
  viewYear: number;
  /** Gorunum ayi (0-11) / View month */
  viewMonth: number;
  /** Acik mi / Is open */
  isOpen: boolean;
  /** Tarih sec / Select date */
  selectDate: (date: string) => void;
  /** Onceki ay / Previous month */
  prevMonth: () => void;
  /** Sonraki ay / Next month */
  nextMonth: () => void;
  /** Ac / Open */
  open: () => void;
  /** Kapat / Close */
  close: () => void;
  /** Ac/kapat / Toggle */
  toggle: () => void;
  /** Core API / Core API */
  api: DatePickerAPI;
}

/**
 * useDatePicker — DatePicker yonetim hook.
 * useDatePicker — DatePicker management hook.
 */
export function useDatePicker(props: UseDatePickerProps = {}): UseDatePickerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<DatePickerAPI | null>(null);
  const prevRef = useRef<UseDatePickerProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: DatePickerConfig = {
      defaultValue: props.defaultValue,
      minDate: props.minDate,
      maxDate: props.maxDate,
      disabledDates: props.disabledDates,
      firstDayOfWeek: props.firstDayOfWeek,
      onChange: props.onChange,
      onOpenChange: props.onOpenChange,
    };
    apiRef.current = createDatePicker(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.minDate !== props.minDate && props.minDate !== undefined) {
      api.send({ type: 'SET_MIN', date: props.minDate });
      forceRender();
    }
    if (prev.maxDate !== props.maxDate && props.maxDate !== undefined) {
      api.send({ type: 'SET_MAX', date: props.maxDate });
      forceRender();
    }
    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);

  // ── Cleanup ──
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const selectDate = useCallback((date: string) => api.send({ type: 'SELECT_DATE', date }), [api]);
  const prevMonth = useCallback(() => api.send({ type: 'PREV_MONTH' }), [api]);
  const nextMonth = useCallback(() => api.send({ type: 'NEXT_MONTH' }), [api]);
  const open = useCallback(() => api.send({ type: 'OPEN' }), [api]);
  const close = useCallback(() => api.send({ type: 'CLOSE' }), [api]);
  const toggle = useCallback(() => api.send({ type: 'TOGGLE' }), [api]);

  return {
    value: ctx.value,
    viewYear: ctx.viewYear,
    viewMonth: ctx.viewMonth,
    isOpen: ctx.isOpen,
    selectDate,
    prevMonth,
    nextMonth,
    open,
    close,
    toggle,
    api,
  };
}
