/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCarousel } from './carousel.machine';

describe('createCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Init ──

  it('varsayilan context doner', () => {
    const api = createCarousel({ slideCount: 3 });
    const ctx = api.getContext();
    expect(ctx.activeIndex).toBe(0);
    expect(ctx.slideCount).toBe(3);
    expect(ctx.isAutoPlaying).toBe(false);
    expect(ctx.loop).toBe(false);
    api.destroy();
  });

  it('defaultIndex ile baslar', () => {
    const api = createCarousel({ slideCount: 5, defaultIndex: 2 });
    expect(api.getContext().activeIndex).toBe(2);
    api.destroy();
  });

  // ── NEXT / PREV ──

  it('NEXT sonraki slayta gecer', () => {
    const api = createCarousel({ slideCount: 3 });
    api.send({ type: 'NEXT' });
    expect(api.getContext().activeIndex).toBe(1);
    api.destroy();
  });

  it('PREV onceki slayta gecer', () => {
    const api = createCarousel({ slideCount: 3, defaultIndex: 2 });
    api.send({ type: 'PREV' });
    expect(api.getContext().activeIndex).toBe(1);
    api.destroy();
  });

  it('loop kapaliyken NEXT son slaytta kalir', () => {
    const api = createCarousel({ slideCount: 3, defaultIndex: 2 });
    api.send({ type: 'NEXT' });
    expect(api.getContext().activeIndex).toBe(2);
    api.destroy();
  });

  it('loop kapaliyken PREV ilk slaytta kalir', () => {
    const api = createCarousel({ slideCount: 3, defaultIndex: 0 });
    api.send({ type: 'PREV' });
    expect(api.getContext().activeIndex).toBe(0);
    api.destroy();
  });

  it('loop acikken NEXT son slayttan ilke doner', () => {
    const api = createCarousel({ slideCount: 3, defaultIndex: 2, loop: true });
    api.send({ type: 'NEXT' });
    expect(api.getContext().activeIndex).toBe(0);
    api.destroy();
  });

  it('loop acikken PREV ilk slayttan sona doner', () => {
    const api = createCarousel({ slideCount: 3, defaultIndex: 0, loop: true });
    api.send({ type: 'PREV' });
    expect(api.getContext().activeIndex).toBe(2);
    api.destroy();
  });

  // ── GO_TO ──

  it('GO_TO belirli slayta gider', () => {
    const api = createCarousel({ slideCount: 5 });
    api.send({ type: 'GO_TO', index: 3 });
    expect(api.getContext().activeIndex).toBe(3);
    api.destroy();
  });

  it('GO_TO sinir disinda clamp edilir', () => {
    const api = createCarousel({ slideCount: 3 });
    api.send({ type: 'GO_TO', index: 10 });
    expect(api.getContext().activeIndex).toBe(2);
    api.destroy();
  });

  it('GO_TO negatif index clamp edilir', () => {
    const api = createCarousel({ slideCount: 3 });
    api.send({ type: 'GO_TO', index: -1 });
    expect(api.getContext().activeIndex).toBe(0);
    api.destroy();
  });

  // ── Autoplay ──

  it('autoplay acikken otomatik ilerler', () => {
    const api = createCarousel({ slideCount: 3, autoplay: true, autoplayInterval: 1000 });
    expect(api.getContext().isAutoPlaying).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(api.getContext().activeIndex).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(api.getContext().activeIndex).toBe(2);
    api.destroy();
  });

  it('SET_AUTOPLAY ile autoplay baslatilir', () => {
    const api = createCarousel({ slideCount: 3, autoplayInterval: 500 });
    api.send({ type: 'SET_AUTOPLAY', enabled: true });
    expect(api.getContext().isAutoPlaying).toBe(true);
    vi.advanceTimersByTime(500);
    expect(api.getContext().activeIndex).toBe(1);
    api.destroy();
  });

  it('SET_AUTOPLAY ile autoplay durdurulur', () => {
    const api = createCarousel({ slideCount: 3, autoplay: true, autoplayInterval: 500 });
    api.send({ type: 'SET_AUTOPLAY', enabled: false });
    vi.advanceTimersByTime(500);
    expect(api.getContext().activeIndex).toBe(0);
    api.destroy();
  });

  // ── SET_SLIDE_COUNT ──

  it('SET_SLIDE_COUNT slayt sayisini gunceller', () => {
    const api = createCarousel({ slideCount: 3 });
    api.send({ type: 'SET_SLIDE_COUNT', count: 5 });
    expect(api.getContext().slideCount).toBe(5);
    api.destroy();
  });

  it('SET_SLIDE_COUNT activeIndex sinir disinda kalirsa clamp eder', () => {
    const api = createCarousel({ slideCount: 5, defaultIndex: 4 });
    api.send({ type: 'SET_SLIDE_COUNT', count: 3 });
    expect(api.getContext().activeIndex).toBe(2);
    api.destroy();
  });

  // ── onSlideChange ──

  it('onSlideChange callback cagirilir', () => {
    const onSlideChange = vi.fn();
    const api = createCarousel({ slideCount: 3, onSlideChange });
    api.send({ type: 'NEXT' });
    expect(onSlideChange).toHaveBeenCalledWith(1);
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createCarousel({ slideCount: 3 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'NEXT' });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createCarousel({ slideCount: 3 });
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Destroy ──

  it('destroy autoplay temizler', () => {
    const api = createCarousel({ slideCount: 3, autoplay: true, autoplayInterval: 500 });
    api.destroy();
    vi.advanceTimersByTime(500);
    expect(api.getContext().activeIndex).toBe(0);
  });
});
