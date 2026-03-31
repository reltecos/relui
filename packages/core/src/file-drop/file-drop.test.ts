/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFileDrop } from './file-drop.machine';

describe('createFileDrop', () => {
  // ── Baslangic durumu ──

  it('varsayilan context dogru baslar', () => {
    const api = createFileDrop();
    const ctx = api.getContext();
    expect(ctx.files).toEqual([]);
    expect(ctx.isDragging).toBe(false);
    expect(ctx.totalSize).toBe(0);
    expect(ctx.fileCount).toBe(0);
  });

  // ── ADD_FILES ──

  it('ADD_FILES dosyalari ekler', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'test.txt', size: 100, type: 'text/plain' }],
    });
    const ctx = api.getContext();
    expect(ctx.files).toHaveLength(1);
    expect(ctx.files[0].name).toBe('test.txt');
    expect(ctx.files[0].status).toBe('pending');
    expect(ctx.files[0].progress).toBe(0);
  });

  it('ADD_FILES birden fazla dosya ekler', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [
        { id: '1', name: 'a.txt', size: 100, type: 'text/plain' },
        { id: '2', name: 'b.txt', size: 200, type: 'text/plain' },
      ],
    });
    expect(api.getContext().files).toHaveLength(2);
  });

  it('ADD_FILES maxSize asildiysa dosyayi reddeder', () => {
    const onError = vi.fn();
    const api = createFileDrop({ maxSize: 50, onError });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'big.txt', size: 100, type: 'text/plain' }],
    });
    expect(api.getContext().files).toHaveLength(0);
    expect(onError).toHaveBeenCalled();
  });

  it('ADD_FILES maxFiles asildiysa dosyayi reddeder', () => {
    const onError = vi.fn();
    const api = createFileDrop({ maxFiles: 1, onError });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '2', name: 'b.txt', size: 10, type: 'text/plain' }],
    });
    expect(api.getContext().files).toHaveLength(1);
    expect(onError).toHaveBeenCalled();
  });

  it('ADD_FILES accept ile dosya tipi kontrol eder (image/*)', () => {
    const onError = vi.fn();
    const api = createFileDrop({ accept: 'image/*', onError });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'doc.txt', size: 10, type: 'text/plain' }],
    });
    expect(api.getContext().files).toHaveLength(0);
    expect(onError).toHaveBeenCalled();
  });

  it('ADD_FILES accept ile gecerli dosya tipini kabul eder (image/*)', () => {
    const api = createFileDrop({ accept: 'image/*' });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'photo.png', size: 10, type: 'image/png' }],
    });
    expect(api.getContext().files).toHaveLength(1);
  });

  it('ADD_FILES accept ile uzanti kontrol eder (.pdf)', () => {
    const onError = vi.fn();
    const api = createFileDrop({ accept: '.pdf', onError });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'doc.txt', size: 10, type: 'text/plain' }],
    });
    expect(api.getContext().files).toHaveLength(0);
    expect(onError).toHaveBeenCalled();

    api.send({
      type: 'ADD_FILES',
      files: [{ id: '2', name: 'doc.pdf', size: 10, type: 'application/pdf' }],
    });
    expect(api.getContext().files).toHaveLength(1);
  });

  it('ADD_FILES accept undefined ise tum dosyalari kabul eder', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'any.xyz', size: 10, type: 'application/octet-stream' }],
    });
    expect(api.getContext().files).toHaveLength(1);
  });

  it('ADD_FILES multiple=false ise sadece ilk dosyayi alir', () => {
    const api = createFileDrop({ multiple: false });
    api.send({
      type: 'ADD_FILES',
      files: [
        { id: '1', name: 'a.txt', size: 10, type: 'text/plain' },
        { id: '2', name: 'b.txt', size: 20, type: 'text/plain' },
      ],
    });
    expect(api.getContext().files).toHaveLength(1);
    expect(api.getContext().files[0].name).toBe('a.txt');
  });

  it('ADD_FILES multiple=false ise mevcut dosyayi degistirir', () => {
    const api = createFileDrop({ multiple: false });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '2', name: 'b.txt', size: 20, type: 'text/plain' }],
    });
    expect(api.getContext().files).toHaveLength(1);
    expect(api.getContext().files[0].name).toBe('b.txt');
  });

  // ── REMOVE_FILE ──

  it('REMOVE_FILE dosyayi kaldirir', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [
        { id: '1', name: 'a.txt', size: 10, type: 'text/plain' },
        { id: '2', name: 'b.txt', size: 20, type: 'text/plain' },
      ],
    });
    api.send({ type: 'REMOVE_FILE', id: '1' });
    expect(api.getContext().files).toHaveLength(1);
    expect(api.getContext().files[0].id).toBe('2');
  });

  it('REMOVE_FILE olmayan id icin no-op', () => {
    const listener = vi.fn();
    const api = createFileDrop();
    api.subscribe(listener);
    api.send({ type: 'REMOVE_FILE', id: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── SET_PROGRESS ──

  it('SET_PROGRESS dosya ilerlemesini gunceller', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    api.send({ type: 'SET_PROGRESS', id: '1', progress: 50 });
    expect(api.getContext().files[0].progress).toBe(50);
  });

  it('SET_PROGRESS degeri 0-100 arasinda clamp edilir', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    api.send({ type: 'SET_PROGRESS', id: '1', progress: 150 });
    expect(api.getContext().files[0].progress).toBe(100);

    api.send({ type: 'SET_PROGRESS', id: '1', progress: -10 });
    expect(api.getContext().files[0].progress).toBe(0);
  });

  // ── SET_STATUS ──

  it('SET_STATUS dosya durumunu gunceller', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    api.send({ type: 'SET_STATUS', id: '1', status: 'uploading' });
    expect(api.getContext().files[0].status).toBe('uploading');
  });

  it('SET_STATUS error mesaji ekler', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    api.send({ type: 'SET_STATUS', id: '1', status: 'error', error: 'Upload failed' });
    expect(api.getContext().files[0].status).toBe('error');
    expect(api.getContext().files[0].error).toBe('Upload failed');
  });

  // ── SET_DRAGGING ──

  it('SET_DRAGGING surukleme durumunu degistirir', () => {
    const api = createFileDrop();
    api.send({ type: 'SET_DRAGGING', isDragging: true });
    expect(api.getContext().isDragging).toBe(true);

    api.send({ type: 'SET_DRAGGING', isDragging: false });
    expect(api.getContext().isDragging).toBe(false);
  });

  // ── CLEAR ──

  it('CLEAR tum dosyalari temizler', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [
        { id: '1', name: 'a.txt', size: 10, type: 'text/plain' },
        { id: '2', name: 'b.txt', size: 20, type: 'text/plain' },
      ],
    });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().files).toHaveLength(0);
  });

  it('CLEAR bos liste icin no-op', () => {
    const listener = vi.fn();
    const api = createFileDrop();
    api.subscribe(listener);
    api.send({ type: 'CLEAR' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Computed ──

  it('totalSize dogru hesaplanir', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [
        { id: '1', name: 'a.txt', size: 100, type: 'text/plain' },
        { id: '2', name: 'b.txt', size: 250, type: 'text/plain' },
      ],
    });
    expect(api.getContext().totalSize).toBe(350);
  });

  it('fileCount dogru hesaplanir', () => {
    const api = createFileDrop();
    api.send({
      type: 'ADD_FILES',
      files: [
        { id: '1', name: 'a.txt', size: 10, type: 'text/plain' },
        { id: '2', name: 'b.txt', size: 20, type: 'text/plain' },
        { id: '3', name: 'c.txt', size: 30, type: 'text/plain' },
      ],
    });
    expect(api.getContext().fileCount).toBe(3);
  });

  // ── Callbacks ──

  it('onFilesChange dosya eklendiginde cagirilir', () => {
    const onChange = vi.fn();
    const api = createFileDrop({ onFilesChange: onChange });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'a.txt' })]),
    );
  });

  it('onFilesChange dosya kaldirildiginda cagirilir', () => {
    const onChange = vi.fn();
    const api = createFileDrop({ onFilesChange: onChange });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    onChange.mockClear();
    api.send({ type: 'REMOVE_FILE', id: '1' });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('onError gecersiz dosya icin cagirilir', () => {
    const onError = vi.fn();
    const api = createFileDrop({ maxSize: 5, onError });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'big.txt', size: 100, type: 'text/plain' }],
    });
    expect(onError).toHaveBeenCalled();
  });

  // ── Subscribe / Unsubscribe ──

  it('subscribe ile degisiklikler dinlenir', () => {
    const api = createFileDrop();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagirilmaz', () => {
    const api = createFileDrop();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Destroy ──

  it('destroy sonrasi listener cagirilmaz', () => {
    const api = createFileDrop();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Birden fazla subscriber ──

  it('birden fazla subscriber desteklenir', () => {
    const api = createFileDrop();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    api.subscribe(listener1);
    api.subscribe(listener2);
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'a.txt', size: 10, type: 'text/plain' }],
    });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  // ── Accept coklu format ──

  it('accept birden fazla format destekler', () => {
    const api = createFileDrop({ accept: 'image/*,.pdf' });
    api.send({
      type: 'ADD_FILES',
      files: [{ id: '1', name: 'photo.jpg', size: 10, type: 'image/jpeg' }],
    });
    expect(api.getContext().files).toHaveLength(1);

    api.send({
      type: 'ADD_FILES',
      files: [{ id: '2', name: 'doc.pdf', size: 10, type: 'application/pdf' }],
    });
    expect(api.getContext().files).toHaveLength(2);
  });
});
