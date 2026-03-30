/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTimePicker } from './time-picker.machine';

describe('createTimePicker', () => {
  // ──────────────────────────────────────────
  // Init / Default context
  // ──────────────────────────────────────────

  it('creates with default context (00:00, 12h)', () => {
    const tp = createTimePicker();
    const ctx = tp.getContext();

    expect(ctx.hours).toBe(12); // 0 in 12h = 12
    expect(ctx.minutes).toBe(0);
    expect(ctx.seconds).toBe(0);
    expect(ctx.period).toBe('AM');
    expect(ctx.is24h).toBe(false);
    expect(ctx.isOpen).toBe(false);
    expect(ctx.value).toBeNull();
  });

  it('parses defaultValue correctly', () => {
    const tp = createTimePicker({ defaultValue: '14:30' });
    const ctx = tp.getContext();

    expect(ctx.hours).toBe(2); // 14 in 12h = 2
    expect(ctx.minutes).toBe(30);
    expect(ctx.period).toBe('PM');
    expect(ctx.value).toBe('14:30');
  });

  it('parses defaultValue with seconds', () => {
    const tp = createTimePicker({ defaultValue: '09:15:45', showSeconds: true });
    const ctx = tp.getContext();

    expect(ctx.hours).toBe(9);
    expect(ctx.minutes).toBe(15);
    expect(ctx.seconds).toBe(45);
    expect(ctx.value).toBe('09:15:45');
  });

  // ──────────────────────────────────────────
  // SET_HOUR
  // ──────────────────────────────────────────

  it('SET_HOUR sets a valid hour', () => {
    const tp = createTimePicker();
    tp.send({ type: 'SET_HOUR', hour: 15 });

    expect(tp.getContext().value).toBe('15:00');
  });

  it('SET_HOUR clamps out-of-range hour', () => {
    const tp = createTimePicker();
    tp.send({ type: 'SET_HOUR', hour: 30 });

    expect(tp.getContext().value).toBe('23:00');
  });

  it('SET_HOUR clamps negative hour to 0', () => {
    const tp = createTimePicker({ defaultValue: '10:00' });
    tp.send({ type: 'SET_HOUR', hour: -5 });

    expect(tp.getContext().value).toBe('00:00');
  });

  // ──────────────────────────────────────────
  // SET_MINUTE
  // ──────────────────────────────────────────

  it('SET_MINUTE sets a valid minute', () => {
    const tp = createTimePicker();
    tp.send({ type: 'SET_MINUTE', minute: 45 });

    expect(tp.getContext().minutes).toBe(45);
  });

  it('SET_MINUTE snaps to step', () => {
    const tp = createTimePicker({ step: 15 });
    tp.send({ type: 'SET_MINUTE', minute: 22 });

    // 22 snaps to 15 (nearest step of 15)
    // Math.round(22/15)*15 = Math.round(1.47)*15 = 1*15 = 15
    expect(tp.getContext().minutes).toBe(15);
  });

  it('SET_MINUTE snaps to step (rounds up)', () => {
    const tp = createTimePicker({ step: 15 });
    tp.send({ type: 'SET_MINUTE', minute: 38 });

    // Math.round(38/15)*15 = Math.round(2.53)*15 = 3*15 = 45
    expect(tp.getContext().minutes).toBe(45);
  });

  // ──────────────────────────────────────────
  // SET_SECOND
  // ──────────────────────────────────────────

  it('SET_SECOND sets a valid second', () => {
    const tp = createTimePicker({ showSeconds: true });
    tp.send({ type: 'SET_SECOND', second: 30 });

    expect(tp.getContext().seconds).toBe(30);
  });

  // ──────────────────────────────────────────
  // SET_PERIOD
  // ──────────────────────────────────────────

  it('SET_PERIOD toggles AM to PM', () => {
    const tp = createTimePicker({ defaultValue: '09:00' });
    tp.send({ type: 'SET_PERIOD', period: 'PM' });

    expect(tp.getContext().period).toBe('PM');
    expect(tp.getContext().value).toBe('21:00');
  });

  it('SET_PERIOD toggles PM to AM', () => {
    const tp = createTimePicker({ defaultValue: '15:00' });
    tp.send({ type: 'SET_PERIOD', period: 'AM' });

    expect(tp.getContext().period).toBe('AM');
    expect(tp.getContext().value).toBe('03:00');
  });

  it('SET_PERIOD does nothing if already same period', () => {
    const tp = createTimePicker({ defaultValue: '09:00' });
    const cb = vi.fn();
    tp.subscribe(cb);
    tp.send({ type: 'SET_PERIOD', period: 'AM' });

    expect(cb).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // INCREMENT/DECREMENT HOUR
  // ──────────────────────────────────────────

  it('INCREMENT_HOUR increases hour by 1', () => {
    const tp = createTimePicker({ defaultValue: '10:00' });
    tp.send({ type: 'INCREMENT_HOUR' });

    expect(tp.getContext().value).toBe('11:00');
  });

  it('INCREMENT_HOUR wraps 23 to 0', () => {
    const tp = createTimePicker({ defaultValue: '23:00' });
    tp.send({ type: 'INCREMENT_HOUR' });

    expect(tp.getContext().value).toBe('00:00');
  });

  it('DECREMENT_HOUR decreases hour by 1', () => {
    const tp = createTimePicker({ defaultValue: '10:00' });
    tp.send({ type: 'DECREMENT_HOUR' });

    expect(tp.getContext().value).toBe('09:00');
  });

  it('DECREMENT_HOUR wraps 0 to 23', () => {
    const tp = createTimePicker({ defaultValue: '00:00' });
    tp.send({ type: 'DECREMENT_HOUR' });

    expect(tp.getContext().value).toBe('23:00');
  });

  // ──────────────────────────────────────────
  // INCREMENT/DECREMENT MINUTE
  // ──────────────────────────────────────────

  it('INCREMENT_MINUTE increases minute by step', () => {
    const tp = createTimePicker({ defaultValue: '10:30', step: 5 });
    tp.send({ type: 'INCREMENT_MINUTE' });

    expect(tp.getContext().minutes).toBe(35);
  });

  it('INCREMENT_MINUTE wraps 59 to 0 (step=1)', () => {
    const tp = createTimePicker({ defaultValue: '10:59' });
    tp.send({ type: 'INCREMENT_MINUTE' });

    expect(tp.getContext().minutes).toBe(0);
  });

  it('DECREMENT_MINUTE decreases minute by step', () => {
    const tp = createTimePicker({ defaultValue: '10:30', step: 5 });
    tp.send({ type: 'DECREMENT_MINUTE' });

    expect(tp.getContext().minutes).toBe(25);
  });

  it('DECREMENT_MINUTE wraps 0 to 59 (step=1)', () => {
    const tp = createTimePicker({ defaultValue: '10:00' });
    tp.send({ type: 'DECREMENT_MINUTE' });

    expect(tp.getContext().minutes).toBe(59);
  });

  // ──────────────────────────────────────────
  // OPEN / CLOSE / TOGGLE
  // ──────────────────────────────────────────

  it('OPEN sets isOpen to true', () => {
    const tp = createTimePicker();
    tp.send({ type: 'OPEN' });

    expect(tp.getContext().isOpen).toBe(true);
  });

  it('CLOSE sets isOpen to false', () => {
    const tp = createTimePicker();
    tp.send({ type: 'OPEN' });
    tp.send({ type: 'CLOSE' });

    expect(tp.getContext().isOpen).toBe(false);
  });

  it('TOGGLE flips isOpen state', () => {
    const tp = createTimePicker();

    tp.send({ type: 'TOGGLE' });
    expect(tp.getContext().isOpen).toBe(true);

    tp.send({ type: 'TOGGLE' });
    expect(tp.getContext().isOpen).toBe(false);
  });

  it('OPEN does nothing if already open', () => {
    const tp = createTimePicker();
    tp.send({ type: 'OPEN' });
    const cb = vi.fn();
    tp.subscribe(cb);
    tp.send({ type: 'OPEN' });

    expect(cb).not.toHaveBeenCalled();
  });

  it('CLOSE does nothing if already closed', () => {
    const tp = createTimePicker();
    const cb = vi.fn();
    tp.subscribe(cb);
    tp.send({ type: 'CLOSE' });

    expect(cb).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // SET_VALUE
  // ──────────────────────────────────────────

  it('SET_VALUE parses "14:30"', () => {
    const tp = createTimePicker();
    tp.send({ type: 'SET_VALUE', value: '14:30' });

    const ctx = tp.getContext();
    expect(ctx.value).toBe('14:30');
    expect(ctx.period).toBe('PM');
  });

  it('SET_VALUE parses "09:15:30" with showSeconds', () => {
    const tp = createTimePicker({ showSeconds: true });
    tp.send({ type: 'SET_VALUE', value: '09:15:30' });

    const ctx = tp.getContext();
    expect(ctx.value).toBe('09:15:30');
    expect(ctx.seconds).toBe(30);
  });

  it('SET_VALUE with null resets to 00:00', () => {
    const tp = createTimePicker({ defaultValue: '14:30' });
    tp.send({ type: 'SET_VALUE', value: null });

    expect(tp.getContext().value).toBeNull();
  });

  // ──────────────────────────────────────────
  // 24h format
  // ──────────────────────────────────────────

  it('24h format displays hours 0-23', () => {
    const tp = createTimePicker({ defaultValue: '00:00', is24h: true });
    expect(tp.getContext().hours).toBe(0);

    const tp2 = createTimePicker({ defaultValue: '23:00', is24h: true });
    expect(tp2.getContext().hours).toBe(23);

    const tp3 = createTimePicker({ defaultValue: '14:00', is24h: true });
    expect(tp3.getContext().hours).toBe(14);
  });

  // ──────────────────────────────────────────
  // 12h format
  // ──────────────────────────────────────────

  it('12h format displays hours 1-12', () => {
    const tp = createTimePicker({ defaultValue: '00:00', is24h: false });
    expect(tp.getContext().hours).toBe(12); // midnight = 12 AM

    const tp2 = createTimePicker({ defaultValue: '12:00', is24h: false });
    expect(tp2.getContext().hours).toBe(12); // noon = 12 PM

    const tp3 = createTimePicker({ defaultValue: '13:00', is24h: false });
    expect(tp3.getContext().hours).toBe(1); // 1 PM
  });

  it('12h format shows correct period', () => {
    const tpAM = createTimePicker({ defaultValue: '09:00' });
    expect(tpAM.getContext().period).toBe('AM');

    const tpPM = createTimePicker({ defaultValue: '15:00' });
    expect(tpPM.getContext().period).toBe('PM');
  });

  // ──────────────────────────────────────────
  // minTime / maxTime
  // ──────────────────────────────────────────

  it('rejects SET_HOUR outside minTime', () => {
    const tp = createTimePicker({ defaultValue: '10:00', minTime: '09:00' });
    tp.send({ type: 'SET_HOUR', hour: 8 });

    expect(tp.getContext().value).toBe('10:00'); // unchanged
  });

  it('rejects SET_HOUR outside maxTime', () => {
    const tp = createTimePicker({ defaultValue: '10:00', maxTime: '17:00' });
    tp.send({ type: 'SET_HOUR', hour: 18 });

    expect(tp.getContext().value).toBe('10:00'); // unchanged
  });

  it('accepts SET_HOUR within range', () => {
    const tp = createTimePicker({ defaultValue: '10:00', minTime: '09:00', maxTime: '17:00' });
    tp.send({ type: 'SET_HOUR', hour: 12 });

    expect(tp.getContext().value).toBe('12:00');
  });

  // ──────────────────────────────────────────
  // onChange callback
  // ──────────────────────────────────────────

  it('calls onChange when value changes', () => {
    const onChange = vi.fn();
    const tp = createTimePicker({ onChange });

    tp.send({ type: 'SET_HOUR', hour: 15 });
    expect(onChange).toHaveBeenCalledWith('15:00');
  });

  it('does not call onChange when value stays the same', () => {
    const onChange = vi.fn();
    const tp = createTimePicker({ defaultValue: '10:00', onChange });

    tp.send({ type: 'SET_HOUR', hour: 10 });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // onOpenChange callback
  // ──────────────────────────────────────────

  it('calls onOpenChange when isOpen changes', () => {
    const onOpenChange = vi.fn();
    const tp = createTimePicker({ onOpenChange });

    tp.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    tp.send({ type: 'CLOSE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ──────────────────────────────────────────
  // subscribe / unsubscribe
  // ──────────────────────────────────────────

  it('subscribe notifies on state change', () => {
    const tp = createTimePicker();
    const cb = vi.fn();
    tp.subscribe(cb);

    tp.send({ type: 'SET_HOUR', hour: 5 });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops notifications', () => {
    const tp = createTimePicker();
    const cb = vi.fn();
    const unsub = tp.subscribe(cb);
    unsub();

    tp.send({ type: 'SET_HOUR', hour: 5 });
    expect(cb).not.toHaveBeenCalled();
  });

  it('destroy clears all listeners', () => {
    const tp = createTimePicker();
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    tp.subscribe(cb1);
    tp.subscribe(cb2);

    tp.destroy();

    tp.send({ type: 'SET_HOUR', hour: 5 });
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // Value string format
  // ──────────────────────────────────────────

  it('value string format is "HH:mm" without showSeconds', () => {
    const tp = createTimePicker({ defaultValue: '09:05' });

    expect(tp.getContext().value).toBe('09:05');
  });

  it('value string format is "HH:mm:ss" with showSeconds', () => {
    const tp = createTimePicker({ defaultValue: '09:05:03', showSeconds: true });

    expect(tp.getContext().value).toBe('09:05:03');
  });
});
