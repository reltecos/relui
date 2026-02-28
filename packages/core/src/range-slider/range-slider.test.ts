/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createRangeSlider } from './range-slider.machine';

describe('createRangeSlider', () => {
  // ──────────────────────────────────────────
  // Başlangıç durumu / Initial state
  // ──────────────────────────────────────────

  it('varsayılan değerlerle oluşturulur / creates with default values', () => {
    const rs = createRangeSlider();
    const ctx = rs.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.activeThumb).toBeNull();
    expect(ctx.min).toBe(0);
    expect(ctx.max).toBe(100);
    expect(ctx.step).toBe(1);
    expect(ctx.value).toEqual([0, 100]);
    expect(ctx.minDistance).toBe(0);
    expect(ctx.orientation).toBe('horizontal');
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
  });

  it('props ile oluşturulur / creates with given props', () => {
    const rs = createRangeSlider({
      min: 10,
      max: 200,
      step: 5,
      value: [30, 150],
      minDistance: 10,
      orientation: 'vertical',
      disabled: true,
    });
    const ctx = rs.getContext();

    expect(ctx.min).toBe(10);
    expect(ctx.max).toBe(200);
    expect(ctx.step).toBe(5);
    expect(ctx.value).toEqual([30, 150]);
    expect(ctx.minDistance).toBe(10);
    expect(ctx.orientation).toBe('vertical');
    expect(ctx.disabled).toBe(true);
  });

  it('value min/max sınırlarına clamp edilir', () => {
    const rs = createRangeSlider({ min: 0, max: 100, value: [-10, 150] });

    expect(rs.getContext().value).toEqual([0, 100]);
  });

  it('value step\'e snap edilir', () => {
    const rs = createRangeSlider({ min: 0, max: 100, step: 10, value: [23, 77] });

    expect(rs.getContext().value).toEqual([20, 80]);
  });

  it('minDistance uygulanır — başlangıçta', () => {
    const rs = createRangeSlider({ min: 0, max: 100, value: [50, 55], minDistance: 10 });

    expect(rs.getContext().value[1] - rs.getContext().value[0]).toBeGreaterThanOrEqual(10);
  });

  // ──────────────────────────────────────────
  // CHANGE
  // ──────────────────────────────────────────

  it('CHANGE start — değeri günceller', () => {
    const rs = createRangeSlider({ value: [20, 80] });
    rs.send({ type: 'CHANGE', thumb: 'start', value: 30 });

    expect(rs.getContext().value).toEqual([30, 80]);
  });

  it('CHANGE end — değeri günceller', () => {
    const rs = createRangeSlider({ value: [20, 80] });
    rs.send({ type: 'CHANGE', thumb: 'end', value: 70 });

    expect(rs.getContext().value).toEqual([20, 70]);
  });

  it('CHANGE start — end\'i geçemez', () => {
    const rs = createRangeSlider({ value: [20, 80] });
    rs.send({ type: 'CHANGE', thumb: 'start', value: 90 });

    expect(rs.getContext().value[0]).toBeLessThanOrEqual(80);
  });

  it('CHANGE end — start\'ın altına düşemez', () => {
    const rs = createRangeSlider({ value: [20, 80] });
    rs.send({ type: 'CHANGE', thumb: 'end', value: 10 });

    expect(rs.getContext().value[1]).toBeGreaterThanOrEqual(20);
  });

  it('CHANGE — minDistance korunur', () => {
    const rs = createRangeSlider({ value: [20, 80], minDistance: 10 });
    rs.send({ type: 'CHANGE', thumb: 'start', value: 75 });

    expect(rs.getContext().value[1] - rs.getContext().value[0]).toBeGreaterThanOrEqual(10);
  });

  it('CHANGE — clamp ve snap uygular', () => {
    const rs = createRangeSlider({ min: 0, max: 100, step: 5, value: [20, 80] });
    rs.send({ type: 'CHANGE', thumb: 'start', value: -10 });

    expect(rs.getContext().value[0]).toBe(0);
  });

  it('CHANGE — aynı değer aynı referans döner', () => {
    const rs = createRangeSlider({ value: [20, 80] });
    const prev = rs.getContext();
    const next = rs.send({ type: 'CHANGE', thumb: 'start', value: 20 });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // INCREMENT / DECREMENT
  // ──────────────────────────────────────────

  it('INCREMENT start — step kadar artırır', () => {
    const rs = createRangeSlider({ value: [20, 80], step: 5 });
    rs.send({ type: 'INCREMENT', thumb: 'start' });

    expect(rs.getContext().value).toEqual([25, 80]);
  });

  it('DECREMENT end — step kadar azaltır', () => {
    const rs = createRangeSlider({ value: [20, 80], step: 5 });
    rs.send({ type: 'DECREMENT', thumb: 'end' });

    expect(rs.getContext().value).toEqual([20, 75]);
  });

  it('INCREMENT start — minDistance ile end\'e dayandığında durur', () => {
    const rs = createRangeSlider({ value: [70, 80], minDistance: 10, step: 5 });
    const prev = rs.getContext();
    const next = rs.send({ type: 'INCREMENT', thumb: 'start' });

    expect(next).toBe(prev);
  });

  it('DECREMENT end — minDistance ile start\'a dayandığında durur', () => {
    const rs = createRangeSlider({ value: [70, 80], minDistance: 10, step: 5 });
    const prev = rs.getContext();
    const next = rs.send({ type: 'DECREMENT', thumb: 'end' });

    expect(next).toBe(prev);
  });

  it('INCREMENT end — max sınırında kalır', () => {
    const rs = createRangeSlider({ value: [20, 100], max: 100 });
    const prev = rs.getContext();
    const next = rs.send({ type: 'INCREMENT', thumb: 'end' });

    expect(next).toBe(prev);
  });

  it('DECREMENT start — min sınırında kalır', () => {
    const rs = createRangeSlider({ value: [0, 80], min: 0 });
    const prev = rs.getContext();
    const next = rs.send({ type: 'DECREMENT', thumb: 'start' });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // SET_MIN / SET_MAX
  // ──────────────────────────────────────────

  it('SET_MIN start — min değere gider', () => {
    const rs = createRangeSlider({ value: [30, 80], min: 0 });
    rs.send({ type: 'SET_MIN', thumb: 'start' });

    expect(rs.getContext().value).toEqual([0, 80]);
  });

  it('SET_MAX end — max değere gider', () => {
    const rs = createRangeSlider({ value: [20, 70], max: 100 });
    rs.send({ type: 'SET_MAX', thumb: 'end' });

    expect(rs.getContext().value).toEqual([20, 100]);
  });

  it('SET_MAX start — end - minDistance değerine gider', () => {
    const rs = createRangeSlider({ value: [20, 80], minDistance: 10 });
    rs.send({ type: 'SET_MAX', thumb: 'start' });

    expect(rs.getContext().value[0]).toBe(70);
  });

  it('SET_MIN end — start + minDistance değerine gider', () => {
    const rs = createRangeSlider({ value: [20, 80], minDistance: 10 });
    rs.send({ type: 'SET_MIN', thumb: 'end' });

    expect(rs.getContext().value[1]).toBe(30);
  });

  it('SET_MIN start — zaten min ise aynı referans', () => {
    const rs = createRangeSlider({ value: [0, 80], min: 0 });
    const prev = rs.getContext();
    const next = rs.send({ type: 'SET_MIN', thumb: 'start' });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda CHANGE yoksayılır', () => {
    const rs = createRangeSlider({ disabled: true, value: [20, 80] });
    const prev = rs.getContext();
    const next = rs.send({ type: 'CHANGE', thumb: 'start', value: 40 });

    expect(next).toBe(prev);
  });

  it('disabled durumda INCREMENT yoksayılır', () => {
    const rs = createRangeSlider({ disabled: true, value: [20, 80] });
    const prev = rs.getContext();
    const next = rs.send({ type: 'INCREMENT', thumb: 'end' });

    expect(next).toBe(prev);
  });

  it('disabled durumda etkileşim yoksayılır', () => {
    const rs = createRangeSlider({ disabled: true });
    const prev = rs.getContext();
    const next = rs.send({ type: 'POINTER_ENTER' });

    expect(next).toBe(prev);
  });

  it('isInteractionBlocked — disabled true döner', () => {
    const rs = createRangeSlider({ disabled: true });

    expect(rs.isInteractionBlocked()).toBe(true);
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda CHANGE yoksayılır', () => {
    const rs = createRangeSlider({ readOnly: true, value: [20, 80] });
    const prev = rs.getContext();
    const next = rs.send({ type: 'CHANGE', thumb: 'start', value: 40 });

    expect(next).toBe(prev);
  });

  it('readOnly durumda etkileşim (hover) çalışır', () => {
    const rs = createRangeSlider({ readOnly: true });
    rs.send({ type: 'POINTER_ENTER' });

    expect(rs.getContext().interactionState).toBe('hover');
  });

  // ──────────────────────────────────────────
  // Interaction state + activeThumb
  // ──────────────────────────────────────────

  it('POINTER_ENTER → hover', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'POINTER_ENTER' });

    expect(rs.getContext().interactionState).toBe('hover');
  });

  it('POINTER_LEAVE → idle', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'POINTER_ENTER' });
    rs.send({ type: 'POINTER_LEAVE' });

    expect(rs.getContext().interactionState).toBe('idle');
  });

  it('FOCUS — focused + activeThumb set edilir', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'FOCUS', thumb: 'start' });

    expect(rs.getContext().interactionState).toBe('focused');
    expect(rs.getContext().activeThumb).toBe('start');
  });

  it('BLUR — idle + activeThumb null', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'FOCUS', thumb: 'end' });
    rs.send({ type: 'BLUR' });

    expect(rs.getContext().interactionState).toBe('idle');
    expect(rs.getContext().activeThumb).toBeNull();
  });

  it('DRAG_START — dragging + activeThumb', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'DRAG_START', thumb: 'end' });

    expect(rs.getContext().interactionState).toBe('dragging');
    expect(rs.getContext().activeThumb).toBe('end');
  });

  it('DRAG_END — focused (activeThumb korunur)', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'DRAG_START', thumb: 'start' });
    rs.send({ type: 'DRAG_END' });

    expect(rs.getContext().interactionState).toBe('focused');
    expect(rs.getContext().activeThumb).toBe('start');
  });

  // ──────────────────────────────────────────
  // Referans eşitliği / Reference equality
  // ──────────────────────────────────────────

  it('değişiklik yoksa aynı referans döner', () => {
    const rs = createRangeSlider();
    const prev = rs.getContext();
    const next = rs.send({ type: 'POINTER_LEAVE' });

    expect(next).toBe(prev);
  });

  it('SET_DISABLED — aynı değer aynı referans', () => {
    const rs = createRangeSlider();
    const prev = rs.getContext();
    const next = rs.send({ type: 'SET_DISABLED', value: false });

    expect(next).toBe(prev);
  });

  it('SET_INVALID — aynı değer aynı referans', () => {
    const rs = createRangeSlider();
    const prev = rs.getContext();
    const next = rs.send({ type: 'SET_INVALID', value: false });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // Prop güncellemeleri / Prop updates
  // ──────────────────────────────────────────

  it('SET_VALUE — değerleri günceller', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'SET_VALUE', value: [25, 75] });

    expect(rs.getContext().value).toEqual([25, 75]);
  });

  it('SET_VALUE — clamp uygular', () => {
    const rs = createRangeSlider({ max: 100 });
    rs.send({ type: 'SET_VALUE', value: [-10, 200] });

    expect(rs.getContext().value).toEqual([0, 100]);
  });

  it('SET_VALUE — aynı değer aynı referans', () => {
    const rs = createRangeSlider({ value: [20, 80] });
    const prev = rs.getContext();
    const next = rs.send({ type: 'SET_VALUE', value: [20, 80] });

    expect(next).toBe(prev);
  });

  it('SET_DISABLED — disabled günceller ve interaction sıfırlar', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'POINTER_ENTER' });
    rs.send({ type: 'SET_DISABLED', value: true });

    expect(rs.getContext().disabled).toBe(true);
    expect(rs.getContext().interactionState).toBe('idle');
    expect(rs.getContext().activeThumb).toBeNull();
  });

  // ──────────────────────────────────────────
  // getStartThumbProps / getEndThumbProps
  // ──────────────────────────────────────────

  it('start thumb DOM props doğru üretilir', () => {
    const rs = createRangeSlider({ min: 0, max: 100, value: [20, 80] });
    const props = rs.getStartThumbProps();

    expect(props.role).toBe('slider');
    expect(props.tabIndex).toBe(0);
    expect(props['aria-valuemin']).toBe(0);
    expect(props['aria-valuemax']).toBe(80);
    expect(props['aria-valuenow']).toBe(20);
    expect(props['data-thumb']).toBe('start');
    expect(props['data-orientation']).toBe('horizontal');
  });

  it('end thumb DOM props doğru üretilir', () => {
    const rs = createRangeSlider({ min: 0, max: 100, value: [20, 80] });
    const props = rs.getEndThumbProps();

    expect(props.role).toBe('slider');
    expect(props['aria-valuemin']).toBe(20);
    expect(props['aria-valuemax']).toBe(100);
    expect(props['aria-valuenow']).toBe(80);
    expect(props['data-thumb']).toBe('end');
  });

  it('dragging — sadece aktif thumb data-state=dragging alır', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'DRAG_START', thumb: 'start' });

    expect(rs.getStartThumbProps()['data-state']).toBe('dragging');
    expect(rs.getEndThumbProps()['data-state']).toBe('idle');
  });

  it('focused — sadece aktif thumb data-focus alır', () => {
    const rs = createRangeSlider();
    rs.send({ type: 'FOCUS', thumb: 'end' });

    expect(rs.getStartThumbProps()['data-focus']).toBeUndefined();
    expect(rs.getEndThumbProps()['data-focus']).toBe('');
  });

  it('disabled thumb data-disabled set eder', () => {
    const rs = createRangeSlider({ disabled: true });
    const startProps = rs.getStartThumbProps();
    const endProps = rs.getEndThumbProps();

    expect(startProps['aria-disabled']).toBe(true);
    expect(startProps['data-disabled']).toBe('');
    expect(endProps['aria-disabled']).toBe(true);
    expect(endProps['data-disabled']).toBe('');
  });

  // ──────────────────────────────────────────
  // getTrackProps
  // ──────────────────────────────────────────

  it('track DOM props doğru üretilir', () => {
    const rs = createRangeSlider();
    const props = rs.getTrackProps();

    expect(props['data-orientation']).toBe('horizontal');
    expect(props['data-disabled']).toBeUndefined();
  });

  // ──────────────────────────────────────────
  // getStartPercent / getEndPercent
  // ──────────────────────────────────────────

  it('getStartPercent — doğru yüzde döner', () => {
    const rs = createRangeSlider({ min: 0, max: 100, value: [25, 75] });

    expect(rs.getStartPercent()).toBe(25);
  });

  it('getEndPercent — doğru yüzde döner', () => {
    const rs = createRangeSlider({ min: 0, max: 100, value: [25, 75] });

    expect(rs.getEndPercent()).toBe(75);
  });

  it('getStartPercent — özel aralık', () => {
    const rs = createRangeSlider({ min: 20, max: 80, value: [50, 65] });

    expect(rs.getStartPercent()).toBe(50);
  });
});
