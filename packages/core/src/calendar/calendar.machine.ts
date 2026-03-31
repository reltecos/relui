/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Calendar state machine.
 *
 * @packageDocumentation
 */

import type {
  CalendarConfig,
  CalendarContext,
  CalendarEvent,
  CalendarAPI,
  CalendarView,
  CalendarEventDef,
  CalendarDay,
} from './calendar.types';

/**
 * Calendar state machine olusturur.
 * Creates a Calendar state machine.
 */
export function createCalendar(config: CalendarConfig = {}): CalendarAPI {
  const {
    defaultDate = new Date(),
    defaultView = 'month',
    events: initialEvents = [],
    onDateSelect,
    onViewChange,
    onNavigate,
  } = config;

  // ── State ──
  let currentDate = new Date(defaultDate);
  let view: CalendarView = defaultView;
  let selectedDate: Date | null = null;
  let rangeStart: Date | null = null;
  let rangeEnd: Date | null = null;
  let events: CalendarEventDef[] = [...initialEvents];

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getContext(): CalendarContext {
    return {
      currentDate: new Date(currentDate),
      view,
      selectedDate: selectedDate ? new Date(selectedDate) : null,
      rangeStart: rangeStart ? new Date(rangeStart) : null,
      rangeEnd: rangeEnd ? new Date(rangeEnd) : null,
      events: [...events],
    };
  }

  function navigatePrev(): void {
    if (view === 'month') {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    } else if (view === 'week') {
      currentDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }
    onNavigate?.(new Date(currentDate));
  }

  function navigateNext(): void {
    if (view === 'month') {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    } else if (view === 'week') {
      currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    onNavigate?.(new Date(currentDate));
  }

  function send(event: CalendarEvent): void {
    switch (event.type) {
      case 'NAVIGATE_PREV':
        navigatePrev();
        notify();
        break;
      case 'NAVIGATE_NEXT':
        navigateNext();
        notify();
        break;
      case 'SET_TODAY':
        currentDate = new Date();
        onNavigate?.(new Date(currentDate));
        notify();
        break;
      case 'SET_VIEW':
        view = event.view;
        onViewChange?.(view);
        notify();
        break;
      case 'SELECT_DATE':
        selectedDate = new Date(event.date);
        rangeStart = null;
        rangeEnd = null;
        onDateSelect?.(new Date(event.date));
        notify();
        break;
      case 'SELECT_RANGE':
        rangeStart = new Date(event.start);
        rangeEnd = new Date(event.end);
        selectedDate = null;
        notify();
        break;
      case 'CLEAR_SELECTION':
        selectedDate = null;
        rangeStart = null;
        rangeEnd = null;
        notify();
        break;
      case 'ADD_EVENT':
        events = [...events, event.event];
        notify();
        break;
      case 'REMOVE_EVENT':
        events = events.filter((e) => e.id !== event.eventId);
        notify();
        break;
      case 'SET_EVENTS':
        events = [...event.events];
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}

// ── Helpers (export) ────────────────────────────────

/** Aylik gunleri hesaplar (onceki/sonraki ay dahil) / Get month grid days */
export function getMonthDays(
  year: number,
  month: number,
  events: CalendarEventDef[],
  selectedDate: Date | null,
  weekStartsOn: 0 | 1 = 1,
): CalendarDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startOffset = firstDay.getDay() - weekStartsOn;
  if (startOffset < 0) startOffset += 7;

  const days: CalendarDay[] = [];

  // Previous month fill
  for (let i = startOffset - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    date.setHours(0, 0, 0, 0);
    days.push(makeDayInfo(date, false, today, selectedDate, events));
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    days.push(makeDayInfo(date, true, today, selectedDate, events));
  }

  // Next month fill (to complete 6 weeks = 42 cells)
  while (days.length < 42) {
    const date = new Date(year, month + 1, days.length - startOffset - lastDay.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    days.push(makeDayInfo(date, false, today, selectedDate, events));
  }

  return days;
}

function makeDayInfo(
  date: Date,
  isCurrentMonth: boolean,
  today: Date,
  selectedDate: Date | null,
  events: CalendarEventDef[],
): CalendarDay {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const dayEvents = events.filter((e) => {
    const eStart = new Date(e.start);
    const eEnd = new Date(e.end);
    return eStart <= dayEnd && eEnd >= dayStart;
  });

  const isToday = dayStart.getTime() === today.getTime();
  const isSelected = selectedDate !== null && isSameDay(dayStart, selectedDate);

  return { date: dayStart, isCurrentMonth, isToday, isSelected, events: dayEvents };
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/** Hafta gun isimlerini doner / Get weekday names */
export function getWeekdayNames(locale: string, weekStartsOn: 0 | 1 = 1): string[] {
  const names: string[] = [];
  const base = new Date(2024, 0, weekStartsOn); // 2024-01-01 is Monday
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    names.push(d.toLocaleDateString(locale, { weekday: 'short' }));
  }
  return names;
}
