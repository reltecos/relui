/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createStepper } from './stepper.machine';

describe('createStepper', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak 3 adim ile baslar', () => {
    const api = createStepper();
    const ctx = api.getContext();
    expect(ctx.stepCount).toBe(3);
    expect(ctx.steps.length).toBe(3);
  });

  it('ilk adim active, digerler pending baslar', () => {
    const api = createStepper();
    const ctx = api.getContext();
    expect(ctx.steps[0].status).toBe('active');
    expect(ctx.steps[1].status).toBe('pending');
    expect(ctx.steps[2].status).toBe('pending');
  });

  it('varsayilan activeIndex 0', () => {
    const api = createStepper();
    expect(api.getContext().activeIndex).toBe(0);
  });

  it('isFirst ilk adimda true', () => {
    const api = createStepper();
    expect(api.getContext().isFirst).toBe(true);
  });

  it('isLast ilk adimda false', () => {
    const api = createStepper();
    expect(api.getContext().isLast).toBe(false);
  });

  it('custom stepCount ile olusturulur', () => {
    const api = createStepper({ stepCount: 5 });
    expect(api.getContext().stepCount).toBe(5);
    expect(api.getContext().steps.length).toBe(5);
  });

  it('custom stepTitles ile olusturulur', () => {
    const api = createStepper({ stepTitles: ['Bilgi', 'Onay', 'Tamamla'] });
    const ctx = api.getContext();
    expect(ctx.steps[0].title).toBe('Bilgi');
    expect(ctx.steps[1].title).toBe('Onay');
    expect(ctx.steps[2].title).toBe('Tamamla');
  });

  it('defaultIndex ile baslangic adimi ayarlanir', () => {
    const api = createStepper({ defaultIndex: 1 });
    const ctx = api.getContext();
    expect(ctx.activeIndex).toBe(1);
    expect(ctx.steps[0].status).toBe('completed');
    expect(ctx.steps[1].status).toBe('active');
  });

  // ── NEXT ──

  it('NEXT sonraki adima ilerler', () => {
    const api = createStepper();
    api.send({ type: 'NEXT' });
    const ctx = api.getContext();
    expect(ctx.activeIndex).toBe(1);
    expect(ctx.steps[0].status).toBe('completed');
    expect(ctx.steps[1].status).toBe('active');
  });

  it('NEXT son adimda kalir', () => {
    const api = createStepper({ stepCount: 2, defaultIndex: 1 });
    api.send({ type: 'NEXT' });
    expect(api.getContext().activeIndex).toBe(1);
  });

  it('NEXT son adimda listener cagirilmaz', () => {
    const api = createStepper({ stepCount: 2, defaultIndex: 1 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── PREV ──

  it('PREV onceki adima doner', () => {
    const api = createStepper({ defaultIndex: 1 });
    api.send({ type: 'PREV' });
    const ctx = api.getContext();
    expect(ctx.activeIndex).toBe(0);
    expect(ctx.steps[0].status).toBe('active');
    expect(ctx.steps[1].status).toBe('pending');
  });

  it('PREV ilk adimda kalir', () => {
    const api = createStepper();
    api.send({ type: 'PREV' });
    expect(api.getContext().activeIndex).toBe(0);
  });

  it('PREV ilk adimda listener cagirilmaz', () => {
    const api = createStepper();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'PREV' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── GO_TO ──

  it('GO_TO hedef adima gider', () => {
    const api = createStepper({ stepCount: 5 });
    api.send({ type: 'GO_TO', index: 3 });
    const ctx = api.getContext();
    expect(ctx.activeIndex).toBe(3);
    expect(ctx.steps[0].status).toBe('completed');
    expect(ctx.steps[1].status).toBe('completed');
    expect(ctx.steps[2].status).toBe('completed');
    expect(ctx.steps[3].status).toBe('active');
    expect(ctx.steps[4].status).toBe('pending');
  });

  it('GO_TO negatif index 0a clamp edilir', () => {
    const api = createStepper({ defaultIndex: 2 });
    api.send({ type: 'GO_TO', index: -1 });
    expect(api.getContext().activeIndex).toBe(0);
  });

  it('GO_TO buyuk index son adima clamp edilir', () => {
    const api = createStepper({ stepCount: 3 });
    api.send({ type: 'GO_TO', index: 10 });
    expect(api.getContext().activeIndex).toBe(2);
  });

  it('GO_TO ayni adima gidince no-op', () => {
    const api = createStepper({ defaultIndex: 1 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'GO_TO', index: 1 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── SET_STATUS ──

  it('SET_STATUS belirli adimin durumunu degistirir', () => {
    const api = createStepper();
    api.send({ type: 'SET_STATUS', index: 1, status: 'error' });
    expect(api.getContext().steps[1].status).toBe('error');
  });

  it('SET_STATUS gecersiz index icin no-op', () => {
    const api = createStepper();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_STATUS', index: 10, status: 'error' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── RESET ──

  it('RESET tum adimlari sifirlar', () => {
    const api = createStepper({ stepCount: 3, defaultIndex: 2 });
    api.send({ type: 'RESET' });
    const ctx = api.getContext();
    expect(ctx.activeIndex).toBe(0);
    expect(ctx.steps[0].status).toBe('active');
    expect(ctx.steps[1].status).toBe('pending');
    expect(ctx.steps[2].status).toBe('pending');
  });

  // ── SET_STEP_COUNT ──

  it('SET_STEP_COUNT adim sayisini degistirir', () => {
    const api = createStepper({ stepCount: 3 });
    api.send({ type: 'SET_STEP_COUNT', count: 5 });
    const ctx = api.getContext();
    expect(ctx.stepCount).toBe(5);
    expect(ctx.steps.length).toBe(5);
  });

  it('SET_STEP_COUNT azaltinca activeIndex clamp edilir', () => {
    const api = createStepper({ stepCount: 5, defaultIndex: 4 });
    api.send({ type: 'SET_STEP_COUNT', count: 2 });
    expect(api.getContext().activeIndex).toBe(1);
  });

  it('SET_STEP_COUNT ayni sayi icin no-op', () => {
    const api = createStepper({ stepCount: 3 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_STEP_COUNT', count: 3 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── onStepChange ──

  it('NEXT sonrasi onStepChange cagirilir', () => {
    const onChange = vi.fn();
    const api = createStepper({ onStepChange: onChange });
    api.send({ type: 'NEXT' });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('PREV sonrasi onStepChange cagirilir', () => {
    const onChange = vi.fn();
    const api = createStepper({ defaultIndex: 1, onStepChange: onChange });
    api.send({ type: 'PREV' });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('GO_TO sonrasi onStepChange cagirilir', () => {
    const onChange = vi.fn();
    const api = createStepper({ stepCount: 5, onStepChange: onChange });
    api.send({ type: 'GO_TO', index: 3 });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  // ── isFirst / isLast ──

  it('isLast son adimda true', () => {
    const api = createStepper({ stepCount: 2 });
    api.send({ type: 'NEXT' });
    expect(api.getContext().isLast).toBe(true);
  });

  it('isFirst ortada iken false', () => {
    const api = createStepper({ stepCount: 3, defaultIndex: 1 });
    expect(api.getContext().isFirst).toBe(false);
  });

  // ── Subscribe / Unsubscribe ──

  it('subscribe ile degisiklikler dinlenir', () => {
    const api = createStepper();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'NEXT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagirilmaz', () => {
    const api = createStepper();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla subscriber desteklenir', () => {
    const api = createStepper();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    api.subscribe(listener1);
    api.subscribe(listener2);
    api.send({ type: 'NEXT' });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  // ── Destroy ──

  it('destroy sonrasi listener cagirilmaz', () => {
    const api = createStepper();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
  });
});
