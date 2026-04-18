/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createImageCropper } from './image-cropper.machine';

describe('createImageCropper', () => {
  it('baslangic crop alani 100x100', () => {
    const api = createImageCropper();
    expect(api.getContext().crop).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });

  it('baslangic zoom 1', () => {
    expect(createImageCropper().getContext().zoom).toBe(1);
  });

  it('baslangic rotation 0', () => {
    expect(createImageCropper().getContext().rotation).toBe(0);
  });

  it('baslangic aspectRatio free', () => {
    expect(createImageCropper().getContext().aspectRatio).toBe('free');
  });

  it('config ile defaults ayarlanir', () => {
    const api = createImageCropper({ defaultAspectRatio: '1:1', defaultZoom: 2 });
    expect(api.getContext().aspectRatio).toBe('1:1');
    expect(api.getContext().zoom).toBe(2);
  });

  it('SET_CROP crop alanini degistirir', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_CROP', crop: { x: 10, y: 20, width: 200, height: 150 } });
    expect(api.getContext().crop).toEqual({ x: 10, y: 20, width: 200, height: 150 });
  });

  it('SET_ZOOM zoom ayarlar', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ZOOM', zoom: 2.5 });
    expect(api.getContext().zoom).toBe(2.5);
  });

  it('SET_ZOOM 0.1 altina indirilmez', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ZOOM', zoom: 0.01 });
    expect(api.getContext().zoom).toBe(0.1);
  });

  it('SET_ZOOM 5 ustune cikarilmaz', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ZOOM', zoom: 10 });
    expect(api.getContext().zoom).toBe(5);
  });

  it('SET_ROTATION rotation ayarlar', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ROTATION', rotation: 90 });
    expect(api.getContext().rotation).toBe(90);
  });

  it('SET_ROTATION negatif normalize edilir', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ROTATION', rotation: -90 });
    expect(api.getContext().rotation).toBe(270);
  });

  it('SET_ROTATION 360+ normalize edilir', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ROTATION', rotation: 450 });
    expect(api.getContext().rotation).toBe(90);
  });

  it('SET_ASPECT_RATIO 1:1 uygulanir', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ASPECT_RATIO', aspectRatio: '1:1' });
    expect(api.getContext().aspectRatio).toBe('1:1');
    expect(api.getContext().crop.width).toBe(api.getContext().crop.height);
  });

  it('SET_ASPECT_RATIO 4:3 uygulanir', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ASPECT_RATIO', aspectRatio: '4:3' });
    const c = api.getContext().crop;
    expect(Math.abs(c.width / c.height - 4 / 3)).toBeLessThan(0.01);
  });

  it('SET_ASPECT_RATIO 16:9 uygulanir', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ASPECT_RATIO', aspectRatio: '16:9' });
    const c = api.getContext().crop;
    expect(Math.abs(c.width / c.height - 16 / 9)).toBeLessThan(0.01);
  });

  it('RESET tum degerleri sifirlar', () => {
    const api = createImageCropper();
    api.send({ type: 'SET_ZOOM', zoom: 3 });
    api.send({ type: 'SET_ROTATION', rotation: 180 });
    api.send({ type: 'RESET' });
    expect(api.getContext().zoom).toBe(1);
    expect(api.getContext().rotation).toBe(0);
    expect(api.getContext().crop).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });

  it('onCropChange callback cagirilir', () => {
    const fn = vi.fn();
    const api = createImageCropper({ onCropChange: fn });
    api.send({ type: 'SET_CROP', crop: { x: 0, y: 0, width: 50, height: 50 } });
    expect(fn).toHaveBeenCalled();
  });

  it('subscribe calisir', () => {
    const api = createImageCropper();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_ZOOM', zoom: 2 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('destroy temizler', () => {
    const api = createImageCropper();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_ZOOM', zoom: 2 });
    expect(fn).not.toHaveBeenCalled();
  });
});
