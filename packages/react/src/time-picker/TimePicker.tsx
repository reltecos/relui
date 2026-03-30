/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TimePicker — saat secici bilesen (Dual API).
 * TimePicker — time picker component (Dual API).
 *
 * Props-based: `<TimePicker defaultValue="14:30" is24h />`
 * Compound:    `<TimePicker><TimePicker.Input /><TimePicker.HourColumn />...</TimePicker>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  rootStyle,
  inputStyle,
  dropdownStyle,
  columnStyle,
  cellStyle,
  cellSelectedStyle,
  separatorStyle,
  periodColumnStyle,
  placeholderStyle,
} from './time-picker.css';
import { useTimePicker, type UseTimePickerProps } from './useTimePicker';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { ClockIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/** TimePicker slot isimleri / TimePicker slot names. */
export type TimePickerSlot =
  | 'root'
  | 'input'
  | 'dropdown'
  | 'hourColumn'
  | 'minuteColumn'
  | 'secondColumn'
  | 'period'
  | 'cell'
  | 'separator';

// ── Helpers ───────────────────────────────────────────

/**
 * Sayi iki basamakli string yapar.
 * Pads number to two digits.
 */
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

// ── Context (Compound API) ────────────────────────────

interface TimePickerContextValue {
  hours: number;
  minutes: number;
  seconds: number;
  period: 'AM' | 'PM';
  is24h: boolean;
  isOpen: boolean;
  showSeconds: boolean;
  step: number;
  value: string | null;
  setHour: (h: number) => void;
  setMinute: (m: number) => void;
  setSecond: (s: number) => void;
  setPeriod: (p: 'AM' | 'PM') => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  classNames: ClassNames<TimePickerSlot> | undefined;
  styles: Styles<TimePickerSlot> | undefined;
}

const TimePickerContext = createContext<TimePickerContextValue | null>(null);

function useTimePickerContext(): TimePickerContextValue {
  const ctx = useContext(TimePickerContext);
  if (!ctx) throw new Error('TimePicker compound sub-components must be used within <TimePicker>.');
  return ctx;
}

// ── Compound: TimePicker.Input ────────────────────────

/** TimePicker.Input props */
export interface TimePickerInputProps {
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
  /** Icerik / Content */
  children?: ReactNode;
}

const TimePickerInput = forwardRef<HTMLButtonElement, TimePickerInputProps>(
  function TimePickerInput(props, ref) {
    const { placeholder = 'Select time', className, children } = props;
    const ctx = useTimePickerContext();
    const slot = getSlotProps('input', inputStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const displayValue = ctx.value
      ? formatDisplay(ctx.hours, ctx.minutes, ctx.seconds, ctx.is24h, ctx.showSeconds, ctx.period)
      : null;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        onClick={ctx.toggle}
        aria-haspopup="listbox"
        aria-expanded={ctx.isOpen}
        data-testid="time-picker-input"
      >
        <ClockIcon size={16} />
        {children ?? (
          displayValue ? (
            <span>{displayValue}</span>
          ) : (
            <span className={placeholderStyle}>{placeholder}</span>
          )
        )}
      </button>
    );
  },
);

// ── Compound: TimePicker.HourColumn ──────────────────

/** TimePicker.HourColumn props */
export interface TimePickerHourColumnProps {
  /** Ek className / Additional className */
  className?: string;
}

const TimePickerHourColumn = forwardRef<HTMLDivElement, TimePickerHourColumnProps>(
  function TimePickerHourColumn(props, ref) {
    const { className } = props;
    const ctx = useTimePickerContext();
    const slot = getSlotProps('hourColumn', columnStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const hourRange = ctx.is24h
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="time-picker-hourColumn">
        {hourRange.map((h) => {
          const isSelected = h === ctx.hours;
          const cellSlot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
          const cellCls = isSelected
            ? `${cellSlot.className} ${cellSelectedStyle}`
            : cellSlot.className;

          return (
            <button
              key={h}
              type="button"
              className={cellCls}
              style={cellSlot.style}
              onClick={() => {
                if (ctx.is24h) {
                  ctx.setHour(h);
                } else {
                  const internalHour = to24Hour(h, ctx.period);
                  ctx.setHour(internalHour);
                }
              }}
              data-testid="time-picker-cell"
              data-selected={isSelected || undefined}
            >
              {pad(h)}
            </button>
          );
        })}
      </div>
    );
  },
);

// ── Compound: TimePicker.MinuteColumn ────────────────

/** TimePicker.MinuteColumn props */
export interface TimePickerMinuteColumnProps {
  /** Ek className / Additional className */
  className?: string;
}

const TimePickerMinuteColumn = forwardRef<HTMLDivElement, TimePickerMinuteColumnProps>(
  function TimePickerMinuteColumn(props, ref) {
    const { className } = props;
    const ctx = useTimePickerContext();
    const slot = getSlotProps('minuteColumn', columnStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const minuteValues: number[] = [];
    for (let m = 0; m < 60; m += ctx.step) {
      minuteValues.push(m);
    }

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="time-picker-minuteColumn">
        {minuteValues.map((m) => {
          const isSelected = m === ctx.minutes;
          const cellSlot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
          const cellCls = isSelected
            ? `${cellSlot.className} ${cellSelectedStyle}`
            : cellSlot.className;

          return (
            <button
              key={m}
              type="button"
              className={cellCls}
              style={cellSlot.style}
              onClick={() => ctx.setMinute(m)}
              data-testid="time-picker-cell"
              data-selected={isSelected || undefined}
            >
              {pad(m)}
            </button>
          );
        })}
      </div>
    );
  },
);

// ── Compound: TimePicker.SecondColumn ────────────────

/** TimePicker.SecondColumn props */
export interface TimePickerSecondColumnProps {
  /** Ek className / Additional className */
  className?: string;
}

const TimePickerSecondColumn = forwardRef<HTMLDivElement, TimePickerSecondColumnProps>(
  function TimePickerSecondColumn(props, ref) {
    const { className } = props;
    const ctx = useTimePickerContext();
    const slot = getSlotProps('secondColumn', columnStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="time-picker-secondColumn">
        {Array.from({ length: 60 }, (_, s) => {
          const isSelected = s === ctx.seconds;
          const cellSlot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
          const cellCls = isSelected
            ? `${cellSlot.className} ${cellSelectedStyle}`
            : cellSlot.className;

          return (
            <button
              key={s}
              type="button"
              className={cellCls}
              style={cellSlot.style}
              onClick={() => ctx.setSecond(s)}
              data-testid="time-picker-cell"
              data-selected={isSelected || undefined}
            >
              {pad(s)}
            </button>
          );
        })}
      </div>
    );
  },
);

// ── Compound: TimePicker.Period ──────────────────────

/** TimePicker.Period props */
export interface TimePickerPeriodProps {
  /** Ek className / Additional className */
  className?: string;
}

const TimePickerPeriod = forwardRef<HTMLDivElement, TimePickerPeriodProps>(
  function TimePickerPeriod(props, ref) {
    const { className } = props;
    const ctx = useTimePickerContext();
    const slot = getSlotProps('period', periodColumnStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="time-picker-period">
        {(['AM', 'PM'] as const).map((p) => {
          const isSelected = p === ctx.period;
          const cellSlot = getSlotProps('cell', cellStyle, ctx.classNames, ctx.styles);
          const cellCls = isSelected
            ? `${cellSlot.className} ${cellSelectedStyle}`
            : cellSlot.className;

          return (
            <button
              key={p}
              type="button"
              className={cellCls}
              style={cellSlot.style}
              onClick={() => ctx.setPeriod(p)}
              data-testid="time-picker-cell"
              data-selected={isSelected || undefined}
            >
              {p}
            </button>
          );
        })}
      </div>
    );
  },
);

// ── Helpers ───────────────────────────────────────────

/**
 * 12h saat degerini 24h internal degere donusturur.
 * Converts 12h display hour to 24h internal value.
 */
function to24Hour(displayHour: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') {
    return displayHour === 12 ? 0 : displayHour;
  }
  return displayHour === 12 ? 12 : displayHour + 12;
}

/**
 * Goruntuleme formatini olusturur.
 * Creates display format string.
 */
function formatDisplay(
  hours: number,
  minutes: number,
  seconds: number,
  is24h: boolean,
  showSeconds: boolean,
  period: 'AM' | 'PM',
): string {
  const base = `${pad(hours)}:${pad(minutes)}`;
  const withSeconds = showSeconds ? `${base}:${pad(seconds)}` : base;
  return is24h ? withSeconds : `${withSeconds} ${period}`;
}

// ── Component Props ───────────────────────────────────

/** TimePicker bilesen props / TimePicker component props. */
export interface TimePickerComponentProps extends SlotStyleProps<TimePickerSlot>, UseTimePickerProps {
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const TimePickerBase = forwardRef<HTMLDivElement, TimePickerComponentProps>(
  function TimePicker(props, ref) {
    const {
      defaultValue,
      is24h,
      showSeconds = false,
      step = 1,
      minTime,
      maxTime,
      onChange,
      onOpenChange,
      placeholder = 'Select time',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const {
      hours,
      minutes,
      seconds,
      period,
      is24h: resolved24h,
      isOpen,
      value,
      setHour,
      setMinute,
      setSecond,
      setPeriod,
      open,
      close,
      toggle,
    } = useTimePicker({
      defaultValue,
      is24h,
      showSeconds,
      step,
      minTime,
      maxTime,
      onChange,
      onOpenChange,
    });

    // ── Outside click ──
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!isOpen) return;

      function handleMouseDown(e: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          close();
        }
      }

      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [isOpen, close]);

    // ── Slots ──
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: TimePickerContextValue = {
      hours,
      minutes,
      seconds,
      period,
      is24h: resolved24h,
      isOpen,
      showSeconds,
      step,
      value,
      setHour,
      setMinute,
      setSecond,
      setPeriod,
      open,
      close,
      toggle,
      classNames,
      styles,
    };

    // ── Ref merge ──
    function setRefs(el: HTMLDivElement | null) {
      rootRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
    }

    // ── Compound API (children varsa) ──
    if (children) {
      return (
        <TimePickerContext.Provider value={ctxValue}>
          <div
            ref={setRefs}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="time-picker-root"
          >
            {children}
          </div>
        </TimePickerContext.Provider>
      );
    }

    // ── Props-based API ──
    const inputSlot = getSlotProps('input', inputStyle, classNames, styles);
    const dropdownSlotProps = getSlotProps('dropdown', dropdownStyle, classNames, styles);
    const hourColumnSlot = getSlotProps('hourColumn', columnStyle, classNames, styles);
    const minuteColumnSlot = getSlotProps('minuteColumn', columnStyle, classNames, styles);
    const secondColumnSlot = getSlotProps('secondColumn', columnStyle, classNames, styles);
    const periodSlot = getSlotProps('period', periodColumnStyle, classNames, styles);
    const sepSlot = getSlotProps('separator', separatorStyle, classNames, styles);

    const displayValue = value
      ? formatDisplay(hours, minutes, seconds, resolved24h, showSeconds, period)
      : null;

    const hourRange = resolved24h
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);

    const minuteValues: number[] = [];
    for (let m = 0; m < 60; m += step) {
      minuteValues.push(m);
    }

    return (
      <div
        ref={setRefs}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="time-picker-root"
      >
        {/* Input */}
        <button
          type="button"
          className={inputSlot.className}
          style={inputSlot.style}
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-testid="time-picker-input"
        >
          <ClockIcon size={16} />
          {displayValue ? (
            <span>{displayValue}</span>
          ) : (
            <span className={placeholderStyle}>{placeholder}</span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={dropdownSlotProps.className}
            style={dropdownSlotProps.style}
            data-testid="time-picker-dropdown"
          >
            {/* Hour Column */}
            <div
              className={hourColumnSlot.className}
              style={hourColumnSlot.style}
              data-testid="time-picker-hourColumn"
            >
              {hourRange.map((h) => {
                const isSelected = h === hours;
                const cellSlot = getSlotProps('cell', cellStyle, classNames, styles);
                const cellCls = isSelected
                  ? `${cellSlot.className} ${cellSelectedStyle}`
                  : cellSlot.className;

                return (
                  <button
                    key={h}
                    type="button"
                    className={cellCls}
                    style={cellSlot.style}
                    onClick={() => {
                      if (resolved24h) {
                        setHour(h);
                      } else {
                        setHour(to24Hour(h, period));
                      }
                    }}
                    data-testid="time-picker-cell"
                    data-selected={isSelected || undefined}
                  >
                    {pad(h)}
                  </button>
                );
              })}
            </div>

            {/* Separator */}
            <div
              className={sepSlot.className}
              style={sepSlot.style}
              data-testid="time-picker-separator"
            >
              :
            </div>

            {/* Minute Column */}
            <div
              className={minuteColumnSlot.className}
              style={minuteColumnSlot.style}
              data-testid="time-picker-minuteColumn"
            >
              {minuteValues.map((m) => {
                const isSelected = m === minutes;
                const cellSlot = getSlotProps('cell', cellStyle, classNames, styles);
                const cellCls = isSelected
                  ? `${cellSlot.className} ${cellSelectedStyle}`
                  : cellSlot.className;

                return (
                  <button
                    key={m}
                    type="button"
                    className={cellCls}
                    style={cellSlot.style}
                    onClick={() => setMinute(m)}
                    data-testid="time-picker-cell"
                    data-selected={isSelected || undefined}
                  >
                    {pad(m)}
                  </button>
                );
              })}
            </div>

            {/* Second Column (optional) */}
            {showSeconds && (
              <>
                <div
                  className={sepSlot.className}
                  style={sepSlot.style}
                  data-testid="time-picker-separator"
                >
                  :
                </div>
                <div
                  className={secondColumnSlot.className}
                  style={secondColumnSlot.style}
                  data-testid="time-picker-secondColumn"
                >
                  {Array.from({ length: 60 }, (_, s) => {
                    const isSelected = s === seconds;
                    const cellSlot = getSlotProps('cell', cellStyle, classNames, styles);
                    const cellCls = isSelected
                      ? `${cellSlot.className} ${cellSelectedStyle}`
                      : cellSlot.className;

                    return (
                      <button
                        key={s}
                        type="button"
                        className={cellCls}
                        style={cellSlot.style}
                        onClick={() => setSecond(s)}
                        data-testid="time-picker-cell"
                        data-selected={isSelected || undefined}
                      >
                        {pad(s)}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Period Column (12h only) */}
            {!resolved24h && (
              <div
                className={periodSlot.className}
                style={periodSlot.style}
                data-testid="time-picker-period"
              >
                {(['AM', 'PM'] as const).map((p) => {
                  const isSelected = p === period;
                  const cellSlot = getSlotProps('cell', cellStyle, classNames, styles);
                  const cellCls = isSelected
                    ? `${cellSlot.className} ${cellSelectedStyle}`
                    : cellSlot.className;

                  return (
                    <button
                      key={p}
                      type="button"
                      className={cellCls}
                      style={cellSlot.style}
                      onClick={() => setPeriod(p)}
                      data-testid="time-picker-cell"
                      data-selected={isSelected || undefined}
                    >
                      {p}
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
 * TimePicker bilesen — Dual API (props-based + compound).
 * TimePicker component — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <TimePicker defaultValue="14:30" is24h onChange={(v) => handleChange(v)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <TimePicker>
 *   <TimePicker.Input />
 *   <TimePicker.HourColumn />
 *   <TimePicker.MinuteColumn />
 *   <TimePicker.Period />
 * </TimePicker>
 * ```
 */
export const TimePicker = Object.assign(TimePickerBase, {
  Input: TimePickerInput,
  HourColumn: TimePickerHourColumn,
  MinuteColumn: TimePickerMinuteColumn,
  SecondColumn: TimePickerSecondColumn,
  Period: TimePickerPeriod,
});
