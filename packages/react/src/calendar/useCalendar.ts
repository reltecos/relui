/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useMemo } from 'react';
import {
  createCalendar,
  getMonthDays,
  getWeekdayNames,
  type CalendarAPI,
  type CalendarContext,
  type CalendarDay,
  type CalendarEventDef,
  type CalendarView,
} from '@relteco/relui-core';

export interface UseCalendarProps {
  defaultDate?: Date;
  defaultView?: CalendarView;
  events?: CalendarEventDef[];
  locale?: string;
  weekStartsOn?: 0 | 1;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  onNavigate?: (date: Date) => void;
}

export interface UseCalendarReturn {
  api: CalendarAPI;
  ctx: CalendarContext;
  days: CalendarDay[];
  weekdayNames: string[];
  monthLabel: string;
}

export function useCalendar(props: UseCalendarProps): UseCalendarReturn {
  const {
    defaultDate,
    defaultView,
    events,
    locale = 'en-US',
    weekStartsOn = 1,
    onDateSelect,
    onViewChange,
    onNavigate,
  } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<CalendarAPI | null>(null);
  const prevRef = useRef<UseCalendarProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createCalendar({
      defaultDate,
      defaultView,
      events,
      onDateSelect,
      onViewChange,
      onNavigate,
    });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  // Prop sync: events
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.events !== props.events && props.events !== undefined) {
      api.send({ type: 'SET_EVENTS', events: props.events });
      forceRender();
    }
    prevRef.current = props;
  });

  const ctx = api.getContext();

  const days = useMemo(() => {
    return getMonthDays(
      ctx.currentDate.getFullYear(),
      ctx.currentDate.getMonth(),
      ctx.events as CalendarEventDef[],
      ctx.selectedDate as Date | null,
      weekStartsOn,
    );
  }, [ctx.currentDate, ctx.events, ctx.selectedDate, weekStartsOn]);

  const weekdayNames = useMemo(() => getWeekdayNames(locale, weekStartsOn), [locale, weekStartsOn]);

  const monthLabel = useMemo(() => {
    return ctx.currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }, [ctx.currentDate, locale]);

  return { api, ctx, days, weekdayNames, monthLabel };
}
