/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DateRangePicker — takvim popup ile tarih araligi secim bilesen (Dual API).
 * DateRangePicker — calendar popup date range picker component (Dual API).
 *
 * Props-based: `<DateRangePicker defaultStartDate="2025-06-01" defaultEndDate="2025-06-15" onChange={fn} />`
 * Compound:    `<DateRangePicker><DateRangePicker.StartInput /><DateRangePicker.EndInput /><DateRangePicker.Calendar /></DateRangePicker>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@relteco/relui-icons';
import type { DateRangePreset, SelectingField } from '@relteco/relui-core';
import {
  rootStyle,
  inputGroupStyle,
  inputStyle,
  separatorStyle,
  calendarStyle,
  headerStyle,
  navButtonStyle,
  monthLabelStyle,
  gridStyle,
  weekdayStyle,
  dayCellStyle,
  dayCellSelectedStyle,
  dayCellInRangeStyle,
  dayCellTodayStyle,
  dayCellDisabledStyle,
  dayCellOutsideStyle,
  presetListStyle,
  presetItemStyle,
  placeholderStyle,
} from './date-range-picker.css';
import { useDateRangePicker, type UseDateRangePickerProps } from './useDateRangePicker';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** DateRangePicker slot isimleri / DateRangePicker slot names. */
export type DateRangePickerSlot =
  | 'root'
  | 'startInput'
  | 'endInput'
  | 'separator'
  | 'calendar'
  | 'header'
  | 'navButton'
  | 'monthLabel'
  | 'grid'
  | 'dayCell'
  | 'presets'
  | 'presetItem';

// ── Helpers ──────────────────────────────────────────

const MONTH_NAMES = [
  'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
  'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik',
];

const WEEKDAY_NAMES_SUN = ['Pz', 'Pt', 'Sa', 'Ca', 'Pe', 'Cu', 'Ct'];

function getWeekdays(firstDay: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < 7; i++) {
    result.push(WEEKDAY_NAMES_SUN[(firstDay + i) % 7] ?? 'Pz');
  }
  return result;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getTodayISO(): string {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDisplay(value: string | null): string {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function isDateDisabledCheck(
  date: string,
  minDate: string | undefined,
  maxDate: string | undefined,
  disabledDates: ((d: string) => boolean) | undefined,
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates && disabledDates(date)) return true;
  return false;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

function buildCalendarDays(
  viewYear: number,
  viewMonth: number,
  startDate: string | null,
  endDate: string | null,
  firstDayOfWeek: number,
  minDate: string | undefined,
  maxDate: string | undefined,
  disabledDates: ((d: string) => boolean) | undefined,
): CalendarDay[] {
  const today = getTodayISO();
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const offset = (firstDay - firstDayOfWeek + 7) % 7;

  const days: CalendarDay[] = [];

  // Previous month padding
  const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const prevDays = getDaysInMonth(prevYear, prevMonth);
  for (let i = offset - 1; i >= 0; i--) {
    const day = prevDays - i;
    const date = toISO(prevYear, prevMonth, day);
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: date === today,
      isSelected: date === startDate || date === endDate,
      isInRange: isInRange(date, startDate, endDate),
      isDisabled: isDateDisabledCheck(date, minDate, maxDate, disabledDates),
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = toISO(viewYear, viewMonth, d);
    days.push({
      date,
      day: d,
      isCurrentMonth: true,
      isToday: date === today,
      isSelected: date === startDate || date === endDate,
      isInRange: isInRange(date, startDate, endDate),
      isDisabled: isDateDisabledCheck(date, minDate, maxDate, disabledDates),
    });
  }

  // Next month padding
  const nMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = toISO(nYear, nMonth, d);
    days.push({
      date,
      day: d,
      isCurrentMonth: false,
      isToday: date === today,
      isSelected: date === startDate || date === endDate,
      isInRange: isInRange(date, startDate, endDate),
      isDisabled: isDateDisabledCheck(date, minDate, maxDate, disabledDates),
    });
  }

  return days;
}

function isInRange(
  date: string,
  startDate: string | null,
  endDate: string | null,
): boolean {
  if (!startDate || !endDate) return false;
  return date > startDate && date < endDate;
}

// ── Context (Compound API) ──────────────────────────

interface DateRangePickerContextValue {
  startDate: string | null;
  endDate: string | null;
  viewYear: number;
  viewMonth: number;
  isOpen: boolean;
  selectingField: SelectingField;
  firstDayOfWeek: number;
  minDate: string | undefined;
  maxDate: string | undefined;
  disabledDates: ((d: string) => boolean) | undefined;
  presets: DateRangePreset[] | undefined;
  placeholderStart: string;
  placeholderEnd: string;
  selectDate: (date: string) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  setPreset: (preset: DateRangePreset) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  classNames: ClassNames<DateRangePickerSlot> | undefined;
  styles: Styles<DateRangePickerSlot> | undefined;
}

const DateRangePickerContext = createContext<DateRangePickerContextValue | null>(null);

function useDateRangePickerContext(): DateRangePickerContextValue {
  const ctx = useContext(DateRangePickerContext);
  if (!ctx) {
    throw new Error(
      'DateRangePicker compound sub-components must be used within <DateRangePicker>.',
    );
  }
  return ctx;
}

// ── Compound: DateRangePicker.StartInput ─────────────

/** DateRangePicker.StartInput props */
export interface DateRangePickerStartInputProps {
  /** Ek className / Additional className */
  className?: string;
}

const DateRangePickerStartInput = forwardRef<HTMLButtonElement, DateRangePickerStartInputProps>(
  function DateRangePickerStartInput(props, ref) {
    const { className } = props;
    const ctx = useDateRangePickerContext();
    const slot = getSlotProps('startInput', inputStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        onClick={ctx.toggle}
        aria-haspopup="dialog"
        aria-expanded={ctx.isOpen}
        data-testid="date-range-picker-startInput"
      >
        <CalendarIcon size={16} />
        {ctx.startDate ? (
          <span>{formatDisplay(ctx.startDate)}</span>
        ) : (
          <span className={placeholderStyle}>{ctx.placeholderStart}</span>
        )}
      </button>
    );
  },
);

// ── Compound: DateRangePicker.EndInput ────────────────

/** DateRangePicker.EndInput props */
export interface DateRangePickerEndInputProps {
  /** Ek className / Additional className */
  className?: string;
}

const DateRangePickerEndInput = forwardRef<HTMLButtonElement, DateRangePickerEndInputProps>(
  function DateRangePickerEndInput(props, ref) {
    const { className } = props;
    const ctx = useDateRangePickerContext();
    const slot = getSlotProps('endInput', inputStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        onClick={ctx.toggle}
        aria-haspopup="dialog"
        aria-expanded={ctx.isOpen}
        data-testid="date-range-picker-endInput"
      >
        <CalendarIcon size={16} />
        {ctx.endDate ? (
          <span>{formatDisplay(ctx.endDate)}</span>
        ) : (
          <span className={placeholderStyle}>{ctx.placeholderEnd}</span>
        )}
      </button>
    );
  },
);

// ── Compound: DateRangePicker.Calendar ────────────────

/** DateRangePicker.Calendar props */
export interface DateRangePickerCalendarProps {
  /** Ek className / Additional className */
  className?: string;
}

const DateRangePickerCalendar = forwardRef<HTMLDivElement, DateRangePickerCalendarProps>(
  function DateRangePickerCalendar(props, ref) {
    const { className } = props;
    const ctx = useDateRangePickerContext();
    const calSlot = getSlotProps('calendar', calendarStyle, ctx.classNames, ctx.styles);
    const calCls = className ? `${calSlot.className} ${className}` : calSlot.className;
    const hdrSlot = getSlotProps('header', headerStyle, ctx.classNames, ctx.styles);
    const navSlot = getSlotProps('navButton', navButtonStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('monthLabel', monthLabelStyle, ctx.classNames, ctx.styles);
    const grdSlot = getSlotProps('grid', gridStyle, ctx.classNames, ctx.styles);

    if (!ctx.isOpen) return null;

    const weekdays = getWeekdays(ctx.firstDayOfWeek);
    const days = buildCalendarDays(
      ctx.viewYear, ctx.viewMonth, ctx.startDate, ctx.endDate,
      ctx.firstDayOfWeek, ctx.minDate, ctx.maxDate, ctx.disabledDates,
    );

    return (
      <div ref={ref} className={calCls} style={calSlot.style} role="dialog" data-testid="date-range-picker-calendar">
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div className={hdrSlot.className} style={hdrSlot.style} data-testid="date-range-picker-header">
            <button
              type="button"
              className={navSlot.className}
              style={navSlot.style}
              onClick={ctx.prevMonth}
              aria-label="Previous month"
              data-testid="date-range-picker-navButton"
            >
              <ChevronLeftIcon size={14} />
            </button>
            <span
              className={labelSlot.className}
              style={labelSlot.style}
              data-testid="date-range-picker-monthLabel"
            >
              {MONTH_NAMES[ctx.viewMonth]} {ctx.viewYear}
            </span>
            <button
              type="button"
              className={navSlot.className}
              style={navSlot.style}
              onClick={ctx.nextMonth}
              aria-label="Next month"
              data-testid="date-range-picker-navButton"
            >
              <ChevronRightIcon size={14} />
            </button>
          </div>

          {/* Grid */}
          <div className={grdSlot.className} style={grdSlot.style} role="grid" data-testid="date-range-picker-grid">
            {weekdays.map((wd) => (
              <span key={wd} className={weekdayStyle} role="columnheader">{wd}</span>
            ))}
            {days.map((d) => {
              const cellClasses = [dayCellStyle];
              if (d.isSelected) cellClasses.push(dayCellSelectedStyle);
              if (d.isInRange && !d.isSelected) cellClasses.push(dayCellInRangeStyle);
              if (d.isToday && !d.isSelected) cellClasses.push(dayCellTodayStyle);
              if (d.isDisabled) cellClasses.push(dayCellDisabledStyle);
              if (!d.isCurrentMonth) cellClasses.push(dayCellOutsideStyle);

              const cellSlot = getSlotProps(
                'dayCell', cellClasses.join(' '), ctx.classNames, ctx.styles,
              );

              return (
                <button
                  key={d.date}
                  type="button"
                  className={cellSlot.className}
                  style={cellSlot.style}
                  onClick={() => !d.isDisabled && ctx.selectDate(d.date)}
                  disabled={d.isDisabled}
                  aria-selected={d.isSelected}
                  aria-label={d.date}
                  data-testid="date-range-picker-dayCell"
                  data-selected={d.isSelected || undefined}
                  data-in-range={d.isInRange || undefined}
                  data-today={d.isToday || undefined}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets (compound renders via context) */}
        {ctx.presets && ctx.presets.length > 0 && (
          <DateRangePickerPresetsInternal />
        )}
      </div>
    );
  },
);

// ── Compound: DateRangePicker.Presets ─────────────────

/** DateRangePicker.Presets props */
export interface DateRangePickerPresetsProps {
  /** Ek className / Additional className */
  className?: string;
}

const DateRangePickerPresetsInternal = forwardRef<HTMLDivElement, DateRangePickerPresetsProps>(
  function DateRangePickerPresets(props, ref) {
    const { className } = props ?? {};
    const ctx = useDateRangePickerContext();
    const presetSlot = getSlotProps('presets', presetListStyle, ctx.classNames, ctx.styles);
    const presetCls = className ? `${presetSlot.className} ${className}` : presetSlot.className;

    if (!ctx.presets || ctx.presets.length === 0) return null;

    return (
      <div
        ref={ref}
        className={presetCls}
        style={presetSlot.style}
        data-testid="date-range-picker-presets"
      >
        {ctx.presets.map((preset) => {
          const itemSlot = getSlotProps(
            'presetItem', presetItemStyle, ctx.classNames, ctx.styles,
          );

          return (
            <button
              key={preset.label}
              type="button"
              className={itemSlot.className}
              style={itemSlot.style}
              onClick={() => ctx.setPreset(preset)}
              data-testid="date-range-picker-presetItem"
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    );
  },
);

const DateRangePickerPresets = DateRangePickerPresetsInternal;

// ── Component Props ─────────────────────────────────

export interface DateRangePickerComponentProps extends SlotStyleProps<DateRangePickerSlot> {
  /** Baslangic tarihi (ISO) / Start date (ISO) */
  startDate?: string;
  /** Bitis tarihi (ISO) / End date (ISO) */
  endDate?: string;
  /** Varsayilan baslangic / Default start date */
  defaultStartDate?: string;
  /** Varsayilan bitis / Default end date */
  defaultEndDate?: string;
  /** Degisim callback / Change callback */
  onChange?: (startDate: string | null, endDate: string | null) => void;
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
  /** Baslangic placeholder / Start placeholder */
  placeholderStart?: string;
  /** Bitis placeholder / End placeholder */
  placeholderEnd?: string;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const DateRangePickerBase = forwardRef<HTMLDivElement, DateRangePickerComponentProps>(
  function DateRangePicker(props, ref) {
    const {
      defaultStartDate,
      defaultEndDate,
      onChange,
      presets,
      minDate,
      maxDate,
      disabledDates,
      firstDayOfWeek = 1,
      placeholderStart = 'Baslangic',
      placeholderEnd = 'Bitis',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseDateRangePickerProps = {
      defaultStartDate,
      defaultEndDate,
      presets,
      minDate,
      maxDate,
      disabledDates,
      firstDayOfWeek,
      onChange,
    };
    const picker = useDateRangePicker(hookProps);

    // ── Close on outside click ──
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!picker.isOpen) return;
      function handleClick(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          picker.close();
        }
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [picker.isOpen, picker]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: DateRangePickerContextValue = {
      startDate: picker.startDate,
      endDate: picker.endDate,
      viewYear: picker.viewYear,
      viewMonth: picker.viewMonth,
      isOpen: picker.isOpen,
      selectingField: picker.selectingField,
      firstDayOfWeek,
      minDate,
      maxDate,
      disabledDates,
      presets,
      placeholderStart,
      placeholderEnd,
      selectDate: picker.selectDate,
      prevMonth: picker.prevMonth,
      nextMonth: picker.nextMonth,
      setPreset: picker.setPreset,
      clear: picker.clear,
      open: picker.open,
      close: picker.close,
      toggle: picker.toggle,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <DateRangePickerContext.Provider value={ctxValue}>
          <div
            ref={(node) => {
              (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="date-range-picker-root"
          >
            {children}
          </div>
        </DateRangePickerContext.Provider>
      );
    }

    // ── Props-based API ──
    const startSlot = getSlotProps('startInput', inputStyle, classNames, styles);
    const endSlot = getSlotProps('endInput', inputStyle, classNames, styles);
    const sepSlot = getSlotProps('separator', separatorStyle, classNames, styles);
    const calSlot = getSlotProps('calendar', calendarStyle, classNames, styles);
    const hdrSlot = getSlotProps('header', headerStyle, classNames, styles);
    const navSlot = getSlotProps('navButton', navButtonStyle, classNames, styles);
    const labelSlot = getSlotProps('monthLabel', monthLabelStyle, classNames, styles);
    const grdSlot = getSlotProps('grid', gridStyle, classNames, styles);

    const weekdays = getWeekdays(firstDayOfWeek);
    const days = buildCalendarDays(
      picker.viewYear, picker.viewMonth, picker.startDate, picker.endDate,
      firstDayOfWeek, minDate, maxDate, disabledDates,
    );

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="date-range-picker-root"
      >
        {/* Input Group */}
        <div className={inputGroupStyle}>
          <button
            type="button"
            className={startSlot.className}
            style={startSlot.style}
            onClick={picker.toggle}
            aria-haspopup="dialog"
            aria-expanded={picker.isOpen}
            data-testid="date-range-picker-startInput"
          >
            <CalendarIcon size={16} />
            {picker.startDate ? (
              <span>{formatDisplay(picker.startDate)}</span>
            ) : (
              <span className={placeholderStyle}>{placeholderStart}</span>
            )}
          </button>

          <span className={sepSlot.className} style={sepSlot.style}>—</span>

          <button
            type="button"
            className={endSlot.className}
            style={endSlot.style}
            onClick={picker.toggle}
            aria-haspopup="dialog"
            aria-expanded={picker.isOpen}
            data-testid="date-range-picker-endInput"
          >
            <CalendarIcon size={16} />
            {picker.endDate ? (
              <span>{formatDisplay(picker.endDate)}</span>
            ) : (
              <span className={placeholderStyle}>{placeholderEnd}</span>
            )}
          </button>
        </div>

        {/* Calendar popup */}
        {picker.isOpen && (
          <div
            className={calSlot.className}
            style={calSlot.style}
            role="dialog"
            data-testid="date-range-picker-calendar"
          >
            <div style={{ flex: 1 }}>
              {/* Header */}
              <div className={hdrSlot.className} style={hdrSlot.style} data-testid="date-range-picker-header">
                <button
                  type="button"
                  className={navSlot.className}
                  style={navSlot.style}
                  onClick={picker.prevMonth}
                  aria-label="Previous month"
                  data-testid="date-range-picker-navButton"
                >
                  <ChevronLeftIcon size={14} />
                </button>
                <span
                  className={labelSlot.className}
                  style={labelSlot.style}
                  data-testid="date-range-picker-monthLabel"
                >
                  {MONTH_NAMES[picker.viewMonth]} {picker.viewYear}
                </span>
                <button
                  type="button"
                  className={navSlot.className}
                  style={navSlot.style}
                  onClick={picker.nextMonth}
                  aria-label="Next month"
                  data-testid="date-range-picker-navButton"
                >
                  <ChevronRightIcon size={14} />
                </button>
              </div>

              {/* Grid */}
              <div className={grdSlot.className} style={grdSlot.style} role="grid" data-testid="date-range-picker-grid">
                {weekdays.map((wd) => (
                  <span key={wd} className={weekdayStyle} role="columnheader">{wd}</span>
                ))}
                {days.map((d) => {
                  const cellClasses = [dayCellStyle];
                  if (d.isSelected) cellClasses.push(dayCellSelectedStyle);
                  if (d.isInRange && !d.isSelected) cellClasses.push(dayCellInRangeStyle);
                  if (d.isToday && !d.isSelected) cellClasses.push(dayCellTodayStyle);
                  if (d.isDisabled) cellClasses.push(dayCellDisabledStyle);
                  if (!d.isCurrentMonth) cellClasses.push(dayCellOutsideStyle);

                  const cellSlot = getSlotProps(
                    'dayCell', cellClasses.join(' '), classNames, styles,
                  );

                  return (
                    <button
                      key={d.date}
                      type="button"
                      className={cellSlot.className}
                      style={cellSlot.style}
                      onClick={() => !d.isDisabled && picker.selectDate(d.date)}
                      disabled={d.isDisabled}
                      aria-selected={d.isSelected}
                      aria-label={d.date}
                      data-testid="date-range-picker-dayCell"
                      data-selected={d.isSelected || undefined}
                      data-in-range={d.isInRange || undefined}
                      data-today={d.isToday || undefined}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            {presets && presets.length > 0 && (
              <div
                {...(() => { const s = getSlotProps('presets', presetListStyle, classNames, styles); return { className: s.className, style: s.style }; })()}
                data-testid="date-range-picker-presets"
              >
                {presets.map((preset) => {
                  const itemSlot = getSlotProps(
                    'presetItem', presetItemStyle, classNames, styles,
                  );
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      className={itemSlot.className}
                      style={itemSlot.style}
                      onClick={() => picker.setPreset(preset)}
                      data-testid="date-range-picker-presetItem"
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

/**
 * DateRangePicker bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <DateRangePicker
 *   defaultStartDate="2025-06-01"
 *   defaultEndDate="2025-06-15"
 *   onChange={(start, end) => setRange(start, end)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <DateRangePicker>
 *   <DateRangePicker.StartInput />
 *   <DateRangePicker.EndInput />
 *   <DateRangePicker.Calendar />
 * </DateRangePicker>
 * ```
 */
export const DateRangePicker = Object.assign(DateRangePickerBase, {
  StartInput: DateRangePickerStartInput,
  EndInput: DateRangePickerEndInput,
  Calendar: DateRangePickerCalendar,
  Presets: DateRangePickerPresets,
});
