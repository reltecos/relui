/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createLiveTile } from './live-tile.machine';

describe('createLiveTile', () => {
  // ── Create ──

  it('varsayilan degerlerle olusturulur', () => {
    const tile = createLiveTile();
    const ctx = tile.getContext();
    expect(ctx.activeIndex).toBe(0);
    expect(ctx.faceCount).toBe(2);
    expect(ctx.paused).toBe(false);
    expect(ctx.direction).toBe('next');
  });

  it('config ile olusturulur', () => {
    const tile = createLiveTile({ faceCount: 4, defaultIndex: 2 });
    const ctx = tile.getContext();
    expect(ctx.activeIndex).toBe(2);
    expect(ctx.faceCount).toBe(4);
  });

  it('defaultIndex faceCount icinde clamp edilir', () => {
    const tile = createLiveTile({ faceCount: 3, defaultIndex: 10 });
    expect(tile.getContext().activeIndex).toBe(2);
  });

  // ── NEXT ──

  it('NEXT ile sonraki face e gecilir', () => {
    const tile = createLiveTile({ faceCount: 3 });
    tile.send({ type: 'NEXT' });
    expect(tile.getContext().activeIndex).toBe(1);
    expect(tile.getContext().direction).toBe('next');
  });

  it('NEXT loop ile basa doner', () => {
    const tile = createLiveTile({ faceCount: 3, defaultIndex: 2, loop: true });
    tile.send({ type: 'NEXT' });
    expect(tile.getContext().activeIndex).toBe(0);
  });

  it('NEXT loop olmadan son face de kalir', () => {
    const tile = createLiveTile({ faceCount: 3, defaultIndex: 2, loop: false });
    tile.send({ type: 'NEXT' });
    expect(tile.getContext().activeIndex).toBe(2);
  });

  // ── PREV ──

  it('PREV ile onceki face e gecilir', () => {
    const tile = createLiveTile({ faceCount: 3, defaultIndex: 1 });
    tile.send({ type: 'PREV' });
    expect(tile.getContext().activeIndex).toBe(0);
    expect(tile.getContext().direction).toBe('prev');
  });

  it('PREV loop ile sona gider', () => {
    const tile = createLiveTile({ faceCount: 3, defaultIndex: 0, loop: true });
    tile.send({ type: 'PREV' });
    expect(tile.getContext().activeIndex).toBe(2);
  });

  it('PREV loop olmadan ilk face de kalir', () => {
    const tile = createLiveTile({ faceCount: 3, defaultIndex: 0, loop: false });
    tile.send({ type: 'PREV' });
    expect(tile.getContext().activeIndex).toBe(0);
  });

  // ── GOTO ──

  it('GOTO ile belirli face e gidilir', () => {
    const tile = createLiveTile({ faceCount: 5 });
    tile.send({ type: 'GOTO', index: 3 });
    expect(tile.getContext().activeIndex).toBe(3);
  });

  it('GOTO ayni index e notify etmez', () => {
    const onChange = vi.fn();
    const tile = createLiveTile({ faceCount: 5, onChange });
    tile.send({ type: 'GOTO', index: 0 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('GOTO direction dogru ayarlanir (ileri)', () => {
    const tile = createLiveTile({ faceCount: 5, defaultIndex: 1 });
    tile.send({ type: 'GOTO', index: 3 });
    expect(tile.getContext().direction).toBe('next');
  });

  it('GOTO direction dogru ayarlanir (geri)', () => {
    const tile = createLiveTile({ faceCount: 5, defaultIndex: 3 });
    tile.send({ type: 'GOTO', index: 1 });
    expect(tile.getContext().direction).toBe('prev');
  });

  it('GOTO sinir disina clamp edilir', () => {
    const tile = createLiveTile({ faceCount: 3 });
    tile.send({ type: 'GOTO', index: 100 });
    expect(tile.getContext().activeIndex).toBe(2);
  });

  // ── PAUSE / RESUME ──

  it('PAUSE ile duraklatilir', () => {
    const tile = createLiveTile();
    tile.send({ type: 'PAUSE' });
    expect(tile.getContext().paused).toBe(true);
  });

  it('RESUME ile devam ettirilir', () => {
    const tile = createLiveTile();
    tile.send({ type: 'PAUSE' });
    tile.send({ type: 'RESUME' });
    expect(tile.getContext().paused).toBe(false);
  });

  it('PAUSE zaten paused iken notify etmez', () => {
    const listener = vi.fn();
    const tile = createLiveTile();
    tile.send({ type: 'PAUSE' });
    tile.subscribe(listener);
    tile.send({ type: 'PAUSE' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('RESUME zaten running iken notify etmez', () => {
    const listener = vi.fn();
    const tile = createLiveTile();
    tile.subscribe(listener);
    tile.send({ type: 'RESUME' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── SET_FACE_COUNT ──

  it('SET_FACE_COUNT ile face sayisi guncellenir', () => {
    const tile = createLiveTile({ faceCount: 3 });
    tile.send({ type: 'SET_FACE_COUNT', count: 5 });
    expect(tile.getContext().faceCount).toBe(5);
  });

  it('SET_FACE_COUNT activeIndex i clamp eder', () => {
    const tile = createLiveTile({ faceCount: 5, defaultIndex: 4 });
    tile.send({ type: 'SET_FACE_COUNT', count: 2 });
    expect(tile.getContext().activeIndex).toBe(1);
  });

  it('SET_FACE_COUNT minimum 1', () => {
    const tile = createLiveTile();
    tile.send({ type: 'SET_FACE_COUNT', count: 0 });
    expect(tile.getContext().faceCount).toBe(1);
  });

  it('SET_FACE_COUNT ayni degerle notify etmez', () => {
    const listener = vi.fn();
    const tile = createLiveTile({ faceCount: 3 });
    tile.subscribe(listener);
    tile.send({ type: 'SET_FACE_COUNT', count: 3 });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik bildirilir', () => {
    const tile = createLiveTile();
    const listener = vi.fn();
    tile.subscribe(listener);
    tile.send({ type: 'NEXT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe calisiyor', () => {
    const tile = createLiveTile();
    const listener = vi.fn();
    const unsub = tile.subscribe(listener);
    unsub();
    tile.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Destroy ──

  it('destroy tum listener lari temizler', () => {
    const tile = createLiveTile();
    const listener = vi.fn();
    tile.subscribe(listener);
    tile.destroy();
    tile.send({ type: 'NEXT' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── onChange ──

  it('onChange callback NEXT te cagrilir', () => {
    const onChange = vi.fn();
    const tile = createLiveTile({ faceCount: 3, onChange });
    tile.send({ type: 'NEXT' });
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
