/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useDateRangePicker — DateRangePicker React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createDateRangePicker,
  type DateRangePickerConfig,
  type DateRangePickerAPI,
  type DateRangePreset,
  type SelectingField,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseDateRangePickerProps {
  /** Varsayilan baslangic (ISO) / Default start date (ISO) */
  defaultStartDate?: string;
  /** Varsayilan bitis (ISO) / Default end date (ISO) */
  defaultEndDate?: string;
  /** On tanimli araliklar / Preset ranges */
  presets?: DateRangePreset[];
  /** Minimum tarih / Minimum date */
  minDate?: string;
  /** Maksimum tarih / Maximum date */
  maxDate?: string;
  /** Devre disi tarihler / Disabled dates */
  disabledDates?: (date: string) => boolean;
  /** Haftanin ilk gunu (0=Paz, 1=Pzt) / First day of week */
  firstDayOfWeek?: number;
  /** Degisim callback / Change callback */
  onChange?: (startDate: string | null, endDate: string | null) => void;
  /** Acilma callback / Open change callback */
  onOpenChange?: (isOpen: boolean) => void;
}

// ── Hook Return ─────────────────────────────────────

export interface UseDateRangePickerReturn {
  /** Baslangic tarihi / Start date */
  startDate: string | null;
  /** Bitis tarihi / End date */
  endDate: string | null;
  /** Gorunum yili / View year */
  viewYear: number;
  /** Gorunum ayi (0-11) / View month */
  viewMonth: number;
  /** Acik mi / Is open */
  isOpen: boolean;
  /** Secim alani / Selecting field */
  selectingField: SelectingField;
  /** Tarih sec / Select date */
  selectDate: (date: string) => void;
  /** Onceki ay / Previous month */
  prevMonth: () => void;
  /** Sonraki ay / Next month */
  nextMonth: () => void;
  /** Preset sec / Set preset */
  setPreset: (preset: DateRangePreset) => void;
  /** Temizle / Clear */
  clear: () => void;
  /** Ac / Open */
  open: () => void;
  /** Kapat / Close */
  close: () => void;
  /** Ac/kapat / Toggle */
  toggle: () => void;
  /** Core API / Core API */
  api: DateRangePickerAPI;
}

/**
 * useDateRangePicker — DateRangePicker yonetim hook.
 * useDateRangePicker — DateRangePicker management hook.
 */
export function useDateRangePicker(
  props: UseDateRangePickerProps = {},
): UseDateRangePickerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<DateRangePickerAPI | null>(null);
  const prevRef = useRef<UseDateRangePickerProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: DateRangePickerConfig = {
      defaultStartDate: props.defaultStartDate,
      defaultEndDate: props.defaultEndDate,
      presets: props.presets,
      minDate: props.minDate,
      maxDate: props.maxDate,
      disabledDates: props.disabledDates,
      firstDayOfWeek: props.firstDayOfWeek,
      onChange: props.onChange,
      onOpenChange: props.onOpenChange,
    };
    apiRef.current = createDateRangePicker(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (
      prev.defaultStartDate !== props.defaultStartDate ||
      prev.defaultEndDate !== props.defaultEndDate
    ) {
      api.send({
        type: 'SET_VALUE',
        startDate: props.defaultStartDate ?? null,
        endDate: props.defaultEndDate ?? null,
      });
      forceRender();
    }
    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);

  // ── Cleanup ──
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const selectDate = useCallback(
    (date: string) => api.send({ type: 'SELECT_DATE', date }),
    [api],
  );
  const prevMonth = useCallback(() => api.send({ type: 'PREV_MONTH' }), [api]);
  const nextMonth = useCallback(() => api.send({ type: 'NEXT_MONTH' }), [api]);
  const setPreset = useCallback(
    (preset: DateRangePreset) => api.send({ type: 'SET_PRESET', preset }),
    [api],
  );
  const clear = useCallback(() => api.send({ type: 'CLEAR' }), [api]);
  const open = useCallback(() => api.send({ type: 'OPEN' }), [api]);
  const close = useCallback(() => api.send({ type: 'CLOSE' }), [api]);
  const toggle = useCallback(() => api.send({ type: 'TOGGLE' }), [api]);

  return {
    startDate: ctx.startDate,
    endDate: ctx.endDate,
    viewYear: ctx.viewYear,
    viewMonth: ctx.viewMonth,
    isOpen: ctx.isOpen,
    selectingField: ctx.selectingField,
    selectDate,
    prevMonth,
    nextMonth,
    setPreset,
    clear,
    open,
    close,
    toggle,
    api,
  };
}
