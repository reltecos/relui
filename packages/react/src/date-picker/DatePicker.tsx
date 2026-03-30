/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DatePicker — takvim popup ile tarih secim bilesen (Dual API).
 * DatePicker — calendar popup date picker component (Dual API).
 *
 * Props-based: `<DatePicker value="2025-06-15" onChange={fn} />`
 * Compound:    `<DatePicker><DatePicker.Input /><DatePicker.Calendar /></DatePicker>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@relteco/relui-icons';
import {
  rootStyle,
  inputStyle,
  calendarStyle,
  headerStyle,
  navButtonStyle,
  monthLabelStyle,
  gridStyle,
  weekdayStyle,
  dayCellStyle,
  dayCellSelectedStyle,
  dayCellTodayStyle,
  dayCellDisabledStyle,
  dayCellOutsideStyle,
  placeholderStyle,
} from './date-picker.css';
import { useDatePicker, type UseDatePickerProps } from './useDatePicker';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** DatePicker slot isimleri / DatePicker slot names. */
export type DatePickerSlot =
  | 'root'
  | 'input'
  | 'calendar'
  | 'header'
  | 'navButton'
  | 'monthLabel'
  | 'grid'
  | 'dayCell';

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

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

function buildCalendarDays(
  viewYear: number,
  viewMonth: number,
  value: string | null,
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
      isSelected: date === value,
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
      isSelected: date === value,
      isDisabled: isDateDisabledCheck(date, minDate, maxDate, disabledDates),
    });
  }

  // Next month padding
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = toISO(nextYear, nextMonth, d);
    days.push({
      date,
      day: d,
      isCurrentMonth: false,
      isToday: date === today,
      isSelected: date === value,
      isDisabled: isDateDisabledCheck(date, minDate, maxDate, disabledDates),
    });
  }

  return days;
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

// ── Context (Compound API) ──────────────────────────

interface DatePickerContextValue {
  value: string | null;
  viewYear: number;
  viewMonth: number;
  isOpen: boolean;
  firstDayOfWeek: number;
  minDate: string | undefined;
  maxDate: string | undefined;
  disabledDates: ((d: string) => boolean) | undefined;
  placeholder: string;
  selectDate: (date: string) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  classNames: ClassNames<DatePickerSlot> | undefined;
  styles: Styles<DatePickerSlot> | undefined;
}

const DatePickerContext = createContext<DatePickerContextValue | null>(null);

function useDatePickerContext(): DatePickerContextValue {
  const ctx = useContext(DatePickerContext);
  if (!ctx) throw new Error('DatePicker compound sub-components must be used within <DatePicker>.');
  return ctx;
}

// ── Compound: DatePicker.Input ───────────────────────

/** DatePicker.Input props */
export interface DatePickerInputProps {
  /** Ek className / Additional className */
  className?: string;
}

const DatePickerInput = forwardRef<HTMLButtonElement, DatePickerInputProps>(
  function DatePickerInput(props, ref) {
    const { className } = props;
    const ctx = useDatePickerContext();
    const slot = getSlotProps('input', inputStyle, ctx.classNames, ctx.styles);
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
        data-testid="date-picker-input"
      >
        <CalendarIcon size={16} />
        {ctx.value ? (
          <span>{formatDisplay(ctx.value)}</span>
        ) : (
          <span className={placeholderStyle}>{ctx.placeholder}</span>
        )}
      </button>
    );
  },
);

// ── Compound: DatePicker.Navigation ──────────────────

/** DatePicker.Navigation props */
export interface DatePickerNavigationProps {
  /** Ek className / Additional className */
  className?: string;
}

const DatePickerNavigation = forwardRef<HTMLDivElement, DatePickerNavigationProps>(
  function DatePickerNavigation(props, ref) {
    const { className } = props;
    const ctx = useDatePickerContext();
    const hdrSlot = getSlotProps('header', headerStyle, ctx.classNames, ctx.styles);
    const hdrCls = className ? `${hdrSlot.className} ${className}` : hdrSlot.className;
    const navSlot = getSlotProps('navButton', navButtonStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('monthLabel', monthLabelStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} className={hdrCls} style={hdrSlot.style} data-testid="date-picker-header">
        <button
          type="button"
          className={navSlot.className}
          style={navSlot.style}
          onClick={ctx.prevMonth}
          aria-label="Previous month"
          data-testid="date-picker-navButton"
        >
          <ChevronLeftIcon size={14} />
        </button>
        <span className={labelSlot.className} style={labelSlot.style} data-testid="date-picker-monthLabel">
          {MONTH_NAMES[ctx.viewMonth]} {ctx.viewYear}
        </span>
        <button
          type="button"
          className={navSlot.className}
          style={navSlot.style}
          onClick={ctx.nextMonth}
          aria-label="Next month"
          data-testid="date-picker-navButton"
        >
          <ChevronRightIcon size={14} />
        </button>
      </div>
    );
  },
);

// ── Compound: DatePicker.Calendar ────────────────────

/** DatePicker.Calendar props */
export interface DatePickerCalendarProps {
  /** Ek className / Additional className */
  className?: string;
}

const DatePickerCalendar = forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  function DatePickerCalendar(props, ref) {
    const { className } = props;
    const ctx = useDatePickerContext();
    const calSlot = getSlotProps('calendar', calendarStyle, ctx.classNames, ctx.styles);
    const calCls = className ? `${calSlot.className} ${className}` : calSlot.className;
    const gridSlot = getSlotProps('grid', gridStyle, ctx.classNames, ctx.styles);

    if (!ctx.isOpen) return null;

    const weekdays = getWeekdays(ctx.firstDayOfWeek);
    const days = buildCalendarDays(
      ctx.viewYear, ctx.viewMonth, ctx.value,
      ctx.firstDayOfWeek, ctx.minDate, ctx.maxDate, ctx.disabledDates,
    );

    return (
      <div ref={ref} className={calCls} style={calSlot.style} role="dialog" data-testid="date-picker-calendar">
        <DatePickerNavigation />
        <div className={gridSlot.className} style={gridSlot.style} role="grid" data-testid="date-picker-grid">
          {weekdays.map((wd) => (
            <span key={wd} className={weekdayStyle} role="columnheader">{wd}</span>
          ))}
          {days.map((d) => {
            const cellClasses = [dayCellStyle];
            if (d.isSelected) cellClasses.push(dayCellSelectedStyle);
            if (d.isToday && !d.isSelected) cellClasses.push(dayCellTodayStyle);
            if (d.isDisabled) cellClasses.push(dayCellDisabledStyle);
            if (!d.isCurrentMonth) cellClasses.push(dayCellOutsideStyle);

            const cellSlot = getSlotProps('dayCell', cellClasses.join(' '), ctx.classNames, ctx.styles);

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
                data-testid="date-picker-dayCell"
                data-selected={d.isSelected || undefined}
                data-today={d.isToday || undefined}
              >
                {d.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface DatePickerComponentProps extends SlotStyleProps<DatePickerSlot> {
  /** Secili deger (ISO) / Selected value (ISO) */
  value?: string;
  /** Varsayilan deger / Default value */
  defaultValue?: string;
  /** Degisim callback / Change callback */
  onChange?: (value: string | null) => void;
  /** Placeholder */
  placeholder?: string;
  /** Minimum tarih / Minimum date */
  minDate?: string;
  /** Maksimum tarih / Maximum date */
  maxDate?: string;
  /** Devre disi tarihler / Disabled dates */
  disabledDates?: (date: string) => boolean;
  /** Haftanin ilk gunu (0=Paz, 1=Pzt) / First day of week (0=Sun, 1=Mon) */
  firstDayOfWeek?: 0 | 1;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const DatePickerBase = forwardRef<HTMLDivElement, DatePickerComponentProps>(
  function DatePicker(props, ref) {
    const {
      defaultValue,
      onChange,
      placeholder = 'Tarih secin',
      minDate,
      maxDate,
      disabledDates,
      firstDayOfWeek = 1,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseDatePickerProps = {
      defaultValue,
      minDate,
      maxDate,
      disabledDates,
      firstDayOfWeek,
      onChange,
    };
    const picker = useDatePicker(hookProps);

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

    const ctxValue: DatePickerContextValue = {
      value: picker.value,
      viewYear: picker.viewYear,
      viewMonth: picker.viewMonth,
      isOpen: picker.isOpen,
      firstDayOfWeek,
      minDate,
      maxDate,
      disabledDates,
      placeholder,
      selectDate: picker.selectDate,
      prevMonth: picker.prevMonth,
      nextMonth: picker.nextMonth,
      open: picker.open,
      close: picker.close,
      toggle: picker.toggle,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <DatePickerContext.Provider value={ctxValue}>
          <div
            ref={(node) => {
              (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="date-picker-root"
          >
            {children}
          </div>
        </DatePickerContext.Provider>
      );
    }

    // ── Props-based API ──
    const inpSlot = getSlotProps('input', inputStyle, classNames, styles);
    const calSlot = getSlotProps('calendar', calendarStyle, classNames, styles);
    const hdrSlot = getSlotProps('header', headerStyle, classNames, styles);
    const navSlot = getSlotProps('navButton', navButtonStyle, classNames, styles);
    const labelSlot = getSlotProps('monthLabel', monthLabelStyle, classNames, styles);
    const grdSlot = getSlotProps('grid', gridStyle, classNames, styles);

    const weekdays = getWeekdays(firstDayOfWeek);
    const days = buildCalendarDays(
      picker.viewYear, picker.viewMonth, picker.value,
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
        data-testid="date-picker-root"
      >
        {/* Input */}
        <button
          type="button"
          className={inpSlot.className}
          style={inpSlot.style}
          onClick={picker.toggle}
          aria-haspopup="dialog"
          aria-expanded={picker.isOpen}
          data-testid="date-picker-input"
        >
          <CalendarIcon size={16} />
          {picker.value ? (
            <span>{formatDisplay(picker.value)}</span>
          ) : (
            <span className={placeholderStyle}>{placeholder}</span>
          )}
        </button>

        {/* Calendar popup */}
        {picker.isOpen && (
          <div className={calSlot.className} style={calSlot.style} role="dialog" data-testid="date-picker-calendar">
            {/* Header */}
            <div className={hdrSlot.className} style={hdrSlot.style} data-testid="date-picker-header">
              <button
                type="button"
                className={navSlot.className}
                style={navSlot.style}
                onClick={picker.prevMonth}
                aria-label="Previous month"
                data-testid="date-picker-navButton"
              >
                <ChevronLeftIcon size={14} />
              </button>
              <span className={labelSlot.className} style={labelSlot.style} data-testid="date-picker-monthLabel">
                {MONTH_NAMES[picker.viewMonth]} {picker.viewYear}
              </span>
              <button
                type="button"
                className={navSlot.className}
                style={navSlot.style}
                onClick={picker.nextMonth}
                aria-label="Next month"
                data-testid="date-picker-navButton"
              >
                <ChevronRightIcon size={14} />
              </button>
            </div>

            {/* Grid */}
            <div className={grdSlot.className} style={grdSlot.style} role="grid" data-testid="date-picker-grid">
              {weekdays.map((wd) => (
                <span key={wd} className={weekdayStyle} role="columnheader">{wd}</span>
              ))}
              {days.map((d) => {
                const cellClasses = [dayCellStyle];
                if (d.isSelected) cellClasses.push(dayCellSelectedStyle);
                if (d.isToday && !d.isSelected) cellClasses.push(dayCellTodayStyle);
                if (d.isDisabled) cellClasses.push(dayCellDisabledStyle);
                if (!d.isCurrentMonth) cellClasses.push(dayCellOutsideStyle);

                const cellSlot = getSlotProps('dayCell', cellClasses.join(' '), classNames, styles);

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
                    data-testid="date-picker-dayCell"
                    data-selected={d.isSelected || undefined}
                    data-today={d.isToday || undefined}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * DatePicker bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <DatePicker defaultValue="2025-06-15" onChange={(v) => setValue(v)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <DatePicker>
 *   <DatePicker.Input />
 *   <DatePicker.Calendar />
 * </DatePicker>
 * ```
 */
export const DatePicker = Object.assign(DatePickerBase, {
  Input: DatePickerInput,
  Calendar: DatePickerCalendar,
  Navigation: DatePickerNavigation,
});
