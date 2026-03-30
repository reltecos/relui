/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDateRangePicker } from './date-range-picker.machine';

describe('createDateRangePicker', () => {
  // ── Init ──

  it('varsayilan context doner', () => {
    const api = createDateRangePicker();
    const ctx = api.getContext();
    expect(ctx.startDate).toBeNull();
    expect(ctx.endDate).toBeNull();
    expect(ctx.isOpen).toBe(false);
    expect(ctx.selectingField).toBe('start');
    api.destroy();
  });

  it('defaultStartDate ve defaultEndDate ile baslar', () => {
    const api = createDateRangePicker({
      defaultStartDate: '2025-03-01',
      defaultEndDate: '2025-03-15',
    });
    const ctx = api.getContext();
    expect(ctx.startDate).toBe('2025-03-01');
    expect(ctx.endDate).toBe('2025-03-15');
    expect(ctx.viewYear).toBe(2025);
    expect(ctx.viewMonth).toBe(2);
    api.destroy();
  });

  // ── OPEN / CLOSE / TOGGLE ──

  it('OPEN acik duruma getirir', () => {
    const api = createDateRangePicker();
    api.send({ type: 'OPEN' });
    expect(api.getContext().isOpen).toBe(true);
    api.destroy();
  });

  it('CLOSE kapali duruma getirir', () => {
    const api = createDateRangePicker();
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().isOpen).toBe(false);
    api.destroy();
  });

  it('TOGGLE durumu degistirir', () => {
    const api = createDateRangePicker();
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().isOpen).toBe(true);
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().isOpen).toBe(false);
    api.destroy();
  });

  it('onOpenChange callback cagirilir', () => {
    const onOpenChange = vi.fn();
    const api = createDateRangePicker({ onOpenChange });
    api.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    api.destroy();
  });

  // ── SELECT_DATE ──

  it('ilk SELECT_DATE startDate ayarlar', () => {
    const api = createDateRangePicker();
    api.send({ type: 'SELECT_DATE', date: '2025-06-10' });
    const ctx = api.getContext();
    expect(ctx.startDate).toBe('2025-06-10');
    expect(ctx.endDate).toBeNull();
    expect(ctx.selectingField).toBe('end');
    api.destroy();
  });

  it('ikinci SELECT_DATE endDate ayarlar ve kapatir', () => {
    const onChange = vi.fn();
    const api = createDateRangePicker({ onChange });
    api.send({ type: 'SELECT_DATE', date: '2025-06-10' });
    api.send({ type: 'SELECT_DATE', date: '2025-06-20' });
    const ctx = api.getContext();
    expect(ctx.startDate).toBe('2025-06-10');
    expect(ctx.endDate).toBe('2025-06-20');
    expect(ctx.isOpen).toBe(false);
    expect(onChange).toHaveBeenCalledWith('2025-06-10', '2025-06-20');
    api.destroy();
  });

  it('endDate startDate den once ise startDate olarak set edilir', () => {
    const api = createDateRangePicker();
    api.send({ type: 'SELECT_DATE', date: '2025-06-20' });
    api.send({ type: 'SELECT_DATE', date: '2025-06-05' });
    const ctx = api.getContext();
    expect(ctx.startDate).toBe('2025-06-05');
    expect(ctx.endDate).toBeNull();
    expect(ctx.selectingField).toBe('end');
    api.destroy();
  });

  it('disabled tarih secilmez', () => {
    const api = createDateRangePicker({
      disabledDates: (d) => d === '2025-06-15',
    });
    api.send({ type: 'SELECT_DATE', date: '2025-06-15' });
    expect(api.getContext().startDate).toBeNull();
    api.destroy();
  });

  it('minDate altindaki tarih secilmez', () => {
    const api = createDateRangePicker({ minDate: '2025-06-10' });
    api.send({ type: 'SELECT_DATE', date: '2025-06-05' });
    expect(api.getContext().startDate).toBeNull();
    api.destroy();
  });

  it('maxDate ustundeki tarih secilmez', () => {
    const api = createDateRangePicker({ maxDate: '2025-06-20' });
    api.send({ type: 'SELECT_DATE', date: '2025-06-25' });
    expect(api.getContext().startDate).toBeNull();
    api.destroy();
  });

  // ── PREV_MONTH / NEXT_MONTH ──

  it('PREV_MONTH ayi geri alir', () => {
    const api = createDateRangePicker({ defaultStartDate: '2025-03-15' });
    api.send({ type: 'PREV_MONTH' });
    expect(api.getContext().viewMonth).toBe(1);
    api.destroy();
  });

  it('NEXT_MONTH ayi ileri alir', () => {
    const api = createDateRangePicker({ defaultStartDate: '2025-03-15' });
    api.send({ type: 'NEXT_MONTH' });
    expect(api.getContext().viewMonth).toBe(3);
    api.destroy();
  });

  it('PREV_MONTH Ocak da yil geri sarar', () => {
    const api = createDateRangePicker({ defaultStartDate: '2025-01-15' });
    api.send({ type: 'PREV_MONTH' });
    expect(api.getContext().viewMonth).toBe(11);
    expect(api.getContext().viewYear).toBe(2024);
    api.destroy();
  });

  it('NEXT_MONTH Aralik ta yil ileri sarar', () => {
    const api = createDateRangePicker({ defaultStartDate: '2025-12-15' });
    api.send({ type: 'NEXT_MONTH' });
    expect(api.getContext().viewMonth).toBe(0);
    expect(api.getContext().viewYear).toBe(2026);
    api.destroy();
  });

  // ── SET_PRESET ──

  it('SET_PRESET baslangic ve bitis tarihlerini ayarlar', () => {
    const onChange = vi.fn();
    const api = createDateRangePicker({ onChange });
    api.send({
      type: 'SET_PRESET',
      preset: { label: 'Son 7 gun', startDate: '2025-06-08', endDate: '2025-06-15' },
    });
    const ctx = api.getContext();
    expect(ctx.startDate).toBe('2025-06-08');
    expect(ctx.endDate).toBe('2025-06-15');
    expect(onChange).toHaveBeenCalledWith('2025-06-08', '2025-06-15');
    api.destroy();
  });

  // ── SET_VALUE ──

  it('SET_VALUE disaridan deger ayarlar', () => {
    const api = createDateRangePicker();
    api.send({ type: 'SET_VALUE', startDate: '2025-01-01', endDate: '2025-01-31' });
    const ctx = api.getContext();
    expect(ctx.startDate).toBe('2025-01-01');
    expect(ctx.endDate).toBe('2025-01-31');
    api.destroy();
  });

  // ── CLEAR ──

  it('CLEAR degerleri temizler', () => {
    const onChange = vi.fn();
    const api = createDateRangePicker({
      defaultStartDate: '2025-06-01',
      defaultEndDate: '2025-06-15',
      onChange,
    });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().startDate).toBeNull();
    expect(api.getContext().endDate).toBeNull();
    expect(onChange).toHaveBeenCalledWith(null, null);
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createDateRangePicker();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createDateRangePicker();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Destroy ──

  it('destroy listeners temizler', () => {
    const api = createDateRangePicker();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });
});
