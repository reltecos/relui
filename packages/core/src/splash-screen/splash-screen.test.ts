/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSplashScreen } from './splash-screen.machine';

describe('createSplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Baslangic durumu ──

  it('varsayilan olarak gorunur degil', () => {
    const api = createSplashScreen();
    expect(api.getContext().visible).toBe(false);
    expect(api.getContext().progress).toBe(0);
    expect(api.getContext().message).toBe('');
  });

  it('visible: true ile baslayabilir', () => {
    const api = createSplashScreen({ visible: true });
    expect(api.getContext().visible).toBe(true);
  });

  it('message ile baslayabilir', () => {
    const api = createSplashScreen({ message: 'Yukleniyor...' });
    expect(api.getContext().message).toBe('Yukleniyor...');
  });

  // ── OPEN ──

  it('OPEN ile gorunur olur', () => {
    const api = createSplashScreen();
    api.send({ type: 'OPEN' });
    expect(api.getContext().visible).toBe(true);
  });

  it('zaten gorunurken OPEN notify yapmaz', () => {
    const api = createSplashScreen({ visible: true });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('OPEN onVisibleChange(true) cagirir', () => {
    const onVisibleChange = vi.fn();
    const api = createSplashScreen({ onVisibleChange });
    api.send({ type: 'OPEN' });
    expect(onVisibleChange).toHaveBeenCalledWith(true);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createSplashScreen({ visible: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().visible).toBe(false);
  });

  it('gorunur degilken CLOSE notify yapmaz', () => {
    const api = createSplashScreen();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLOSE onVisibleChange(false) cagirir', () => {
    const onVisibleChange = vi.fn();
    const api = createSplashScreen({ visible: true, onVisibleChange });
    api.send({ type: 'CLOSE' });
    expect(onVisibleChange).toHaveBeenCalledWith(false);
  });

  // ── SET_PROGRESS ──

  it('SET_PROGRESS ile ilerleme guncellenir', () => {
    const api = createSplashScreen();
    api.send({ type: 'SET_PROGRESS', value: 50 });
    expect(api.getContext().progress).toBe(50);
  });

  it('progress 0-100 arasina clamp edilir (ust)', () => {
    const api = createSplashScreen();
    api.send({ type: 'SET_PROGRESS', value: 150 });
    expect(api.getContext().progress).toBe(100);
  });

  it('progress 0-100 arasina clamp edilir (alt)', () => {
    const api = createSplashScreen();
    api.send({ type: 'SET_PROGRESS', value: -10 });
    expect(api.getContext().progress).toBe(0);
  });

  it('ayni progress degeri notify yapmaz', () => {
    const api = createSplashScreen();
    api.send({ type: 'SET_PROGRESS', value: 50 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_PROGRESS', value: 50 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Auto-close ──

  it('progress 100 olunca autoClose ile kapanir (delay sonrasi)', () => {
    const onComplete = vi.fn();
    const api = createSplashScreen({ visible: true, onComplete });
    api.send({ type: 'SET_PROGRESS', value: 100 });
    expect(api.getContext().visible).toBe(true); // henuz kapanmadi
    vi.advanceTimersByTime(500);
    expect(api.getContext().visible).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('autoClose: false iken progress 100 olunca kapanmaz', () => {
    const api = createSplashScreen({ visible: true, autoClose: false });
    api.send({ type: 'SET_PROGRESS', value: 100 });
    vi.advanceTimersByTime(1000);
    expect(api.getContext().visible).toBe(true);
  });

  it('autoCloseDelay ozel deger ile calisir', () => {
    const onComplete = vi.fn();
    const api = createSplashScreen({ visible: true, onComplete, autoCloseDelay: 1000 });
    api.send({ type: 'SET_PROGRESS', value: 100 });
    vi.advanceTimersByTime(500);
    expect(api.getContext().visible).toBe(true);
    vi.advanceTimersByTime(500);
    expect(api.getContext().visible).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('autoCloseDelay 0 iken aninda kapanir', () => {
    const onComplete = vi.fn();
    const api = createSplashScreen({ visible: true, onComplete, autoCloseDelay: 0 });
    api.send({ type: 'SET_PROGRESS', value: 100 });
    expect(api.getContext().visible).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('auto-close timer CLOSE ile iptal edilir', () => {
    const onComplete = vi.fn();
    const api = createSplashScreen({ visible: true, onComplete });
    api.send({ type: 'SET_PROGRESS', value: 100 });
    api.send({ type: 'CLOSE' }); // timer iptal et
    vi.advanceTimersByTime(1000);
    expect(onComplete).not.toHaveBeenCalled();
  });

  // ── SET_MESSAGE ──

  it('SET_MESSAGE ile mesaj guncellenir', () => {
    const api = createSplashScreen();
    api.send({ type: 'SET_MESSAGE', message: 'Moduller yukleniyor...' });
    expect(api.getContext().message).toBe('Moduller yukleniyor...');
  });

  it('ayni mesaj notify yapmaz', () => {
    const api = createSplashScreen({ message: 'Test' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_MESSAGE', message: 'Test' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── subscribe ──

  it('subscribe ile dinleyici eklenir', () => {
    const api = createSplashScreen();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createSplashScreen();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Birden fazla ilerleme guncellemesi ──

  it('kademeli ilerleme dogru calisir', () => {
    const api = createSplashScreen({ visible: true });
    api.send({ type: 'SET_PROGRESS', value: 25 });
    expect(api.getContext().progress).toBe(25);
    api.send({ type: 'SET_PROGRESS', value: 50 });
    expect(api.getContext().progress).toBe(50);
    api.send({ type: 'SET_PROGRESS', value: 75 });
    expect(api.getContext().progress).toBe(75);
  });

  it('progress ve message birlikte guncellenebilir', () => {
    const api = createSplashScreen({ visible: true });
    api.send({ type: 'SET_PROGRESS', value: 30 });
    api.send({ type: 'SET_MESSAGE', message: 'Veritabani baglaniyor...' });
    expect(api.getContext().progress).toBe(30);
    expect(api.getContext().message).toBe('Veritabani baglaniyor...');
  });

  it('auto-close onVisibleChange(false) cagirir', () => {
    const onVisibleChange = vi.fn();
    const api = createSplashScreen({ visible: true, onVisibleChange });
    api.send({ type: 'SET_PROGRESS', value: 100 });
    vi.advanceTimersByTime(500);
    expect(onVisibleChange).toHaveBeenCalledWith(false);
  });
});
