/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createCalendar, getMonthDays, getWeekdayNames } from './calendar.machine';
import type { CalendarEventDef } from './calendar.types';

describe('createCalendar', () => {
  const fixedDate = new Date(2025, 2, 15); // March 15, 2025

  // ── Initial state ──

  it('baslangic state dogru', () => {
    const api = createCalendar({ defaultDate: fixedDate });
    const ctx = api.getContext();
    expect(ctx.view).toBe('month');
    expect(ctx.selectedDate).toBeNull();
    expect(ctx.rangeStart).toBeNull();
    expect(ctx.rangeEnd).toBeNull();
    expect(ctx.events).toEqual([]);
  });

  it('defaultView ayarlanir', () => {
    const api = createCalendar({ defaultView: 'week' });
    expect(api.getContext().view).toBe('week');
  });

  it('baslangic events set edilir', () => {
    const ev: CalendarEventDef = { id: '1', title: 'Test', start: new Date(), end: new Date() };
    const api = createCalendar({ events: [ev] });
    expect(api.getContext().events).toHaveLength(1);
  });

  // ── Navigation ──

  it('NAVIGATE_NEXT ay ilerletir', () => {
    const api = createCalendar({ defaultDate: fixedDate });
    api.send({ type: 'NAVIGATE_NEXT' });
    expect(api.getContext().currentDate.getMonth()).toBe(3); // April
  });

  it('NAVIGATE_PREV ay geriletir', () => {
    const api = createCalendar({ defaultDate: fixedDate });
    api.send({ type: 'NAVIGATE_PREV' });
    expect(api.getContext().currentDate.getMonth()).toBe(1); // February
  });

  it('week gorunumunde NAVIGATE_NEXT 7 gun ilerletir', () => {
    const api = createCalendar({ defaultDate: fixedDate, defaultView: 'week' });
    api.send({ type: 'NAVIGATE_NEXT' });
    const diff = api.getContext().currentDate.getTime() - fixedDate.getTime();
    expect(Math.round(diff / (24 * 60 * 60 * 1000))).toBe(7);
  });

  it('day gorunumunde NAVIGATE_NEXT 1 gun ilerletir', () => {
    const api = createCalendar({ defaultDate: fixedDate, defaultView: 'day' });
    api.send({ type: 'NAVIGATE_NEXT' });
    expect(api.getContext().currentDate.getDate()).toBe(16);
  });

  it('SET_TODAY bugune doner', () => {
    const api = createCalendar({ defaultDate: new Date(2020, 0, 1) });
    api.send({ type: 'SET_TODAY' });
    const today = new Date();
    expect(api.getContext().currentDate.getFullYear()).toBe(today.getFullYear());
  });

  it('onNavigate callback cagrilir', () => {
    const onNavigate = vi.fn();
    const api = createCalendar({ defaultDate: fixedDate, onNavigate });
    api.send({ type: 'NAVIGATE_NEXT' });
    expect(onNavigate).toHaveBeenCalled();
  });

  // ── View ──

  it('SET_VIEW gorunumu degistirir', () => {
    const api = createCalendar();
    api.send({ type: 'SET_VIEW', view: 'week' });
    expect(api.getContext().view).toBe('week');
  });

  it('onViewChange callback cagrilir', () => {
    const onViewChange = vi.fn();
    const api = createCalendar({ onViewChange });
    api.send({ type: 'SET_VIEW', view: 'day' });
    expect(onViewChange).toHaveBeenCalledWith('day');
  });

  // ── Selection ──

  it('SELECT_DATE tarih secer', () => {
    const api = createCalendar();
    const date = new Date(2025, 5, 10);
    api.send({ type: 'SELECT_DATE', date });
    expect(api.getContext().selectedDate?.getDate()).toBe(10);
  });

  it('SELECT_RANGE aralik secer', () => {
    const api = createCalendar();
    const start = new Date(2025, 5, 1);
    const end = new Date(2025, 5, 7);
    api.send({ type: 'SELECT_RANGE', start, end });
    expect(api.getContext().rangeStart).not.toBeNull();
    expect(api.getContext().rangeEnd).not.toBeNull();
  });

  it('SELECT_DATE range secimini temizler', () => {
    const api = createCalendar();
    api.send({ type: 'SELECT_RANGE', start: new Date(), end: new Date() });
    api.send({ type: 'SELECT_DATE', date: new Date() });
    expect(api.getContext().rangeStart).toBeNull();
    expect(api.getContext().rangeEnd).toBeNull();
  });

  it('CLEAR_SELECTION tum secimleri temizler', () => {
    const api = createCalendar();
    api.send({ type: 'SELECT_DATE', date: new Date() });
    api.send({ type: 'CLEAR_SELECTION' });
    expect(api.getContext().selectedDate).toBeNull();
  });

  it('onDateSelect callback cagrilir', () => {
    const onDateSelect = vi.fn();
    const api = createCalendar({ onDateSelect });
    api.send({ type: 'SELECT_DATE', date: new Date(2025, 0, 1) });
    expect(onDateSelect).toHaveBeenCalled();
  });

  // ── Events ──

  it('ADD_EVENT etkinlik ekler', () => {
    const api = createCalendar();
    api.send({ type: 'ADD_EVENT', event: { id: 'e1', title: 'Meeting', start: new Date(), end: new Date() } });
    expect(api.getContext().events).toHaveLength(1);
  });

  it('REMOVE_EVENT etkinlik siler', () => {
    const ev: CalendarEventDef = { id: 'e1', title: 'M', start: new Date(), end: new Date() };
    const api = createCalendar({ events: [ev] });
    api.send({ type: 'REMOVE_EVENT', eventId: 'e1' });
    expect(api.getContext().events).toHaveLength(0);
  });

  it('SET_EVENTS etkinlikleri degistirir', () => {
    const api = createCalendar();
    api.send({ type: 'SET_EVENTS', events: [
      { id: '1', title: 'A', start: new Date(), end: new Date() },
      { id: '2', title: 'B', start: new Date(), end: new Date() },
    ] });
    expect(api.getContext().events).toHaveLength(2);
  });

  // ── Subscribe ──

  it('subscribe bildirim alir', () => {
    const api = createCalendar();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'NAVIGATE_NEXT' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('unsubscribe sonrasi bildirim alinmaz', () => {
    const api = createCalendar();
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    unsub();
    api.send({ type: 'NAVIGATE_NEXT' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const api = createCalendar();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'NAVIGATE_NEXT' });
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('getMonthDays', () => {
  it('42 gun doner (6 hafta grid)', () => {
    const days = getMonthDays(2025, 2, [], null);
    expect(days).toHaveLength(42);
  });

  it('ilk gun lineNumber 1 den baslar', () => {
    const days = getMonthDays(2025, 2, [], null);
    expect(days[0].date).toBeInstanceOf(Date);
  });

  it('mevcut ay gunlerini isCurrentMonth true olarak isaretle', () => {
    const days = getMonthDays(2025, 2, [], null);
    const marchDays = days.filter((d) => d.isCurrentMonth);
    expect(marchDays).toHaveLength(31);
  });

  it('bugun isToday true', () => {
    const today = new Date();
    const days = getMonthDays(today.getFullYear(), today.getMonth(), [], null);
    const todayCell = days.find((d) => d.isToday);
    expect(todayCell).toBeDefined();
  });

  it('secili tarih isSelected true', () => {
    const sel = new Date(2025, 2, 10);
    const days = getMonthDays(2025, 2, [], sel);
    const selected = days.find((d) => d.isSelected);
    expect(selected).toBeDefined();
    expect(selected?.date.getDate()).toBe(10);
  });

  it('etkinlikler gune atanir', () => {
    const ev: CalendarEventDef = {
      id: '1', title: 'Test',
      start: new Date(2025, 2, 10, 9, 0),
      end: new Date(2025, 2, 10, 17, 0),
    };
    const days = getMonthDays(2025, 2, [ev], null);
    const day10 = days.find((d) => d.isCurrentMonth && d.date.getDate() === 10);
    expect(day10?.events).toHaveLength(1);
  });
});

describe('getWeekdayNames', () => {
  it('7 gun ismi doner', () => {
    const names = getWeekdayNames('en-US');
    expect(names).toHaveLength(7);
  });

  it('locale ye gore isim degisir', () => {
    const en = getWeekdayNames('en-US');
    const tr = getWeekdayNames('tr-TR');
    expect(en[0]).not.toBe(tr[0]);
  });
});
