/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createVideoPlayer } from './video-player.machine';

describe('createVideoPlayer', () => {
  it('varsayilan context', () => {
    const api = createVideoPlayer();
    const ctx = api.getContext();
    expect(ctx.isPlaying).toBe(false);
    expect(ctx.currentTime).toBe(0);
    expect(ctx.duration).toBe(0);
    expect(ctx.volume).toBe(1);
    expect(ctx.muted).toBe(false);
    expect(ctx.speed).toBe(1);
    expect(ctx.isFullscreen).toBe(false);
    expect(ctx.progress).toBe(0);
    api.destroy();
  });

  it('PLAY oynatir', () => {
    const onPlay = vi.fn();
    const api = createVideoPlayer({ onPlay });
    api.send({ type: 'PLAY' });
    expect(api.getContext().isPlaying).toBe(true);
    expect(onPlay).toHaveBeenCalled();
    api.destroy();
  });

  it('PAUSE durdurur', () => {
    const onPause = vi.fn();
    const api = createVideoPlayer({ onPause });
    api.send({ type: 'PLAY' });
    api.send({ type: 'PAUSE' });
    expect(api.getContext().isPlaying).toBe(false);
    expect(onPause).toHaveBeenCalled();
    api.destroy();
  });

  it('TOGGLE play/pause degistirir', () => {
    const api = createVideoPlayer();
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().isPlaying).toBe(true);
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().isPlaying).toBe(false);
    api.destroy();
  });

  it('PLAY zaten oynatiliyorsa notify etmez', () => {
    const api = createVideoPlayer();
    api.send({ type: 'PLAY' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'PLAY' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  it('SEEK zamani degistirir', () => {
    const api = createVideoPlayer();
    api.send({ type: 'LOADED', duration: 100 });
    api.send({ type: 'SEEK', time: 50 });
    expect(api.getContext().currentTime).toBe(50);
    api.destroy();
  });

  it('SEEK sinir disina clamp eder', () => {
    const api = createVideoPlayer();
    api.send({ type: 'LOADED', duration: 100 });
    api.send({ type: 'SEEK', time: 150 });
    expect(api.getContext().currentTime).toBe(100);
    api.send({ type: 'SEEK', time: -10 });
    expect(api.getContext().currentTime).toBe(0);
    api.destroy();
  });

  it('SET_VOLUME sesi degistirir', () => {
    const api = createVideoPlayer();
    api.send({ type: 'SET_VOLUME', volume: 0.5 });
    expect(api.getContext().volume).toBe(0.5);
    api.destroy();
  });

  it('SET_VOLUME 0-1 arasi clamp eder', () => {
    const api = createVideoPlayer();
    api.send({ type: 'SET_VOLUME', volume: 1.5 });
    expect(api.getContext().volume).toBe(1);
    api.send({ type: 'SET_VOLUME', volume: -0.5 });
    expect(api.getContext().volume).toBe(0);
    api.destroy();
  });

  it('SET_MUTED sessiz modu degistirir', () => {
    const api = createVideoPlayer();
    api.send({ type: 'SET_MUTED', muted: true });
    expect(api.getContext().muted).toBe(true);
    api.destroy();
  });

  it('TOGGLE_MUTE sessiz modunu toggle eder', () => {
    const api = createVideoPlayer();
    api.send({ type: 'TOGGLE_MUTE' });
    expect(api.getContext().muted).toBe(true);
    api.send({ type: 'TOGGLE_MUTE' });
    expect(api.getContext().muted).toBe(false);
    api.destroy();
  });

  it('SET_SPEED hizi degistirir', () => {
    const api = createVideoPlayer();
    api.send({ type: 'SET_SPEED', speed: 2 });
    expect(api.getContext().speed).toBe(2);
    api.destroy();
  });

  it('SET_FULLSCREEN tam ekran degistirir', () => {
    const api = createVideoPlayer();
    api.send({ type: 'SET_FULLSCREEN', fullscreen: true });
    expect(api.getContext().isFullscreen).toBe(true);
    api.destroy();
  });

  it('TIME_UPDATE zaman gunceller', () => {
    const onTimeUpdate = vi.fn();
    const api = createVideoPlayer({ onTimeUpdate });
    api.send({ type: 'TIME_UPDATE', currentTime: 30, duration: 120, buffered: 60 });
    const ctx = api.getContext();
    expect(ctx.currentTime).toBe(30);
    expect(ctx.duration).toBe(120);
    expect(ctx.buffered).toBe(60);
    expect(ctx.progress).toBe(25);
    expect(onTimeUpdate).toHaveBeenCalledWith(30, 120);
    api.destroy();
  });

  it('LOADED duration ayarlar', () => {
    const api = createVideoPlayer();
    api.send({ type: 'LOADED', duration: 200 });
    expect(api.getContext().duration).toBe(200);
    api.destroy();
  });

  it('video bitince isPlaying false olur', () => {
    const onEnded = vi.fn();
    const api = createVideoPlayer({ onEnded });
    api.send({ type: 'PLAY' });
    api.send({ type: 'TIME_UPDATE', currentTime: 100, duration: 100, buffered: 100 });
    expect(api.getContext().isPlaying).toBe(false);
    expect(onEnded).toHaveBeenCalled();
    api.destroy();
  });

  it('subscribe/unsubscribe calisir', () => {
    const api = createVideoPlayer();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    api.send({ type: 'PLAY' });
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
    api.send({ type: 'PAUSE' });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createVideoPlayer();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'PLAY' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('config.volume ile baslar', () => {
    const api = createVideoPlayer({ volume: 0.3 });
    expect(api.getContext().volume).toBe(0.3);
    api.destroy();
  });

  it('config.muted ile baslar', () => {
    const api = createVideoPlayer({ muted: true });
    expect(api.getContext().muted).toBe(true);
    api.destroy();
  });
});
