/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createWebcamCapture } from './webcam-capture.machine';

describe('createWebcamCapture', () => {
  it('varsayilan degerle olusturulur', () => {
    const wc = createWebcamCapture();
    const ctx = wc.getContext();
    expect(ctx.state).toBe('idle');
    expect(ctx.mirror).toBe(true);
    expect(ctx.facingMode).toBe('user');
    expect(ctx.recording).toBe(false);
  });

  it('START ile requesting durumuna gecer', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    expect(wc.getContext().state).toBe('requesting');
  });

  it('STARTED ile active durumuna gecer', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    expect(wc.getContext().state).toBe('active');
  });

  it('START aktifken notify etmez', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    const listener = vi.fn();
    wc.subscribe(listener);
    wc.send({ type: 'START' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('STOP ile idle durumuna doner', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'STOP' });
    expect(wc.getContext().state).toBe('idle');
  });

  it('ERROR ile error durumuna gecer', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'ERROR', message: 'Permission denied' });
    expect(wc.getContext().state).toBe('error');
    expect(wc.getContext().error).toBe('Permission denied');
  });

  it('ERROR onError callback cagirilir', () => {
    const onError = vi.fn();
    const wc = createWebcamCapture({ onError });
    wc.send({ type: 'ERROR', message: 'fail' });
    expect(onError).toHaveBeenCalledWith('fail');
  });

  it('CAPTURE_PHOTO ile foto cekilir', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'CAPTURE_PHOTO', dataUrl: 'data:image/png;base64,abc' });
    expect(wc.getContext().lastPhotoUrl).toBe('data:image/png;base64,abc');
  });

  it('CAPTURE_PHOTO aktif degilken ignore edilir', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'CAPTURE_PHOTO', dataUrl: 'data:xxx' });
    expect(wc.getContext().lastPhotoUrl).toBeNull();
  });

  it('CAPTURE_PHOTO onPhoto callback cagirilir', () => {
    const onPhoto = vi.fn();
    const wc = createWebcamCapture({ onPhoto });
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'CAPTURE_PHOTO', dataUrl: 'data:xxx' });
    expect(onPhoto).toHaveBeenCalledWith('data:xxx');
  });

  it('START_RECORDING ile kayit baslar', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'START_RECORDING' });
    expect(wc.getContext().recording).toBe(true);
  });

  it('START_RECORDING aktif degilken ignore edilir', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START_RECORDING' });
    expect(wc.getContext().recording).toBe(false);
  });

  it('STOP_RECORDING ile kayit biter', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'START_RECORDING' });
    wc.send({ type: 'STOP_RECORDING', blobUrl: 'blob:xxx' });
    expect(wc.getContext().recording).toBe(false);
    expect(wc.getContext().lastVideoUrl).toBe('blob:xxx');
  });

  it('STOP_RECORDING onVideo callback cagirilir', () => {
    const onVideo = vi.fn();
    const wc = createWebcamCapture({ onVideo });
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'START_RECORDING' });
    wc.send({ type: 'STOP_RECORDING', blobUrl: 'blob:x' });
    expect(onVideo).toHaveBeenCalledWith('blob:x');
  });

  it('SET_FACING ile kamera yonu degisir', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'SET_FACING', facingMode: 'environment' });
    expect(wc.getContext().facingMode).toBe('environment');
  });

  it('SET_FACING ayni degerle notify etmez', () => {
    const wc = createWebcamCapture();
    const listener = vi.fn();
    wc.subscribe(listener);
    wc.send({ type: 'SET_FACING', facingMode: 'user' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('SET_MIRROR ile ayna modu degisir', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'SET_MIRROR', mirror: false });
    expect(wc.getContext().mirror).toBe(false);
  });

  it('STOP kaydi da durdurur', () => {
    const wc = createWebcamCapture();
    wc.send({ type: 'START' });
    wc.send({ type: 'STARTED' });
    wc.send({ type: 'START_RECORDING' });
    wc.send({ type: 'STOP' });
    expect(wc.getContext().recording).toBe(false);
  });

  it('subscribe calisiyor', () => {
    const wc = createWebcamCapture();
    const listener = vi.fn();
    wc.subscribe(listener);
    wc.send({ type: 'START' });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const wc = createWebcamCapture();
    const listener = vi.fn();
    wc.subscribe(listener);
    wc.destroy();
    wc.send({ type: 'START' });
    expect(listener).not.toHaveBeenCalled();
  });
});
