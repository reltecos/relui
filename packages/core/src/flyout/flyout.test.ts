/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFlyout } from './flyout.machine';

describe('createFlyout', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali baslar', () => {
    const api = createFlyout();
    expect(api.getContext().open).toBe(false);
  });

  it('open: true ile acik baslar', () => {
    const api = createFlyout({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  // ── OPEN ──

  it('OPEN event ile acilir', () => {
    const api = createFlyout();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN tekrar gonderilince no-op', () => {
    const onChange = vi.fn();
    const api = createFlyout({ open: true, onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── CLOSE ──

  it('CLOSE event ile kapanir', () => {
    const api = createFlyout({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapaliyken CLOSE tekrar gonderilince no-op', () => {
    const onChange = vi.fn();
    const api = createFlyout({ onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── TOGGLE ──

  it('TOGGLE kapali iken acar', () => {
    const api = createFlyout();
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
  });

  it('TOGGLE acik iken kapatir', () => {
    const api = createFlyout({ open: true });
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(false);
  });

  // ── onOpenChange ──

  it('OPEN gonderilince onOpenChange(true) cagirilir', () => {
    const onChange = vi.fn();
    const api = createFlyout({ onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('CLOSE gonderilince onOpenChange(false) cagirilir', () => {
    const onChange = vi.fn();
    const api = createFlyout({ open: true, onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('TOGGLE gonderilince onOpenChange cagirilir', () => {
    const onChange = vi.fn();
    const api = createFlyout({ onOpenChange: onChange });
    api.send({ type: 'TOGGLE' });
    expect(onChange).toHaveBeenCalledWith(true);

    api.send({ type: 'TOGGLE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklikler dinlenir', () => {
    const api = createFlyout();
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);

    api.send({ type: 'CLOSE' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('unsubscribe sonrasi listener cagirilmaz', () => {
    const api = createFlyout();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);

    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla subscriber desteklenir', () => {
    const api = createFlyout();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    api.subscribe(listener1);
    api.subscribe(listener2);

    api.send({ type: 'OPEN' });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('no-op durumlarinda listener cagirilmaz', () => {
    const api = createFlyout();
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'CLOSE' }); // zaten kapali
    expect(listener).not.toHaveBeenCalled();
  });
});
