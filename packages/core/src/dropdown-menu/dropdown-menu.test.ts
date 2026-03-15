/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createDropdownMenu } from './dropdown-menu.machine';
import type { ContextMenuItem } from '../context-menu/context-menu.types';

const sampleItems: ContextMenuItem[] = [
  { id: 'edit', label: 'Duzenle' },
  { id: 'duplicate', label: 'Cokla' },
  { id: 'sep1', type: 'separator' },
  { id: 'archive', label: 'Arsivle', disabled: true },
  { id: 'delete', label: 'Sil' },
  {
    id: 'share',
    label: 'Paylas',
    type: 'submenu',
    children: [
      { id: 'email', label: 'E-posta' },
      { id: 'link', label: 'Link' },
    ],
  },
];

describe('createDropdownMenu', () => {
  // ── Baslangic ──

  it('varsayilan olarak kapali baslar', () => {
    const api = createDropdownMenu({ items: sampleItems });
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.highlightedId).toBeNull();
    expect(ctx.openSubmenuId).toBeNull();
  });

  // ── OPEN ──

  it('OPEN ile acilir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN no-op', () => {
    const onChange = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    onChange.mockClear();
    api.send({ type: 'OPEN' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('OPEN onOpenChange cagrilir', () => {
    const onChange = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'OPEN' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('kapaliyken CLOSE no-op', () => {
    const onChange = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('CLOSE highlight ve submenu sifirlanir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', itemId: 'edit' });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'share' });
    api.send({ type: 'CLOSE' });
    const ctx = api.getContext();
    expect(ctx.highlightedId).toBeNull();
    expect(ctx.openSubmenuId).toBeNull();
  });

  // ── TOGGLE ──

  it('TOGGLE kapali iken acar', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
  });

  it('TOGGLE acik iken kapatir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(false);
  });

  it('TOGGLE onOpenChange cagrilir', () => {
    const onChange = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'TOGGLE' });
    expect(onChange).toHaveBeenCalledWith(true);
    api.send({ type: 'TOGGLE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── SELECT ──

  it('SELECT ile oge secilir ve menu kapanir', () => {
    const onSelect = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', itemId: 'edit' });
    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(api.getContext().open).toBe(false);
  });

  it('disabled oge secilemez', () => {
    const onSelect = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', itemId: 'archive' });
    expect(onSelect).not.toHaveBeenCalled();
    expect(api.getContext().open).toBe(true);
  });

  it('separator secilemez', () => {
    const onSelect = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', itemId: 'sep1' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('submenu ogesi secilemez', () => {
    const onSelect = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', itemId: 'share' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('alt menu ogesi secilebilir', () => {
    const onSelect = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', itemId: 'email' });
    expect(onSelect).toHaveBeenCalledWith('email');
  });

  it('olmayan oge SELECT no-op', () => {
    const onSelect = vi.fn();
    const api = createDropdownMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', itemId: 'xxx' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ── HIGHLIGHT ──

  it('HIGHLIGHT ile oge vurgulanir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', itemId: 'edit' });
    expect(api.getContext().highlightedId).toBe('edit');
  });

  it('ayni oge HIGHLIGHT no-op', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', itemId: 'edit' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'HIGHLIGHT', itemId: 'edit' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── OPEN_SUBMENU / CLOSE_SUBMENU ──

  it('OPEN_SUBMENU ile alt menu acilir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'share' });
    expect(api.getContext().openSubmenuId).toBe('share');
  });

  it('submenu olmayan oge OPEN_SUBMENU no-op', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN_SUBMENU', itemId: 'edit' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLOSE_SUBMENU ile alt menu kapanir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'share' });
    api.send({ type: 'CLOSE_SUBMENU' });
    expect(api.getContext().openSubmenuId).toBeNull();
  });

  it('submenu kapali iken CLOSE_SUBMENU no-op', () => {
    const api = createDropdownMenu({ items: sampleItems });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE_SUBMENU' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── getItems ──

  it('getItems menu ogelerini dondurur', () => {
    const api = createDropdownMenu({ items: sampleItems });
    expect(api.getItems()).toBe(sampleItems);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik dinlenir', () => {
    const api = createDropdownMenu({ items: sampleItems });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagrilmaz', () => {
    const api = createDropdownMenu({ items: sampleItems });
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });
});
