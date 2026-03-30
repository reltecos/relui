/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDatePicker } from './date-picker.machine';

describe('createDatePicker', () => {
  // ── Varsayilan durum / Default state ────────────────────────────────

  it('varsayilan context ile baslar', () => {
    const picker = createDatePicker();
    const ctx = picker.getContext();
    expect(ctx.value).toBeNull();
    expect(ctx.isOpen).toBe(false);
    expect(typeof ctx.viewYear).toBe('number');
    expect(ctx.viewMonth).toBeGreaterThanOrEqual(0);
    expect(ctx.viewMonth).toBeLessThanOrEqual(11);
  });

  it('defaultValue ile baslar, viewDate secilen tarihe ayarlanir', () => {
    const picker = createDatePicker({ defaultValue: '2025-03-15' });
    const ctx = picker.getContext();
    expect(ctx.value).toBe('2025-03-15');
    expect(ctx.viewYear).toBe(2025);
    expect(ctx.viewMonth).toBe(2); // Mart = 2 (0-indexed)
  });

  it('gecersiz defaultValue durumunda bugunun tarihini kullanir', () => {
    const picker = createDatePicker({ defaultValue: 'invalid' });
    const ctx = picker.getContext();
    expect(ctx.value).toBeNull();
    const now = new Date();
    expect(ctx.viewYear).toBe(now.getFullYear());
    expect(ctx.viewMonth).toBe(now.getMonth());
  });

  // ── SELECT_DATE ─────────────────────────────────────────────────────

  it('SELECT_DATE gecerli tarihi secer', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-01' });
    picker.send({ type: 'OPEN' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-15' });
    expect(picker.getContext().value).toBe('2025-06-15');
  });

  it('SELECT_DATE secimden sonra popup kapatir', () => {
    const picker = createDatePicker();
    picker.send({ type: 'OPEN' });
    expect(picker.getContext().isOpen).toBe(true);
    picker.send({ type: 'SELECT_DATE', date: '2025-06-15' });
    expect(picker.getContext().isOpen).toBe(false);
  });

  it('SELECT_DATE onChange callback cagrilir', () => {
    const onChange = vi.fn();
    const picker = createDatePicker({ onChange });
    picker.send({ type: 'OPEN' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-15' });
    expect(onChange).toHaveBeenCalledWith('2025-06-15');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('SELECT_DATE view tarihini secilen tarihe senkronlar', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    picker.send({ type: 'SELECT_DATE', date: '2025-08-20' });
    const ctx = picker.getContext();
    expect(ctx.viewYear).toBe(2025);
    expect(ctx.viewMonth).toBe(7); // Agustos = 7
  });

  // ── SELECT_DATE — min/max dogrulama ──────────────────────────────

  it('SELECT_DATE minDate altindaki tarihi reddeder', () => {
    const onChange = vi.fn();
    const picker = createDatePicker({
      minDate: '2025-06-10',
      onChange,
    });
    picker.send({ type: 'OPEN' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-05' });
    expect(picker.getContext().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('SELECT_DATE maxDate ustundeki tarihi reddeder', () => {
    const onChange = vi.fn();
    const picker = createDatePicker({
      maxDate: '2025-06-20',
      onChange,
    });
    picker.send({ type: 'OPEN' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-25' });
    expect(picker.getContext().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('SELECT_DATE sinir tarihleri kabul eder (min ve max dahil)', () => {
    const picker = createDatePicker({
      minDate: '2025-06-10',
      maxDate: '2025-06-20',
    });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-10' });
    expect(picker.getContext().value).toBe('2025-06-10');
    picker.send({ type: 'SELECT_DATE', date: '2025-06-20' });
    expect(picker.getContext().value).toBe('2025-06-20');
  });

  // ── SELECT_DATE — disabledDates dogrulama ────────────────────────

  it('SELECT_DATE devre disi tarihi reddeder', () => {
    const onChange = vi.fn();
    const picker = createDatePicker({
      disabledDates: (date) => date === '2025-06-15',
      onChange,
    });
    picker.send({ type: 'OPEN' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-15' });
    expect(picker.getContext().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('SELECT_DATE devre disi olmayan tarihi kabul eder', () => {
    const picker = createDatePicker({
      disabledDates: (date) => date === '2025-06-15',
    });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-16' });
    expect(picker.getContext().value).toBe('2025-06-16');
  });

  // ── PREV_MONTH / NEXT_MONTH ─────────────────────────────────────

  it('PREV_MONTH ayi bir geri alir', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-01' });
    picker.send({ type: 'PREV_MONTH' });
    const ctx = picker.getContext();
    expect(ctx.viewMonth).toBe(4); // Mayis = 4
    expect(ctx.viewYear).toBe(2025);
  });

  it('PREV_MONTH Ocak ayinda Aralik ayina ve onceki yila sarar', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-15' });
    picker.send({ type: 'PREV_MONTH' });
    const ctx = picker.getContext();
    expect(ctx.viewMonth).toBe(11); // Aralik = 11
    expect(ctx.viewYear).toBe(2024);
  });

  it('NEXT_MONTH ayi bir ileri alir', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-01' });
    picker.send({ type: 'NEXT_MONTH' });
    const ctx = picker.getContext();
    expect(ctx.viewMonth).toBe(6); // Temmuz = 6
    expect(ctx.viewYear).toBe(2025);
  });

  it('NEXT_MONTH Aralik ayinda Ocak ayina ve sonraki yila sarar', () => {
    const picker = createDatePicker({ defaultValue: '2025-12-15' });
    picker.send({ type: 'NEXT_MONTH' });
    const ctx = picker.getContext();
    expect(ctx.viewMonth).toBe(0); // Ocak = 0
    expect(ctx.viewYear).toBe(2026);
  });

  // ── SET_MONTH / SET_YEAR ────────────────────────────────────────

  it('SET_MONTH dogrudan ay ayarlar', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    picker.send({ type: 'SET_MONTH', month: 8 });
    expect(picker.getContext().viewMonth).toBe(8); // Eylul
  });

  it('SET_MONTH gecersiz degeri sinirlara clamp eder', () => {
    const picker = createDatePicker();
    picker.send({ type: 'SET_MONTH', month: -1 });
    expect(picker.getContext().viewMonth).toBe(0);
    picker.send({ type: 'SET_MONTH', month: 15 });
    expect(picker.getContext().viewMonth).toBe(11);
  });

  it('SET_MONTH ayni deger icin notify etmez', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-01' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_MONTH', month: 5 }); // Zaten Haziran (5)
    expect(cb).not.toHaveBeenCalled();
  });

  it('SET_YEAR dogrudan yil ayarlar', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    picker.send({ type: 'SET_YEAR', year: 2030 });
    expect(picker.getContext().viewYear).toBe(2030);
  });

  it('SET_YEAR ayni deger icin notify etmez', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_YEAR', year: 2025 });
    expect(cb).not.toHaveBeenCalled();
  });

  // ── OPEN / CLOSE / TOGGLE ───────────────────────────────────────

  it('OPEN popup acar', () => {
    const picker = createDatePicker();
    picker.send({ type: 'OPEN' });
    expect(picker.getContext().isOpen).toBe(true);
  });

  it('OPEN zaten aciksa notify etmez', () => {
    const picker = createDatePicker();
    picker.send({ type: 'OPEN' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'OPEN' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('CLOSE popup kapatir', () => {
    const picker = createDatePicker();
    picker.send({ type: 'OPEN' });
    picker.send({ type: 'CLOSE' });
    expect(picker.getContext().isOpen).toBe(false);
  });

  it('CLOSE zaten kapaliysa notify etmez', () => {
    const picker = createDatePicker();
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'CLOSE' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('TOGGLE durumu degistirir', () => {
    const picker = createDatePicker();
    picker.send({ type: 'TOGGLE' });
    expect(picker.getContext().isOpen).toBe(true);
    picker.send({ type: 'TOGGLE' });
    expect(picker.getContext().isOpen).toBe(false);
  });

  it('onOpenChange callback dogru cagrilir', () => {
    const onOpenChange = vi.fn();
    const picker = createDatePicker({ onOpenChange });
    picker.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    picker.send({ type: 'CLOSE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('TOGGLE onOpenChange callback cagrilir', () => {
    const onOpenChange = vi.fn();
    const picker = createDatePicker({ onOpenChange });
    picker.send({ type: 'TOGGLE' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    picker.send({ type: 'TOGGLE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── SET_VIEW_DATE ───────────────────────────────────────────────

  it('SET_VIEW_DATE view tarihini ayarlar', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    picker.send({ type: 'SET_VIEW_DATE', date: '2026-09-15' });
    const ctx = picker.getContext();
    expect(ctx.viewYear).toBe(2026);
    expect(ctx.viewMonth).toBe(8); // Eylul = 8
  });

  it('SET_VIEW_DATE gecersiz tarih icin sessiz kalir', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_VIEW_DATE', date: 'invalid' });
    expect(cb).not.toHaveBeenCalled();
    expect(picker.getContext().viewYear).toBe(2025);
  });

  it('SET_VIEW_DATE ayni deger icin notify etmez', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-15' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_VIEW_DATE', date: '2025-06-01' }); // Ayni ay/yil
    expect(cb).not.toHaveBeenCalled();
  });

  // ── SET_VALUE ───────────────────────────────────────────────────

  it('SET_VALUE degeri disaridan ayarlar', () => {
    const picker = createDatePicker();
    picker.send({ type: 'SET_VALUE', value: '2025-08-20' });
    expect(picker.getContext().value).toBe('2025-08-20');
  });

  it('SET_VALUE null ile degeri temizler', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-15' });
    picker.send({ type: 'SET_VALUE', value: null });
    expect(picker.getContext().value).toBeNull();
  });

  it('SET_VALUE ayni deger icin notify etmez', () => {
    const picker = createDatePicker({ defaultValue: '2025-06-15' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_VALUE', value: '2025-06-15' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('SET_VALUE view tarihini secilen tarihe senkronlar', () => {
    const picker = createDatePicker({ defaultValue: '2025-01-01' });
    picker.send({ type: 'SET_VALUE', value: '2026-11-20' });
    const ctx = picker.getContext();
    expect(ctx.viewYear).toBe(2026);
    expect(ctx.viewMonth).toBe(10); // Kasim = 10
  });

  // ── SET_MIN / SET_MAX ───────────────────────────────────────────

  it('SET_MIN yeni sinir ayarlar, sinir disindaki secim reddedilir', () => {
    const picker = createDatePicker();
    picker.send({ type: 'SET_MIN', date: '2025-06-10' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-05' });
    expect(picker.getContext().value).toBeNull();
  });

  it('SET_MAX yeni sinir ayarlar, sinir disindaki secim reddedilir', () => {
    const picker = createDatePicker();
    picker.send({ type: 'SET_MAX', date: '2025-06-20' });
    picker.send({ type: 'SELECT_DATE', date: '2025-06-25' });
    expect(picker.getContext().value).toBeNull();
  });

  it('SET_MIN ayni deger icin notify etmez', () => {
    const picker = createDatePicker({ minDate: '2025-01-01' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_MIN', date: '2025-01-01' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('SET_MAX ayni deger icin notify etmez', () => {
    const picker = createDatePicker({ maxDate: '2025-12-31' });
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.send({ type: 'SET_MAX', date: '2025-12-31' });
    expect(cb).not.toHaveBeenCalled();
  });

  // ── Subscribe / Unsubscribe ─────────────────────────────────────

  it('subscribe ile dinler, unsubscribe ile iptal eder', () => {
    const picker = createDatePicker();
    const cb = vi.fn();
    const unsub = picker.subscribe(cb);
    picker.send({ type: 'OPEN' });
    expect(cb).toHaveBeenCalledTimes(1);
    unsub();
    picker.send({ type: 'CLOSE' });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('birden fazla subscriber destekler', () => {
    const picker = createDatePicker();
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    picker.subscribe(cb1);
    picker.subscribe(cb2);
    picker.send({ type: 'OPEN' });
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  // ── Destroy ─────────────────────────────────────────────────────

  it('destroy tum dinleyicileri temizler', () => {
    const picker = createDatePicker();
    const cb = vi.fn();
    picker.subscribe(cb);
    picker.destroy();
    picker.send({ type: 'OPEN' });
    expect(cb).not.toHaveBeenCalled();
  });

  // ── SELECT_DATE + onOpenChange ──────────────────────────────────

  it('SELECT_DATE kapanirken onOpenChange(false) cagrilir', () => {
    const onOpenChange = vi.fn();
    const picker = createDatePicker({ onOpenChange });
    picker.send({ type: 'OPEN' });
    onOpenChange.mockClear();
    picker.send({ type: 'SELECT_DATE', date: '2025-06-15' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
