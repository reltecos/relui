/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Clock — analog/dijital saat bilesen (Dual API).
 * Clock — analog/digital clock component (Dual API).
 *
 * Props-based: `<Clock mode="digital" is24h showSeconds />`
 * Compound:    `<Clock><Clock.Face /><Clock.Digital /><Clock.Period /></Clock>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  rootStyle,
  sizeStyles,
  digitalStyle,
  periodStyle,
  faceStyle,
  faceSizeStyles,
  hourHandStyle,
  minuteHandStyle,
  secondHandStyle,
} from './clock.css';
import { useClock, type UseClockProps } from './useClock';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Clock slot isimleri / Clock slot names. */
export type ClockSlot =
  | 'root'
  | 'face'
  | 'digital'
  | 'hourHand'
  | 'minuteHand'
  | 'secondHand'
  | 'period';

// ── Types ────────────────────────────────────────────

/** Clock modu / Clock mode */
export type ClockMode = 'analog' | 'digital';

/** Clock boyutu / Clock size */
export type ClockSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface ClockContextValue {
  hours: number;
  minutes: number;
  seconds: number;
  period: 'AM' | 'PM';
  is24h: boolean;
  rawHours: number;
  size: ClockSize;
  showSeconds: boolean;
  classNames: ClassNames<ClockSlot> | undefined;
  styles: Styles<ClockSlot> | undefined;
}

const ClockContext = createContext<ClockContextValue | null>(null);

function useClockContext(): ClockContextValue {
  const ctx = useContext(ClockContext);
  if (!ctx) throw new Error('Clock compound sub-components must be used within <Clock>.');
  return ctx;
}

// ── Helpers ──────────────────────────────────────────

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

// ── Compound: Clock.Face (Analog SVG) ────────────────

/** Clock.Face props */
export interface ClockFaceProps {
  /** Ek className / Additional className */
  className?: string;
}

const ClockFace = forwardRef<HTMLDivElement, ClockFaceProps>(
  function ClockFace(props, ref) {
    const { className } = props;
    const ctx = useClockContext();
    const slot = getSlotProps('face', `${faceStyle} ${faceSizeStyles[ctx.size]}`, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const hourAngle = ((ctx.rawHours % 12) + ctx.minutes / 60) * 30;
    const minuteAngle = (ctx.minutes + ctx.seconds / 60) * 6;
    const secondAngle = ctx.seconds * 6;

    const hourSlot = getSlotProps('hourHand', hourHandStyle, ctx.classNames, ctx.styles);
    const minuteSlot = getSlotProps('minuteHand', minuteHandStyle, ctx.classNames, ctx.styles);
    const secondSlot = getSlotProps('secondHand', secondHandStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="clock-face">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {/* Face circle */}
          <circle cx="50" cy="50" r="48" fill="var(--rel-color-bg, #ffffff)" stroke="var(--rel-color-border, #e5e7eb)" strokeWidth="2" />

          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 50 + 40 * Math.sin(angle);
            const y1 = 50 - 40 * Math.cos(angle);
            const x2 = 50 + 44 * Math.sin(angle);
            const y2 = 50 - 44 * Math.cos(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--rel-color-text, #374151)"
                strokeWidth={i % 3 === 0 ? 2 : 1}
              />
            );
          })}

          {/* Center dot */}
          <circle cx="50" cy="50" r="2.5" fill="var(--rel-color-text, #374151)" />

          {/* Hour hand */}
          <line
            x1="50" y1="50" x2="50" y2="24"
            stroke="var(--rel-color-text, #374151)"
            strokeWidth="3"
            strokeLinecap="round"
            className={hourSlot.className}
            style={{ ...hourSlot.style, transform: `rotate(${hourAngle}deg)`, transformOrigin: '50px 50px' }}
            data-testid="clock-hourHand"
          />

          {/* Minute hand */}
          <line
            x1="50" y1="50" x2="50" y2="16"
            stroke="var(--rel-color-text-secondary, #6b7280)"
            strokeWidth="2"
            strokeLinecap="round"
            className={minuteSlot.className}
            style={{ ...minuteSlot.style, transform: `rotate(${minuteAngle}deg)`, transformOrigin: '50px 50px' }}
            data-testid="clock-minuteHand"
          />

          {/* Second hand */}
          {ctx.showSeconds && (
            <line
              x1="50" y1="50" x2="50" y2="12"
              stroke="var(--rel-color-error, #ef4444)"
              strokeWidth="1"
              strokeLinecap="round"
              className={secondSlot.className}
              style={{ ...secondSlot.style, transform: `rotate(${secondAngle}deg)`, transformOrigin: '50px 50px' }}
              data-testid="clock-secondHand"
            />
          )}
        </svg>
      </div>
    );
  },
);

// ── Compound: Clock.Digital ──────────────────────────

/** Clock.Digital props */
export interface ClockDigitalProps {
  /** Ek className / Additional className */
  className?: string;
}

const ClockDigital = forwardRef<HTMLSpanElement, ClockDigitalProps>(
  function ClockDigital(props, ref) {
    const { className } = props;
    const ctx = useClockContext();
    const slot = getSlotProps('digital', digitalStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const time = ctx.showSeconds
      ? `${pad(ctx.hours)}:${pad(ctx.minutes)}:${pad(ctx.seconds)}`
      : `${pad(ctx.hours)}:${pad(ctx.minutes)}`;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="clock-digital">
        {time}
      </span>
    );
  },
);

// ── Compound: Clock.Period ───────────────────────────

/** Clock.Period props */
export interface ClockPeriodProps {
  /** Ek className / Additional className */
  className?: string;
}

const ClockPeriod = forwardRef<HTMLSpanElement, ClockPeriodProps>(
  function ClockPeriod(props, ref) {
    const { className } = props;
    const ctx = useClockContext();
    const slot = getSlotProps('period', periodStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (ctx.is24h) return null;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="clock-period">
        {ctx.period}
      </span>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface ClockComponentProps extends SlotStyleProps<ClockSlot> {
  /** Gosterim modu / Display mode */
  mode?: ClockMode;
  /** 24 saat formati / 24-hour format */
  is24h?: boolean;
  /** Saat dilimi / Timezone */
  timezone?: string;
  /** Saniyeleri goster / Show seconds */
  showSeconds?: boolean;
  /** Boyut / Size */
  size?: ClockSize;
  /** Tick araligi (ms) / Tick interval */
  tickInterval?: number;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const ClockBase = forwardRef<HTMLDivElement, ClockComponentProps>(
  function Clock(props, ref) {
    const {
      mode = 'digital',
      is24h = false,
      timezone,
      showSeconds = true,
      size = 'md',
      tickInterval,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseClockProps = {
      is24h,
      timezone,
      tickInterval,
    };
    const clock = useClock(hookProps);

    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: ClockContextValue = {
      hours: clock.hours,
      minutes: clock.minutes,
      seconds: clock.seconds,
      period: clock.period,
      is24h: clock.is24h,
      rawHours: clock.rawHours,
      size,
      showSeconds,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <ClockContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            role="timer"
            aria-label="Clock"
            data-testid="clock-root"
            data-size={size}
            data-mode={mode}
          >
            {children}
          </div>
        </ClockContext.Provider>
      );
    }

    // ── Props-based API ──
    const time = showSeconds
      ? `${pad(clock.hours)}:${pad(clock.minutes)}:${pad(clock.seconds)}`
      : `${pad(clock.hours)}:${pad(clock.minutes)}`;

    if (mode === 'analog') {
      const hourAngle = ((clock.rawHours % 12) + clock.minutes / 60) * 30;
      const minuteAngle = (clock.minutes + clock.seconds / 60) * 6;
      const secondAngle = clock.seconds * 6;

      const faceSlot = getSlotProps('face', `${faceStyle} ${faceSizeStyles[size]}`, classNames, styles);
      const hourSlot = getSlotProps('hourHand', hourHandStyle, classNames, styles);
      const minuteSlot = getSlotProps('minuteHand', minuteHandStyle, classNames, styles);
      const secondSlot = getSlotProps('secondHand', secondHandStyle, classNames, styles);

      return (
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          role="timer"
          aria-label="Clock"
          data-testid="clock-root"
          data-size={size}
          data-mode="analog"
        >
          <div className={faceSlot.className} style={faceSlot.style} data-testid="clock-face">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="48" fill="var(--rel-color-bg, #ffffff)" stroke="var(--rel-color-border, #e5e7eb)" strokeWidth="2" />
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 50 + 40 * Math.sin(angle);
                const y1 = 50 - 40 * Math.cos(angle);
                const x2 = 50 + 44 * Math.sin(angle);
                const y2 = 50 - 44 * Math.cos(angle);
                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="var(--rel-color-text, #374151)"
                    strokeWidth={i % 3 === 0 ? 2 : 1}
                  />
                );
              })}
              <circle cx="50" cy="50" r="2.5" fill="var(--rel-color-text, #374151)" />
              <line
                x1="50" y1="50" x2="50" y2="24"
                stroke="var(--rel-color-text, #374151)" strokeWidth="3" strokeLinecap="round"
                className={hourSlot.className}
                style={{ ...hourSlot.style, transform: `rotate(${hourAngle}deg)`, transformOrigin: '50px 50px' }}
                data-testid="clock-hourHand"
              />
              <line
                x1="50" y1="50" x2="50" y2="16"
                stroke="var(--rel-color-text-secondary, #6b7280)" strokeWidth="2" strokeLinecap="round"
                className={minuteSlot.className}
                style={{ ...minuteSlot.style, transform: `rotate(${minuteAngle}deg)`, transformOrigin: '50px 50px' }}
                data-testid="clock-minuteHand"
              />
              {showSeconds && (
                <line
                  x1="50" y1="50" x2="50" y2="12"
                  stroke="var(--rel-color-error, #ef4444)" strokeWidth="1" strokeLinecap="round"
                  className={secondSlot.className}
                  style={{ ...secondSlot.style, transform: `rotate(${secondAngle}deg)`, transformOrigin: '50px 50px' }}
                  data-testid="clock-secondHand"
                />
              )}
            </svg>
          </div>
        </div>
      );
    }

    // ── Digital ──
    const digiSlot = getSlotProps('digital', digitalStyle, classNames, styles);
    const perSlot = getSlotProps('period', periodStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        role="timer"
        aria-label="Clock"
        data-testid="clock-root"
        data-size={size}
        data-mode="digital"
      >
        <span className={digiSlot.className} style={digiSlot.style} data-testid="clock-digital">
          {time}
        </span>
        {!is24h && (
          <span className={perSlot.className} style={perSlot.style} data-testid="clock-period">
            {clock.period}
          </span>
        )}
      </div>
    );
  },
);

/**
 * Clock bilesen — Dual API (props-based + compound).
 *
 * @example Props-based (Digital)
 * ```tsx
 * <Clock mode="digital" is24h showSeconds />
 * ```
 *
 * @example Props-based (Analog)
 * ```tsx
 * <Clock mode="analog" size="lg" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Clock>
 *   <Clock.Face />
 *   <Clock.Digital />
 *   <Clock.Period />
 * </Clock>
 * ```
 */
export const Clock = Object.assign(ClockBase, {
  Face: ClockFace,
  Digital: ClockDigital,
  Period: ClockPeriod,
});
