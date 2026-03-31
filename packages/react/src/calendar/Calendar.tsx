/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Calendar — takvim bilesen (Dual API).
 * Calendar — calendar component (Dual API).
 *
 * Props-based: `<Calendar events={events} onDateSelect={fn} />`
 * Compound:    `<Calendar><Calendar.Header /><Calendar.Grid /></Calendar>`
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { CalendarView, CalendarEventDef } from '@relteco/relui-core';
import { ChevronLeftIcon, ChevronRightIcon } from '@relteco/relui-icons';
import {
  rootStyle, headerStyle, navigationStyle, navButtonStyle, titleStyle,
  gridStyle, weekHeaderStyle, weekDayStyle, dayCellStyle, dayCellOutsideStyle,
  todayCellStyle, selectedCellStyle, dayNumberStyle, eventStyle,
  viewSwitchStyle, viewButtonStyle, viewButtonActiveStyle,
} from './calendar.css';
import { CalendarCtx, useCalendarContext, type CalendarContextValue } from './calendar-context';
import { useCalendar, type UseCalendarProps } from './useCalendar';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type CalendarSlot = 'root' | 'header' | 'navigation' | 'grid' | 'dayCell' | 'todayCell' | 'selectedCell' | 'event' | 'weekHeader';

// ── Sub: Calendar.Header ────────────────────────────

export interface CalendarHeaderProps { className?: string; }

export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader(props, ref) {
    const { className } = props;
    const calCtx = useCalendarContext();
    const slot = getSlotProps('header', headerStyle, calCtx.classNames, calCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const navSlot = getSlotProps('navigation', navigationStyle, calCtx.classNames, calCtx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="calendar-header">
        <div className={navSlot.className} style={navSlot.style} data-testid="calendar-navigation">
          <button className={navButtonStyle} onClick={() => calCtx.api.send({ type: 'NAVIGATE_PREV' })} type="button" aria-label="Previous" data-testid="calendar-prev">
            <ChevronLeftIcon size={16} />
          </button>
          <span className={titleStyle} data-testid="calendar-title">{calCtx.monthLabel}</span>
          <button className={navButtonStyle} onClick={() => calCtx.api.send({ type: 'NAVIGATE_NEXT' })} type="button" aria-label="Next" data-testid="calendar-next">
            <ChevronRightIcon size={16} />
          </button>
        </div>
        <div className={viewSwitchStyle}>
          <button className={navButtonStyle} onClick={() => calCtx.api.send({ type: 'SET_TODAY' })} type="button" data-testid="calendar-today-btn">
            Today
          </button>
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              className={`${viewButtonStyle} ${calCtx.ctx.view === v ? viewButtonActiveStyle : ''}`}
              onClick={() => calCtx.api.send({ type: 'SET_VIEW', view: v })}
              type="button"
              data-testid={`calendar-view-${v}`}
              aria-pressed={calCtx.ctx.view === v}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

// ── Sub: Calendar.Grid ──────────────────────────────

export interface CalendarGridProps { className?: string; }

export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  function CalendarGrid(props, ref) {
    const { className } = props;
    const calCtx = useCalendarContext();
    const slot = getSlotProps('grid', gridStyle, calCtx.classNames, calCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const whSlot = getSlotProps('weekHeader', weekHeaderStyle, calCtx.classNames, calCtx.styles);
    const dcSlot = getSlotProps('dayCell', dayCellStyle, calCtx.classNames, calCtx.styles);
    const evSlot = getSlotProps('event', eventStyle, calCtx.classNames, calCtx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="calendar-grid" role="grid">
        <div className={whSlot.className} style={whSlot.style} role="row" data-testid="calendar-week-header">
          {calCtx.weekdayNames.map((name) => (
            <div key={name} className={weekDayStyle} role="columnheader">{name}</div>
          ))}
        </div>
        {calCtx.days.map((day, i) => {
          let cellCls = dcSlot.className;
          if (!day.isCurrentMonth) cellCls += ` ${dayCellOutsideStyle}`;
          if (day.isToday) cellCls += ` ${todayCellStyle}`;
          if (day.isSelected) cellCls += ` ${selectedCellStyle}`;

          return (
            <div
              key={i}
              className={cellCls}
              style={dcSlot.style}
              data-testid="calendar-day-cell"
              data-date={day.date.toISOString().split('T')[0]}
              data-today={day.isToday || undefined}
              data-selected={day.isSelected || undefined}
              role="gridcell"
              tabIndex={0}
              onClick={() => calCtx.api.send({ type: 'SELECT_DATE', date: day.date })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') calCtx.api.send({ type: 'SELECT_DATE', date: day.date }); }}
            >
              <div className={dayNumberStyle}>{day.date.getDate()}</div>
              {day.events.slice(0, 2).map((ev) => (
                <span
                  key={ev.id}
                  className={evSlot.className}
                  style={{ ...evSlot.style, backgroundColor: ev.color ?? undefined }}
                  data-testid="calendar-event"
                >
                  {ev.title}
                </span>
              ))}
              {day.events.length > 2 && (
                <span style={{ fontSize: 10, color: 'var(--rel-color-text-muted, #9ca3af)' }}>+{day.events.length - 2}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

// ── Sub: Calendar.Event ─────────────────────────────

export interface CalendarEventProps { children?: ReactNode; className?: string; }

export const CalendarEvent = forwardRef<HTMLSpanElement, CalendarEventProps>(
  function CalendarEvent(props, ref) {
    const { children, className } = props;
    const calCtx = useCalendarContext();
    const slot = getSlotProps('event', eventStyle, calCtx.classNames, calCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <span ref={ref} className={cls} style={slot.style} data-testid="calendar-event">{children}</span>;
  },
);

// ── Component Props ──────────────────────────────────

export interface CalendarComponentProps extends SlotStyleProps<CalendarSlot> {
  /** Baslangic tarihi / Default date */
  defaultDate?: Date;
  /** Gorunum modu / View mode */
  defaultView?: CalendarView;
  /** Etkinlikler / Events */
  events?: CalendarEventDef[];
  /** Locale / Locale */
  locale?: string;
  /** Hafta baslangici / Week starts on */
  weekStartsOn?: 0 | 1;
  /** Tarih secildiginde / On date select */
  onDateSelect?: (date: Date) => void;
  /** Gorunum degistiginde / On view change */
  onViewChange?: (view: CalendarView) => void;
  /** Navigasyon degistiginde / On navigate */
  onNavigate?: (date: Date) => void;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const CalendarBase = forwardRef<HTMLDivElement, CalendarComponentProps>(
  function Calendar(props, ref) {
    const {
      defaultDate, defaultView, events, locale = 'en-US', weekStartsOn = 1,
      onDateSelect, onViewChange, onNavigate,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseCalendarProps = {
      defaultDate, defaultView, events, locale, weekStartsOn,
      onDateSelect, onViewChange, onNavigate,
    };
    const { api, ctx, days, weekdayNames, monthLabel } = useCalendar(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: CalendarContextValue = { api, ctx, days, weekdayNames, locale, monthLabel, classNames, styles };

    if (children) {
      return (
        <CalendarCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="calendar-root">{children}</div>
        </CalendarCtx.Provider>
      );
    }

    return (
      <CalendarCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="calendar-root">
          <CalendarHeader />
          <CalendarGrid />
        </div>
      </CalendarCtx.Provider>
    );
  },
);

/**
 * Calendar bilesen — Dual API (props-based + compound).
 */
export const Calendar = Object.assign(CalendarBase, {
  Header: CalendarHeader,
  Grid: CalendarGrid,
  Event: CalendarEvent,
});
