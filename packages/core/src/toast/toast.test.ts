/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createToast } from './toast.machine';

describe('createToast', () => {
  // ── Defaults ──────────────────────────────────────
  it('bos context ile baslar', () => {
    const api = createToast();
    const ctx = api.getContext();
    expect(ctx.toasts).toEqual([]);
    expect(ctx.maxVisible).toBe(5);
  });

  it('config ile maxVisible ayarlanir', () => {
    const api = createToast({ maxVisible: 3 });
    expect(api.getContext().maxVisible).toBe(3);
  });

  // ── ADD ───────────────────────────────────────────
  it('ADD ile toast eklenir', () => {
    const api = createToast();
    api.send({
      type: 'ADD',
      toast: { id: 't1', status: 'info', message: 'Merhaba', duration: 3000, closable: true },
    });
    const toasts = api.getContext().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].id).toBe('t1');
    expect(toasts[0].message).toBe('Merhaba');
    expect(toasts[0].status).toBe('info');
    expect(toasts[0].paused).toBe(false);
  });

  it('ADD varsayilan duration kullanir', () => {
    const api = createToast({ defaultDuration: 7000 });
    api.send({
      type: 'ADD',
      toast: { id: 't1', status: 'info', message: 'Test', duration: 7000, closable: true },
    });
    expect(api.getContext().toasts[0].duration).toBe(7000);
  });

  it('ADD birden fazla toast ekler', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't2', status: 'success', message: 'B', duration: 3000, closable: true } });
    expect(api.getContext().toasts).toHaveLength(2);
  });

  it('ADD ayni id ile guncelleme yapar', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'Eski', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't1', status: 'success', message: 'Yeni', duration: 3000, closable: true } });
    expect(api.getContext().toasts).toHaveLength(1);
    expect(api.getContext().toasts[0].message).toBe('Yeni');
    expect(api.getContext().toasts[0].status).toBe('success');
  });

  it('ADD maxVisible asiminda en eski kaldirilir', () => {
    const onRemove = vi.fn();
    const api = createToast({ maxVisible: 2, onRemove });
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't2', status: 'info', message: 'B', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't3', status: 'info', message: 'C', duration: 3000, closable: true } });
    expect(api.getContext().toasts).toHaveLength(2);
    expect(api.getContext().toasts[0].id).toBe('t2');
    expect(api.getContext().toasts[1].id).toBe('t3');
    expect(onRemove).toHaveBeenCalledWith('t1');
  });

  it('ADD notify calistirir', () => {
    const api = createToast();
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  // ── REMOVE ────────────────────────────────────────
  it('REMOVE ile toast kaldirilir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'REMOVE', id: 't1' });
    expect(api.getContext().toasts).toHaveLength(0);
  });

  it('REMOVE onRemove callback calistirir', () => {
    const onRemove = vi.fn();
    const api = createToast({ onRemove });
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'REMOVE', id: 't1' });
    expect(onRemove).toHaveBeenCalledWith('t1');
  });

  it('REMOVE olmayan id icin sessiz kalir', () => {
    const api = createToast();
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'REMOVE', id: 'yok' });
    expect(cb).not.toHaveBeenCalled();
  });

  // ── REMOVE_ALL ────────────────────────────────────
  it('REMOVE_ALL tum toastlari kaldirir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't2', status: 'info', message: 'B', duration: 3000, closable: true } });
    api.send({ type: 'REMOVE_ALL' });
    expect(api.getContext().toasts).toHaveLength(0);
  });

  it('REMOVE_ALL her toast icin onRemove calistirir', () => {
    const onRemove = vi.fn();
    const api = createToast({ onRemove });
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't2', status: 'info', message: 'B', duration: 3000, closable: true } });
    api.send({ type: 'REMOVE_ALL' });
    expect(onRemove).toHaveBeenCalledTimes(2);
    expect(onRemove).toHaveBeenCalledWith('t1');
    expect(onRemove).toHaveBeenCalledWith('t2');
  });

  // ── PAUSE / RESUME ────────────────────────────────
  it('PAUSE ile toast duraklatilir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 5000, closable: true } });
    api.send({ type: 'PAUSE', id: 't1' });
    expect(api.getContext().toasts[0].paused).toBe(true);
  });

  it('PAUSE zaten duraklatilmis ise notify etmez', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 5000, closable: true } });
    api.send({ type: 'PAUSE', id: 't1' });
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'PAUSE', id: 't1' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('RESUME ile toast devam eder', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 5000, closable: true } });
    api.send({ type: 'PAUSE', id: 't1' });
    api.send({ type: 'RESUME', id: 't1' });
    expect(api.getContext().toasts[0].paused).toBe(false);
  });

  it('RESUME duraklatilmamis ise notify etmez', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 5000, closable: true } });
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'RESUME', id: 't1' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('PAUSE remaining sureyi hesaplar', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 5000, closable: true } });
    api.send({ type: 'PAUSE', id: 't1' });
    const toast = api.getContext().toasts[0];
    // remaining 0 ile 5000 arasi olmali
    expect(toast.remaining).toBeGreaterThanOrEqual(0);
    expect(toast.remaining).toBeLessThanOrEqual(5000);
  });

  // ── UPDATE ────────────────────────────────────────
  it('UPDATE ile toast mesaji guncellenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'Eski', duration: 3000, closable: true } });
    api.send({ type: 'UPDATE', id: 't1', updates: { message: 'Yeni' } });
    expect(api.getContext().toasts[0].message).toBe('Yeni');
  });

  it('UPDATE ile toast status guncellenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'Test', duration: 3000, closable: true } });
    api.send({ type: 'UPDATE', id: 't1', updates: { status: 'success' } });
    expect(api.getContext().toasts[0].status).toBe('success');
  });

  it('UPDATE ile toast title guncellenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'Test', duration: 3000, closable: true } });
    api.send({ type: 'UPDATE', id: 't1', updates: { title: 'Yeni Baslik' } });
    expect(api.getContext().toasts[0].title).toBe('Yeni Baslik');
  });

  it('UPDATE ile toast duration guncellenir ve timer sifirlanir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'Test', duration: 3000, closable: true } });
    api.send({ type: 'UPDATE', id: 't1', updates: { duration: 10000 } });
    const toast = api.getContext().toasts[0];
    expect(toast.duration).toBe(10000);
    expect(toast.remaining).toBe(10000);
  });

  it('UPDATE olmayan id icin sessiz kalir', () => {
    const api = createToast();
    const cb = vi.fn();
    api.subscribe(cb);
    api.send({ type: 'UPDATE', id: 'yok', updates: { message: 'x' } });
    expect(cb).not.toHaveBeenCalled();
  });

  // ── Subscribe ─────────────────────────────────────
  it('subscribe ile dinler, unsubscribe ile iptal', () => {
    const api = createToast();
    const cb = vi.fn();
    const unsub = api.subscribe(cb);
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    expect(cb).toHaveBeenCalledTimes(1);
    unsub();
    api.send({ type: 'ADD', toast: { id: 't2', status: 'info', message: 'B', duration: 3000, closable: true } });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  // ── closable ──────────────────────────────────────
  it('closable false ile toast eklenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: false } });
    expect(api.getContext().toasts[0].closable).toBe(false);
  });

  // ── Toast status cesitleri ────────────────────────
  it('success status ile toast eklenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'success', message: 'OK', duration: 3000, closable: true } });
    expect(api.getContext().toasts[0].status).toBe('success');
  });

  it('warning status ile toast eklenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'warning', message: 'Dikkat', duration: 3000, closable: true } });
    expect(api.getContext().toasts[0].status).toBe('warning');
  });

  it('error status ile toast eklenir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'error', message: 'Hata', duration: 3000, closable: true } });
    expect(api.getContext().toasts[0].status).toBe('error');
  });

  // ── Siralama ──────────────────────────────────────
  it('toastlar ekleme sirasinda tutulur', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't2', status: 'info', message: 'B', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't3', status: 'info', message: 'C', duration: 3000, closable: true } });
    const ids = api.getContext().toasts.map((t) => t.id);
    expect(ids).toEqual(['t1', 't2', 't3']);
  });

  it('REMOVE ortadaki toasti kaldirir', () => {
    const api = createToast();
    api.send({ type: 'ADD', toast: { id: 't1', status: 'info', message: 'A', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't2', status: 'info', message: 'B', duration: 3000, closable: true } });
    api.send({ type: 'ADD', toast: { id: 't3', status: 'info', message: 'C', duration: 3000, closable: true } });
    api.send({ type: 'REMOVE', id: 't2' });
    const ids = api.getContext().toasts.map((t) => t.id);
    expect(ids).toEqual(['t1', 't3']);
  });
});
