/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFAB } from './fab.machine';
import type { FabAction } from './fab.types';

// ── Helpers ──────────────────────────────────────────────

function makeActions(): FabAction[] {
  return [
    { id: 'add', label: 'Add item' },
    { id: 'edit', label: 'Edit item' },
    { id: 'share', label: 'Share' },
    { id: 'delete', label: 'Delete', disabled: true },
  ];
}

// ── Init ──────────────────────────────────────────────────

describe('FAB init', () => {
  it('varsayilan degerlerle olusturulur', () => {
    const api = createFAB();
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.actions).toEqual([]);
    expect(ctx.selectedActionId).toBeNull();
  });

  it('config ile olusturulur', () => {
    const actions = makeActions();
    const api = createFAB({ actions, open: true });
    const ctx = api.getContext();
    expect(ctx.open).toBe(true);
    expect(ctx.actions).toBe(actions);
  });
});

// ── OPEN / CLOSE / TOGGLE ──────────────────────────────

describe('FAB open/close/toggle', () => {
  it('OPEN acar', () => {
    const api = createFAB();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('CLOSE kapatir', () => {
    const api = createFAB({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('TOGGLE acik ise kapatir', () => {
    const api = createFAB({ open: true });
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(false);
  });

  it('TOGGLE kapali ise acar', () => {
    const api = createFAB();
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
  });

  it('SET_OPEN ile acilir', () => {
    const api = createFAB();
    api.send({ type: 'SET_OPEN', open: true });
    expect(api.getContext().open).toBe(true);
  });

  it('SET_OPEN ile kapatilir', () => {
    const api = createFAB({ open: true });
    api.send({ type: 'SET_OPEN', open: false });
    expect(api.getContext().open).toBe(false);
  });

  it('onOpenChange callback cagrilir', () => {
    const onOpenChange = vi.fn();
    const api = createFAB({ onOpenChange });
    api.send({ type: 'OPEN' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    api.send({ type: 'CLOSE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ayni state icin onOpenChange cagrilmaz', () => {
    const onOpenChange = vi.fn();
    const api = createFAB({ open: true, onOpenChange });
    api.send({ type: 'OPEN' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

// ── SELECT_ACTION ──────────────────────────────────────

describe('FAB SELECT_ACTION', () => {
  it('aksiyon secilir', () => {
    const api = createFAB({ actions: makeActions(), open: true });
    api.send({ type: 'SELECT_ACTION', actionId: 'add' });
    expect(api.getContext().selectedActionId).toBe('add');
  });

  it('secim sonrasi kapanir', () => {
    const api = createFAB({ actions: makeActions(), open: true });
    api.send({ type: 'SELECT_ACTION', actionId: 'add' });
    expect(api.getContext().open).toBe(false);
  });

  it('onSelectAction callback cagrilir', () => {
    const onSelectAction = vi.fn();
    const api = createFAB({ actions: makeActions(), open: true, onSelectAction });
    api.send({ type: 'SELECT_ACTION', actionId: 'edit' });
    expect(onSelectAction).toHaveBeenCalledWith('edit');
  });

  it('disabled aksiyon secilemez', () => {
    const onSelectAction = vi.fn();
    const api = createFAB({ actions: makeActions(), open: true, onSelectAction });
    api.send({ type: 'SELECT_ACTION', actionId: 'delete' });
    expect(onSelectAction).not.toHaveBeenCalled();
    expect(api.getContext().selectedActionId).toBeNull();
    expect(api.getContext().open).toBe(true); // kapanmaz
  });

  it('olmayan aksiyon secilemez', () => {
    const onSelectAction = vi.fn();
    const api = createFAB({ actions: makeActions(), open: true, onSelectAction });
    api.send({ type: 'SELECT_ACTION', actionId: 'nonexistent' });
    expect(onSelectAction).not.toHaveBeenCalled();
  });
});

// ── SET_ACTIONS ────────────────────────────────────────

describe('FAB SET_ACTIONS', () => {
  it('aksiyonlar guncellenir', () => {
    const api = createFAB();
    const actions = makeActions();
    api.send({ type: 'SET_ACTIONS', actions });
    expect(api.getContext().actions).toBe(actions);
  });

  it('subscribe listener bilgilendirilir', () => {
    const api = createFAB();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_ACTIONS', actions: makeActions() });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

// ── Subscribe ──────────────────────────────────────────

describe('FAB subscribe', () => {
  it('unsubscribe calisir', () => {
    const api = createFAB();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla listener desteklenir', () => {
    const api = createFAB();
    const l1 = vi.fn();
    const l2 = vi.fn();
    api.subscribe(l1);
    api.subscribe(l2);
    api.send({ type: 'OPEN' });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });
});

// ── getButtonProps ──────────────────────────────────────

describe('FAB getButtonProps', () => {
  it('type button dondurur', () => {
    const api = createFAB();
    expect(api.getButtonProps().type).toBe('button');
  });

  it('kapali iken aria-expanded false', () => {
    const api = createFAB();
    expect(api.getButtonProps()['aria-expanded']).toBe(false);
  });

  it('acik iken aria-expanded true', () => {
    const api = createFAB({ open: true });
    expect(api.getButtonProps()['aria-expanded']).toBe(true);
  });

  it('aksiyonlar varken aria-haspopup true', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getButtonProps()['aria-haspopup']).toBe('true');
  });

  it('aksiyon yokken aria-haspopup yok', () => {
    const api = createFAB();
    expect(api.getButtonProps()['aria-haspopup']).toBeUndefined();
  });

  it('kapali iken aria-label "Open actions"', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getButtonProps()['aria-label']).toBe('Open actions');
  });

  it('acik iken aria-label "Close actions"', () => {
    const api = createFAB({ actions: makeActions(), open: true });
    expect(api.getButtonProps()['aria-label']).toBe('Close actions');
  });
});

// ── getActionProps ─────────────────────────────────────

describe('FAB getActionProps', () => {
  it('type button dondurur', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getActionProps('add').type).toBe('button');
  });

  it('role menuitem dondurur', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getActionProps('add').role).toBe('menuitem');
  });

  it('aria-label dondurur', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getActionProps('add')['aria-label']).toBe('Add item');
  });

  it('disabled aksiyon icin aria-disabled ayarlar', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getActionProps('delete')['aria-disabled']).toBe(true);
    expect(api.getActionProps('delete').tabIndex).toBe(-1);
  });

  it('normal aksiyon icin tabIndex 0', () => {
    const api = createFAB({ actions: makeActions() });
    expect(api.getActionProps('add').tabIndex).toBe(0);
  });
});

// ── Complex scenarios ──────────────────────────────────

describe('FAB complex scenarios', () => {
  it('toggle → select → toggle akisi', () => {
    const onSelectAction = vi.fn();
    const api = createFAB({
      actions: makeActions(),
      onSelectAction,
    });

    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);

    api.send({ type: 'SELECT_ACTION', actionId: 'share' });
    expect(api.getContext().open).toBe(false);
    expect(onSelectAction).toHaveBeenCalledWith('share');

    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
  });

  it('ard arda select calisir', () => {
    const onSelectAction = vi.fn();
    const api = createFAB({
      actions: makeActions(),
      open: true,
      onSelectAction,
    });

    api.send({ type: 'SELECT_ACTION', actionId: 'add' });
    expect(api.getContext().selectedActionId).toBe('add');

    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT_ACTION', actionId: 'edit' });
    expect(api.getContext().selectedActionId).toBe('edit');
    expect(onSelectAction).toHaveBeenCalledTimes(2);
  });
});
