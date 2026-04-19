/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createLottieAnimation, interpolateKeyframes } from './lottie-animation.machine';
import type { LottieData, LottieKeyframe } from './lottie-animation.types';

const SAMPLE_DATA: LottieData = {
  frameRate: 30,
  totalFrames: 60,
  width: 200,
  height: 200,
  layers: [
    {
      name: 'Layer 1',
      inFrame: 0,
      outFrame: 60,
      opacity: [{ frame: 0, value: 100 }, { frame: 30, value: 50 }, { frame: 60, value: 100 }],
      positionX: [{ frame: 0, value: 0 }, { frame: 60, value: 200 }],
      positionY: [{ frame: 0, value: 0 }],
      scaleX: [{ frame: 0, value: 1 }],
      scaleY: [{ frame: 0, value: 1 }],
      rotation: [{ frame: 0, value: 0 }, { frame: 60, value: 360 }],
    },
  ],
};

describe('interpolateKeyframes', () => {
  const kfs: LottieKeyframe[] = [{ frame: 0, value: 0 }, { frame: 10, value: 100 }];

  it('frame 0 da 0 doner', () => { expect(interpolateKeyframes(kfs, 0)).toBe(0); });
  it('frame 10 da 100 doner', () => { expect(interpolateKeyframes(kfs, 10)).toBe(100); });
  it('frame 5 te 50 doner (lineer)', () => { expect(interpolateKeyframes(kfs, 5)).toBe(50); });
  it('frame negatif ise ilk deger doner', () => { expect(interpolateKeyframes(kfs, -5)).toBe(0); });
  it('frame sonrasi son deger doner', () => { expect(interpolateKeyframes(kfs, 20)).toBe(100); });
  it('bos keyframe 0 doner', () => { expect(interpolateKeyframes([], 5)).toBe(0); });
  it('tek keyframe deger doner', () => { expect(interpolateKeyframes([{ frame: 0, value: 42 }], 10)).toBe(42); });
});

describe('createLottieAnimation', () => {
  it('varsayilan degerle olusturulur', () => {
    const la = createLottieAnimation();
    const ctx = la.getContext();
    expect(ctx.playing).toBe(false);
    expect(ctx.currentFrame).toBe(0);
    expect(ctx.speed).toBe(1);
    expect(ctx.loop).toBe(true);
    expect(ctx.data).toBeNull();
  });

  it('defaultData ile olusturulur', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    expect(la.getContext().totalFrames).toBe(60);
  });

  it('PLAY ile oynatma baslar', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'PLAY' });
    expect(la.getContext().playing).toBe(true);
  });

  it('PLAY zaten oynatiyorsa notify etmez', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'PLAY' });
    const listener = vi.fn();
    la.subscribe(listener);
    la.send({ type: 'PLAY' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('PAUSE ile durur', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'PLAY' });
    la.send({ type: 'PAUSE' });
    expect(la.getContext().playing).toBe(false);
  });

  it('STOP ile basa doner', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'PLAY' });
    la.send({ type: 'SET_FRAME', frame: 30 });
    la.send({ type: 'STOP' });
    expect(la.getContext().playing).toBe(false);
    expect(la.getContext().currentFrame).toBe(0);
  });

  it('SET_FRAME ile frame ayarlanir', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'SET_FRAME', frame: 25 });
    expect(la.getContext().currentFrame).toBe(25);
  });

  it('SET_FRAME clamp edilir', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'SET_FRAME', frame: 100 });
    expect(la.getContext().currentFrame).toBe(59);
  });

  it('SET_SPEED ile hiz ayarlanir', () => {
    const la = createLottieAnimation();
    la.send({ type: 'SET_SPEED', speed: 2 });
    expect(la.getContext().speed).toBe(2);
  });

  it('SET_SPEED clamp edilir', () => {
    const la = createLottieAnimation();
    la.send({ type: 'SET_SPEED', speed: 0 });
    expect(la.getContext().speed).toBe(0.1);
  });

  it('TOGGLE_LOOP ile loop degisir', () => {
    const la = createLottieAnimation();
    expect(la.getContext().loop).toBe(true);
    la.send({ type: 'TOGGLE_LOOP' });
    expect(la.getContext().loop).toBe(false);
  });

  it('SET_DATA ile veri yuklenir', () => {
    const la = createLottieAnimation();
    la.send({ type: 'SET_DATA', data: SAMPLE_DATA });
    expect(la.getContext().data).not.toBeNull();
    expect(la.getContext().totalFrames).toBe(60);
  });

  it('SET_DATA frame sifirlar', () => {
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA });
    la.send({ type: 'SET_FRAME', frame: 30 });
    la.send({ type: 'SET_DATA', data: { ...SAMPLE_DATA, totalFrames: 100 } });
    expect(la.getContext().currentFrame).toBe(0);
  });

  it('onFrameChange callback cagirilir', () => {
    const onFrameChange = vi.fn();
    const la = createLottieAnimation({ defaultData: SAMPLE_DATA, onFrameChange });
    la.send({ type: 'SET_FRAME', frame: 10 });
    expect(onFrameChange).toHaveBeenCalledWith(10);
  });

  it('subscribe calisiyor', () => {
    const la = createLottieAnimation();
    const listener = vi.fn();
    la.subscribe(listener);
    la.send({ type: 'PLAY' });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const la = createLottieAnimation();
    const listener = vi.fn();
    la.subscribe(listener);
    la.destroy();
    la.send({ type: 'PLAY' });
    expect(listener).not.toHaveBeenCalled();
  });
});
