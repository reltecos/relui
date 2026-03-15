/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTooltip } from './tooltip.machine';

describe('createTooltip', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali baslar', () => {
    const api = createTooltip();
    expect(api.getContext().open).toBe(false);
  });

  it('open: true ile acik baslar', () => {
    const api = createTooltip({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  // ── OPEN ──

  it('OPEN ile acilir', () => {
    const api = createTooltip();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN tekrar gonderilirse degismez', () => {
    const onChange = vi.fn();
    const api = createTooltip({ onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    onChange.mockClear();

    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('OPEN onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createTooltip({ onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createTooltip({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapaliyken CLOSE tekrar gonderilirse degismez', () => {
    const onChange = vi.fn();
    const api = createTooltip({ onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('CLOSE onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createTooltip({ open: true, onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik dinlenir', () => {
    const api = createTooltip();
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);

    api.send({ type: 'CLOSE' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('unsubscribe sonrasi listener cagrilmaz', () => {
    const api = createTooltip();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);

    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    api.send({ type: 'CLOSE' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('no-op event listener tetiklemez', () => {
    const api = createTooltip({ open: true });
    const listener = vi.fn();
    api.subscribe(listener);

    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla subscriber desteklenir', () => {
    const api = createTooltip();
    const l1 = vi.fn();
    const l2 = vi.fn();
    api.subscribe(l1);
    api.subscribe(l2);

    api.send({ type: 'OPEN' });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });

  it('config olmadan olusturulabilir', () => {
    const api = createTooltip();
    expect(api.getContext().open).toBe(false);
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });
});
