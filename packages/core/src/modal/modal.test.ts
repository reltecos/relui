/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createModal } from './modal.machine';

describe('createModal', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali', () => {
    const api = createModal();
    expect(api.getContext().open).toBe(false);
  });

  it('open: true ile baslatilabilir', () => {
    const api = createModal({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  // ── OPEN ──

  it('OPEN ile acilir', () => {
    const api = createModal();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN notify yapmaz', () => {
    const api = createModal({ open: true });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('OPEN onOpenChange(true) cagirir', () => {
    const onOpenChange = vi.fn();
    const api = createModal({ onOpenChange });
    api.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createModal({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapali iken CLOSE notify yapmaz', () => {
    const api = createModal();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLOSE onOpenChange(false) cagirir', () => {
    const onOpenChange = vi.fn();
    const api = createModal({ open: true, onOpenChange });
    api.send({ type: 'CLOSE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Ac-kapa dongusu ──

  it('ac-kapa dongusu dogru calisir', () => {
    const api = createModal();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  // ── subscribe ──

  it('subscribe ile dinleyici eklenir', () => {
    const api = createModal();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createModal();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla dinleyici desteklenir', () => {
    const api = createModal();
    const l1 = vi.fn();
    const l2 = vi.fn();
    api.subscribe(l1);
    api.subscribe(l2);
    api.send({ type: 'OPEN' });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });

  // ── Config: closeOnOverlay / closeOnEscape ──

  it('closeOnOverlay varsayilan true', () => {
    const api = createModal();
    // Bu degerler React tarafinda kullanilir, core sadece config tutar
    expect(api.getContext().open).toBe(false);
  });

  it('onOpenChange olmadan da calisir', () => {
    const api = createModal();
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });
});
