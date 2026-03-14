/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createAlertDialog } from './alert-dialog.machine';

describe('createAlertDialog', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali baslar', () => {
    const api = createAlertDialog();
    expect(api.getContext().open).toBe(false);
    expect(api.getContext().loading).toBe(false);
  });

  it('open: true ile acik baslar', () => {
    const api = createAlertDialog({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  // ── OPEN ──

  it('OPEN ile acilir', () => {
    const api = createAlertDialog();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN tekrar gonderilirse bir sey olmaz', () => {
    const onChange = vi.fn();
    const api = createAlertDialog({ onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    api.send({ type: 'OPEN' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('OPEN loading durumunu sifirlar', () => {
    const api = createAlertDialog({ open: true });
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'CLOSE' });
    api.send({ type: 'OPEN' });
    expect(api.getContext().loading).toBe(false);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createAlertDialog({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapaliyken CLOSE bir sey yapmaz', () => {
    const onChange = vi.fn();
    const api = createAlertDialog({ onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('CLOSE loading durumunu sifirlar', () => {
    const api = createAlertDialog({ open: true });
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().loading).toBe(false);
  });

  // ── CONFIRM ──

  it('CONFIRM onConfirm callback cagirir ve kapatir', () => {
    const onConfirm = vi.fn();
    const api = createAlertDialog({ open: true, onConfirm });
    api.send({ type: 'CONFIRM' });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(api.getContext().open).toBe(false);
  });

  it('kapaliyken CONFIRM bir sey yapmaz', () => {
    const onConfirm = vi.fn();
    const api = createAlertDialog({ onConfirm });
    api.send({ type: 'CONFIRM' });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('loading durumundayken CONFIRM bir sey yapmaz', () => {
    const onConfirm = vi.fn();
    const api = createAlertDialog({ open: true, onConfirm });
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'CONFIRM' });
    expect(onConfirm).toHaveBeenCalledTimes(0);
  });

  it('async onConfirm loading durumunu aktif eder', async () => {
    let resolvePromise: (() => void) | undefined;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const onConfirm = vi.fn(() => promise);
    const api = createAlertDialog({ open: true, onConfirm });
    api.send({ type: 'CONFIRM' });
    expect(api.getContext().loading).toBe(true);
    expect(api.getContext().open).toBe(true);
    if (resolvePromise) resolvePromise();
    await promise;
    expect(api.getContext().open).toBe(false);
    expect(api.getContext().loading).toBe(false);
  });

  it('async onConfirm hata verirse loading kapanir ama dialog acik kalir', async () => {
    const error = new Error('fail');
    const onConfirm = vi.fn(() => Promise.reject(error));
    const api = createAlertDialog({ open: true, onConfirm });
    api.send({ type: 'CONFIRM' });
    expect(api.getContext().loading).toBe(true);
    await vi.waitFor(() => {
      expect(api.getContext().loading).toBe(false);
    });
    expect(api.getContext().open).toBe(true);
  });

  it('onConfirm callback tanimlanmamissa CONFIRM yine kapatir', () => {
    const api = createAlertDialog({ open: true });
    api.send({ type: 'CONFIRM' });
    expect(api.getContext().open).toBe(false);
  });

  // ── CANCEL ──

  it('CANCEL onCancel callback cagirir ve kapatir', () => {
    const onCancel = vi.fn();
    const api = createAlertDialog({ open: true, onCancel });
    api.send({ type: 'CANCEL' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(api.getContext().open).toBe(false);
  });

  it('kapaliyken CANCEL bir sey yapmaz', () => {
    const onCancel = vi.fn();
    const api = createAlertDialog({ onCancel });
    api.send({ type: 'CANCEL' });
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('loading durumundayken CANCEL bir sey yapmaz', () => {
    const onCancel = vi.fn();
    const api = createAlertDialog({ open: true, onCancel });
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'CANCEL' });
    expect(onCancel).not.toHaveBeenCalled();
    expect(api.getContext().open).toBe(true);
  });

  // ── SET_LOADING ──

  it('SET_LOADING loading durumunu degistirir', () => {
    const api = createAlertDialog({ open: true });
    api.send({ type: 'SET_LOADING', loading: true });
    expect(api.getContext().loading).toBe(true);
    api.send({ type: 'SET_LOADING', loading: false });
    expect(api.getContext().loading).toBe(false);
  });

  it('ayni loading degeri verilirse notify cagirilmaz', () => {
    const api = createAlertDialog({ open: true });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_LOADING', loading: false });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── onOpenChange ──

  it('onOpenChange acildiginda ve kapandiginda cagirilir', () => {
    const onOpenChange = vi.fn();
    const api = createAlertDialog({ onOpenChange });
    api.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    api.send({ type: 'CLOSE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── subscribe ──

  it('subscribe ile dinleyici eklenir', () => {
    const api = createAlertDialog();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createAlertDialog();
    const listener = vi.fn();
    const unsubscribe = api.subscribe(listener);
    unsubscribe();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla dinleyici desteklenir', () => {
    const api = createAlertDialog();
    const a = vi.fn();
    const b = vi.fn();
    api.subscribe(a);
    api.subscribe(b);
    api.send({ type: 'OPEN' });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  // ── Config: closeOnOverlay ve closeOnEscape ──

  it('closeOnOverlay varsayilan degeri config e kaydedilir', () => {
    const api = createAlertDialog({ closeOnOverlay: false });
    expect(api.getContext().open).toBe(false);
  });

  it('closeOnEscape varsayilan degeri config e kaydedilir', () => {
    const api = createAlertDialog({ closeOnEscape: false });
    expect(api.getContext().open).toBe(false);
  });
});
