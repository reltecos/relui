/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTour } from './tour.machine';
import type { TourStep } from './tour.types';

const sampleSteps: TourStep[] = [
  { target: '#step1', title: 'Adim 1', description: 'Birinci adim', placement: 'bottom' },
  { target: '#step2', title: 'Adim 2', description: 'Ikinci adim', placement: 'right' },
  { target: '#step3', description: 'Ucuncu adim' },
];

describe('createTour', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak aktif degil', () => {
    const api = createTour({ steps: sampleSteps });
    expect(api.getContext().active).toBe(false);
    expect(api.getContext().currentStep).toBe(0);
    expect(api.getContext().totalSteps).toBe(3);
  });

  it('aktif degilken getStep undefined doner', () => {
    const api = createTour({ steps: sampleSteps });
    expect(api.getStep()).toBeUndefined();
  });

  // ── START ──

  it('START ile tur baslar', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    expect(api.getContext().active).toBe(true);
    expect(api.getContext().currentStep).toBe(0);
  });

  it('START sonrasi getStep ilk adimi doner', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    expect(api.getStep()?.target).toBe('#step1');
  });

  it('zaten aktifken START notify yapmaz', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'START' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('bos adim listesiyle START aktif etmez', () => {
    const api = createTour({ steps: [] });
    api.send({ type: 'START' });
    expect(api.getContext().active).toBe(false);
  });

  it('START onStepChange(0) cagirir', () => {
    const onStepChange = vi.fn();
    const api = createTour({ steps: sampleSteps, onStepChange });
    api.send({ type: 'START' });
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  // ── STOP ──

  it('STOP ile tur durur', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    api.send({ type: 'STOP' });
    expect(api.getContext().active).toBe(false);
  });

  it('aktif degilken STOP notify yapmaz', () => {
    const api = createTour({ steps: sampleSteps });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'STOP' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── NEXT ──

  it('NEXT ile bir sonraki adima gecer', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    api.send({ type: 'NEXT' });
    expect(api.getContext().currentStep).toBe(1);
    expect(api.getStep()?.target).toBe('#step2');
  });

  it('son adimda NEXT turu tamamlar', () => {
    const onComplete = vi.fn();
    const api = createTour({ steps: sampleSteps, onComplete });
    api.send({ type: 'START' });
    api.send({ type: 'NEXT' }); // 0 → 1
    api.send({ type: 'NEXT' }); // 1 → 2
    api.send({ type: 'NEXT' }); // son adim → tamamla
    expect(api.getContext().active).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('aktif degilken NEXT bir sey yapmaz', () => {
    const listener = vi.fn();
    const api = createTour({ steps: sampleSteps });
    api.subscribe(listener);
    api.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('NEXT onStepChange cagirir', () => {
    const onStepChange = vi.fn();
    const api = createTour({ steps: sampleSteps, onStepChange });
    api.send({ type: 'START' });
    api.send({ type: 'NEXT' });
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  // ── PREV ──

  it('PREV ile bir onceki adima doner', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    api.send({ type: 'NEXT' });
    api.send({ type: 'PREV' });
    expect(api.getContext().currentStep).toBe(0);
  });

  it('ilk adimda PREV bir sey yapmaz', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'PREV' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('aktif degilken PREV bir sey yapmaz', () => {
    const listener = vi.fn();
    const api = createTour({ steps: sampleSteps });
    api.subscribe(listener);
    api.send({ type: 'PREV' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('PREV onStepChange cagirir', () => {
    const onStepChange = vi.fn();
    const api = createTour({ steps: sampleSteps, onStepChange });
    api.send({ type: 'START' });
    api.send({ type: 'NEXT' }); // 0 → 1
    api.send({ type: 'PREV' }); // 1 → 0
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  // ── GO_TO ──

  it('GO_TO ile belirli adima atlar', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    api.send({ type: 'GO_TO', index: 2 });
    expect(api.getContext().currentStep).toBe(2);
    expect(api.getStep()?.target).toBe('#step3');
  });

  it('gecersiz index ile GO_TO bir sey yapmaz (negatif)', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'GO_TO', index: -1 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('gecersiz index ile GO_TO bir sey yapmaz (sinir disi)', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'GO_TO', index: 10 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('ayni index ile GO_TO notify yapmaz', () => {
    const api = createTour({ steps: sampleSteps });
    api.send({ type: 'START' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'GO_TO', index: 0 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('aktif degilken GO_TO bir sey yapmaz', () => {
    const listener = vi.fn();
    const api = createTour({ steps: sampleSteps });
    api.subscribe(listener);
    api.send({ type: 'GO_TO', index: 1 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── subscribe ──

  it('subscribe ile dinleyici eklenir', () => {
    const api = createTour({ steps: sampleSteps });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'START' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createTour({ steps: sampleSteps });
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'START' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── totalSteps ──

  it('totalSteps adim sayisini doner', () => {
    const api = createTour({ steps: sampleSteps });
    expect(api.getContext().totalSteps).toBe(3);
  });

  it('tek adimlik turda NEXT turu tamamlar', () => {
    const onComplete = vi.fn();
    const api = createTour({
      steps: [{ target: '#only', description: 'Tek adim' }],
      onComplete,
    });
    api.send({ type: 'START' });
    api.send({ type: 'NEXT' });
    expect(api.getContext().active).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
