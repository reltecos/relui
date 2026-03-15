/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPopover } from './popover.machine';

describe('createPopover', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali baslar', () => {
    const api = createPopover();
    expect(api.getContext().open).toBe(false);
  });

  it('open: true ile acik baslar', () => {
    const api = createPopover({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  // ── OPEN ──

  it('OPEN ile acilir', () => {
    const api = createPopover();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN tekrar gonderilirse degismez', () => {
    const onChange = vi.fn();
    const api = createPopover({ onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    onChange.mockClear();

    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('OPEN onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createPopover({ onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createPopover({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapaliyken CLOSE tekrar gonderilirse degismez', () => {
    const onChange = vi.fn();
    const api = createPopover({ onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('CLOSE onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createPopover({ open: true, onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── TOGGLE ──

  it('TOGGLE kapali iken acar', () => {
    const api = createPopover();
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
  });

  it('TOGGLE acik iken kapatir', () => {
    const api = createPopover({ open: true });
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(false);
  });

  it('TOGGLE onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createPopover({ onOpenChange: onChange });
    api.send({ type: 'TOGGLE' });
    expect(onChange).toHaveBeenCalledWith(true);

    api.send({ type: 'TOGGLE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik dinlenir', () => {
    const api = createPopover();
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);

    api.send({ type: 'CLOSE' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('unsubscribe sonrasi listener cagrilmaz', () => {
    const api = createPopover();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);

    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    api.send({ type: 'CLOSE' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('no-op event listener tetiklemez', () => {
    const api = createPopover({ open: true });
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'OPEN' }); // zaten acik, degismez
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Birden fazla subscriber ──

  it('birden fazla subscriber desteklenir', () => {
    const api = createPopover();
    const l1 = vi.fn();
    const l2 = vi.fn();
    api.subscribe(l1);
    api.subscribe(l2);

    api.send({ type: 'OPEN' });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });

  // ── Config olmadan calisir ──

  it('config olmadan olusturulabilir', () => {
    const api = createPopover();
    expect(api.getContext().open).toBe(false);
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
  });
});
