/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDrawer } from './drawer.machine';

describe('createDrawer', () => {
  it('varsayilan olarak kapali', () => {
    const api = createDrawer();
    expect(api.getContext().open).toBe(false);
  });

  it('open: true ile baslatilabilir', () => {
    const api = createDrawer({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  it('OPEN ile acilir', () => {
    const api = createDrawer();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN notify yapmaz', () => {
    const api = createDrawer({ open: true });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('OPEN onOpenChange(true) cagirir', () => {
    const onOpenChange = vi.fn();
    const api = createDrawer({ onOpenChange });
    api.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('CLOSE ile kapanir', () => {
    const api = createDrawer({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapali iken CLOSE notify yapmaz', () => {
    const api = createDrawer();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLOSE onOpenChange(false) cagirir', () => {
    const onOpenChange = vi.fn();
    const api = createDrawer({ open: true, onOpenChange });
    api.send({ type: 'CLOSE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ac-kapa dongusu dogru calisir', () => {
    const api = createDrawer();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('subscribe ile dinleyici eklenir', () => {
    const api = createDrawer();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createDrawer();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('onOpenChange olmadan da calisir', () => {
    const api = createDrawer();
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });
});
