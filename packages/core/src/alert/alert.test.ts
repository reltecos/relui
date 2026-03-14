/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createAlert } from './alert.machine';

// ── Init ──────────────────────────────────────────────────

describe('Alert init', () => {
  it('varsayilan acik olusturulur', () => {
    const api = createAlert();
    expect(api.getContext().open).toBe(true);
  });

  it('kapali ile olusturulabilir', () => {
    const api = createAlert({ open: false });
    expect(api.getContext().open).toBe(false);
  });
});

// ── CLOSE ──────────────────────────────────────────────

describe('Alert CLOSE', () => {
  it('kapatir', () => {
    const api = createAlert();
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('onClose callback cagrilir', () => {
    const onClose = vi.fn();
    const api = createAlert({ onClose });
    api.send({ type: 'CLOSE' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('zaten kapali ise onClose cagrilmaz', () => {
    const onClose = vi.fn();
    const api = createAlert({ open: false, onClose });
    api.send({ type: 'CLOSE' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ── SET_OPEN ──────────────────────────────────────────

describe('Alert SET_OPEN', () => {
  it('acik ayarlar', () => {
    const api = createAlert({ open: false });
    api.send({ type: 'SET_OPEN', open: true });
    expect(api.getContext().open).toBe(true);
  });

  it('kapali ayarlar', () => {
    const api = createAlert();
    api.send({ type: 'SET_OPEN', open: false });
    expect(api.getContext().open).toBe(false);
  });

  it('kapaninca onClose cagrilir', () => {
    const onClose = vi.fn();
    const api = createAlert({ onClose });
    api.send({ type: 'SET_OPEN', open: false });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ayni state icin notify cagrilmaz', () => {
    const listener = vi.fn();
    const api = createAlert({ open: true });
    api.subscribe(listener);
    api.send({ type: 'SET_OPEN', open: true });
    expect(listener).not.toHaveBeenCalled();
  });
});

// ── Subscribe ──────────────────────────────────────────

describe('Alert subscribe', () => {
  it('listener bilgilendirilir', () => {
    const api = createAlert();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe calisir', () => {
    const api = createAlert();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'CLOSE' });
    expect(listener).not.toHaveBeenCalled();
  });
});

// ── getRootProps ────────────────────────────────────────

describe('Alert getRootProps', () => {
  it('role alert dondurur', () => {
    const api = createAlert();
    expect(api.getRootProps().role).toBe('alert');
  });
});
