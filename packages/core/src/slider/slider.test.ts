/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSlider, getPercent } from './slider.machine';

describe('createSlider', () => {
  // ──────────────────────────────────────────
  // Başlangıç durumu / Initial state
  // ──────────────────────────────────────────

  it('varsayılan değerlerle oluşturulur / creates with default values', () => {
    const slider = createSlider();
    const ctx = slider.getContext();

    expect(ctx.interactionState).toBe('idle');
    expect(ctx.min).toBe(0);
    expect(ctx.max).toBe(100);
    expect(ctx.step).toBe(1);
    expect(ctx.value).toBe(0);
    expect(ctx.orientation).toBe('horizontal');
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
  });

  it('props ile oluşturulur / creates with given props', () => {
    const slider = createSlider({
      min: 10,
      max: 200,
      step: 5,
      value: 50,
      orientation: 'vertical',
      disabled: true,
    });
    const ctx = slider.getContext();

    expect(ctx.min).toBe(10);
    expect(ctx.max).toBe(200);
    expect(ctx.step).toBe(5);
    expect(ctx.value).toBe(50);
    expect(ctx.orientation).toBe('vertical');
    expect(ctx.disabled).toBe(true);
  });

  it('value min/max sınırlarına clamp edilir', () => {
    const slider = createSlider({ min: 0, max: 100, value: 150 });

    expect(slider.getContext().value).toBe(100);
  });

  it('value min altında ise min yapılır', () => {
    const slider = createSlider({ min: 10, max: 100, value: -5 });

    expect(slider.getContext().value).toBe(10);
  });

  it('value step\'e snap edilir', () => {
    const slider = createSlider({ min: 0, max: 100, step: 10, value: 23 });

    expect(slider.getContext().value).toBe(20);
  });

  // ──────────────────────────────────────────
  // CHANGE
  // ──────────────────────────────────────────

  it('CHANGE — değeri günceller', () => {
    const slider = createSlider();
    slider.send({ type: 'CHANGE', value: 42 });

    expect(slider.getContext().value).toBe(42);
  });

  it('CHANGE — clamp ve snap uygular', () => {
    const slider = createSlider({ min: 0, max: 100, step: 5 });
    slider.send({ type: 'CHANGE', value: 123 });

    expect(slider.getContext().value).toBe(100);
  });

  it('CHANGE — step\'e snap eder', () => {
    const slider = createSlider({ min: 0, max: 100, step: 10 });
    slider.send({ type: 'CHANGE', value: 37 });

    expect(slider.getContext().value).toBe(40);
  });

  it('CHANGE — aynı değer aynı referans döner', () => {
    const slider = createSlider({ value: 50 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'CHANGE', value: 50 });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // INCREMENT / DECREMENT
  // ──────────────────────────────────────────

  it('INCREMENT — step kadar artırır', () => {
    const slider = createSlider({ value: 50, step: 5 });
    slider.send({ type: 'INCREMENT' });

    expect(slider.getContext().value).toBe(55);
  });

  it('DECREMENT — step kadar azaltır', () => {
    const slider = createSlider({ value: 50, step: 5 });
    slider.send({ type: 'DECREMENT' });

    expect(slider.getContext().value).toBe(45);
  });

  it('INCREMENT — max sınırında kalır', () => {
    const slider = createSlider({ value: 100, max: 100 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'INCREMENT' });

    expect(next).toBe(prev);
  });

  it('DECREMENT — min sınırında kalır', () => {
    const slider = createSlider({ value: 0, min: 0 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'DECREMENT' });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // SET_MIN / SET_MAX
  // ──────────────────────────────────────────

  it('SET_MIN — minimum değere gider', () => {
    const slider = createSlider({ value: 50, min: 0 });
    slider.send({ type: 'SET_MIN' });

    expect(slider.getContext().value).toBe(0);
  });

  it('SET_MAX — maksimum değere gider', () => {
    const slider = createSlider({ value: 50, max: 100 });
    slider.send({ type: 'SET_MAX' });

    expect(slider.getContext().value).toBe(100);
  });

  it('SET_MIN — zaten min ise aynı referans', () => {
    const slider = createSlider({ value: 0, min: 0 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'SET_MIN' });

    expect(next).toBe(prev);
  });

  it('SET_MAX — zaten max ise aynı referans', () => {
    const slider = createSlider({ value: 100, max: 100 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'SET_MAX' });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda CHANGE yoksayılır', () => {
    const slider = createSlider({ disabled: true, value: 50 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'CHANGE', value: 75 });

    expect(next).toBe(prev);
  });

  it('disabled durumda INCREMENT yoksayılır', () => {
    const slider = createSlider({ disabled: true, value: 50 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'INCREMENT' });

    expect(next).toBe(prev);
  });

  it('disabled durumda etkileşim yoksayılır', () => {
    const slider = createSlider({ disabled: true });
    const prev = slider.getContext();
    const next = slider.send({ type: 'POINTER_ENTER' });

    expect(next).toBe(prev);
  });

  it('isInteractionBlocked — disabled true döner', () => {
    const slider = createSlider({ disabled: true });

    expect(slider.isInteractionBlocked()).toBe(true);
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda CHANGE yoksayılır', () => {
    const slider = createSlider({ readOnly: true, value: 50 });
    const prev = slider.getContext();
    const next = slider.send({ type: 'CHANGE', value: 75 });

    expect(next).toBe(prev);
  });

  it('readOnly durumda etkileşim (hover) çalışır', () => {
    const slider = createSlider({ readOnly: true });
    slider.send({ type: 'POINTER_ENTER' });

    expect(slider.getContext().interactionState).toBe('hover');
  });

  // ──────────────────────────────────────────
  // Interaction state geçişleri
  // ──────────────────────────────────────────

  it('POINTER_ENTER → hover', () => {
    const slider = createSlider();
    slider.send({ type: 'POINTER_ENTER' });

    expect(slider.getContext().interactionState).toBe('hover');
  });

  it('POINTER_LEAVE → idle', () => {
    const slider = createSlider();
    slider.send({ type: 'POINTER_ENTER' });
    slider.send({ type: 'POINTER_LEAVE' });

    expect(slider.getContext().interactionState).toBe('idle');
  });

  it('FOCUS → focused', () => {
    const slider = createSlider();
    slider.send({ type: 'FOCUS' });

    expect(slider.getContext().interactionState).toBe('focused');
  });

  it('BLUR → idle', () => {
    const slider = createSlider();
    slider.send({ type: 'FOCUS' });
    slider.send({ type: 'BLUR' });

    expect(slider.getContext().interactionState).toBe('idle');
  });

  it('DRAG_START → dragging', () => {
    const slider = createSlider();
    slider.send({ type: 'DRAG_START' });

    expect(slider.getContext().interactionState).toBe('dragging');
  });

  it('DRAG_END → focused', () => {
    const slider = createSlider();
    slider.send({ type: 'DRAG_START' });
    slider.send({ type: 'DRAG_END' });

    expect(slider.getContext().interactionState).toBe('focused');
  });

  // ──────────────────────────────────────────
  // Referans eşitliği / Reference equality
  // ──────────────────────────────────────────

  it('değişiklik yoksa aynı referans döner', () => {
    const slider = createSlider();
    const prev = slider.getContext();
    const next = slider.send({ type: 'POINTER_LEAVE' });

    expect(next).toBe(prev);
  });

  it('SET_DISABLED — aynı değer aynı referans', () => {
    const slider = createSlider();
    const prev = slider.getContext();
    const next = slider.send({ type: 'SET_DISABLED', value: false });

    expect(next).toBe(prev);
  });

  // ──────────────────────────────────────────
  // Prop güncellemeleri / Prop updates
  // ──────────────────────────────────────────

  it('SET_VALUE — değeri günceller', () => {
    const slider = createSlider();
    slider.send({ type: 'SET_VALUE', value: 75 });

    expect(slider.getContext().value).toBe(75);
  });

  it('SET_VALUE — clamp uygular', () => {
    const slider = createSlider({ max: 100 });
    slider.send({ type: 'SET_VALUE', value: 200 });

    expect(slider.getContext().value).toBe(100);
  });

  it('SET_DISABLED — disabled günceller ve interaction sıfırlar', () => {
    const slider = createSlider();
    slider.send({ type: 'POINTER_ENTER' });
    slider.send({ type: 'SET_DISABLED', value: true });

    expect(slider.getContext().disabled).toBe(true);
    expect(slider.getContext().interactionState).toBe('idle');
  });

  // ──────────────────────────────────────────
  // getThumbProps — DOM attribute'ları
  // ──────────────────────────────────────────

  it('thumb DOM props doğru üretilir', () => {
    const slider = createSlider({ min: 0, max: 100, value: 50 });
    const props = slider.getThumbProps();

    expect(props.role).toBe('slider');
    expect(props.tabIndex).toBe(0);
    expect(props['aria-valuemin']).toBe(0);
    expect(props['aria-valuemax']).toBe(100);
    expect(props['aria-valuenow']).toBe(50);
    expect(props['aria-orientation']).toBe('horizontal');
    expect(props['data-state']).toBe('idle');
    expect(props['data-orientation']).toBe('horizontal');
  });

  it('dragging state data-state=dragging set eder', () => {
    const slider = createSlider();
    slider.send({ type: 'DRAG_START' });
    const props = slider.getThumbProps();

    expect(props['data-state']).toBe('dragging');
    expect(props['data-focus']).toBe('');
  });

  it('disabled thumb data-disabled set eder', () => {
    const slider = createSlider({ disabled: true });
    const props = slider.getThumbProps();

    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  // ──────────────────────────────────────────
  // getTrackProps — DOM attribute'ları
  // ──────────────────────────────────────────

  it('track DOM props doğru üretilir', () => {
    const slider = createSlider();
    const props = slider.getTrackProps();

    expect(props['data-orientation']).toBe('horizontal');
    expect(props['data-disabled']).toBeUndefined();
  });

  // ──────────────────────────────────────────
  // getPercent
  // ──────────────────────────────────────────

  it('getPercent — doğru yüzde döner', () => {
    const slider = createSlider({ min: 0, max: 100, value: 50 });

    expect(slider.getPercent()).toBe(50);
  });

  it('getPercent — min=max durumda 0 döner', () => {
    expect(getPercent(50, 50, 50)).toBe(0);
  });

  it('getPercent — özel aralık', () => {
    const slider = createSlider({ min: 20, max: 80, value: 50 });

    expect(slider.getPercent()).toBe(50);
  });
});
