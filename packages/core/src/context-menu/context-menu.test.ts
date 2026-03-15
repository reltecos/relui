/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createContextMenu } from './context-menu.machine';
import type { ContextMenuItem } from './context-menu.types';

const sampleItems: ContextMenuItem[] = [
  { id: 'cut', label: 'Kes' },
  { id: 'copy', label: 'Kopyala' },
  { id: 'paste', label: 'Yapistir' },
  { id: 'sep1', type: 'separator' },
  { id: 'delete', label: 'Sil', disabled: true },
  {
    id: 'more',
    label: 'Daha fazla',
    type: 'submenu',
    children: [
      { id: 'sub1', label: 'Alt oge 1' },
      { id: 'sub2', label: 'Alt oge 2' },
    ],
  },
];

describe('createContextMenu', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali baslar', () => {
    const api = createContextMenu({ items: sampleItems });
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.x).toBe(0);
    expect(ctx.y).toBe(0);
    expect(ctx.highlightedId).toBeNull();
    expect(ctx.openSubmenuId).toBeNull();
  });

  // ── OPEN ──

  it('OPEN ile acilir, pozisyon set edilir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 100, y: 200 });
    const ctx = api.getContext();
    expect(ctx.open).toBe(true);
    expect(ctx.x).toBe(100);
    expect(ctx.y).toBe(200);
  });

  it('OPEN onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createContextMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('OPEN highlight ve submenu sifirlanir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 10, y: 10 });
    api.send({ type: 'HIGHLIGHT', itemId: 'cut' });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'more' });

    api.send({ type: 'OPEN', x: 50, y: 50 });
    const ctx = api.getContext();
    expect(ctx.highlightedId).toBeNull();
    expect(ctx.openSubmenuId).toBeNull();
    expect(ctx.x).toBe(50);
  });

  // ── CLOSE ──

  it('CLOSE ile kapanir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapaliyken CLOSE no-op', () => {
    const onChange = vi.fn();
    const api = createContextMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'CLOSE' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('CLOSE onOpenChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createContextMenu({ items: sampleItems, onOpenChange: onChange });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    onChange.mockClear();
    api.send({ type: 'CLOSE' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('CLOSE highlight ve submenu sifirlanir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'HIGHLIGHT', itemId: 'cut' });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'more' });
    api.send({ type: 'CLOSE' });
    const ctx = api.getContext();
    expect(ctx.highlightedId).toBeNull();
    expect(ctx.openSubmenuId).toBeNull();
  });

  // ── SELECT ──

  it('SELECT ile oge secilir ve menu kapanir', () => {
    const onSelect = vi.fn();
    const api = createContextMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'SELECT', itemId: 'cut' });
    expect(onSelect).toHaveBeenCalledWith('cut');
    expect(api.getContext().open).toBe(false);
  });

  it('disabled oge secilemez', () => {
    const onSelect = vi.fn();
    const api = createContextMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'SELECT', itemId: 'delete' });
    expect(onSelect).not.toHaveBeenCalled();
    expect(api.getContext().open).toBe(true);
  });

  it('separator secilemez', () => {
    const onSelect = vi.fn();
    const api = createContextMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'SELECT', itemId: 'sep1' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('submenu ogesi secilemez', () => {
    const onSelect = vi.fn();
    const api = createContextMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'SELECT', itemId: 'more' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('alt menu ogesi secilebilir', () => {
    const onSelect = vi.fn();
    const api = createContextMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'SELECT', itemId: 'sub1' });
    expect(onSelect).toHaveBeenCalledWith('sub1');
    expect(api.getContext().open).toBe(false);
  });

  it('olmayan oge SELECT no-op', () => {
    const onSelect = vi.fn();
    const api = createContextMenu({ items: sampleItems, onSelect });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'SELECT', itemId: 'nonexistent' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ── HIGHLIGHT ──

  it('HIGHLIGHT ile oge vurgulanir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'HIGHLIGHT', itemId: 'copy' });
    expect(api.getContext().highlightedId).toBe('copy');
  });

  it('ayni oge tekrar HIGHLIGHT no-op', () => {
    const api = createContextMenu({ items: sampleItems });
    const listener = vi.fn();
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'HIGHLIGHT', itemId: 'copy' });
    api.subscribe(listener);
    api.send({ type: 'HIGHLIGHT', itemId: 'copy' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('HIGHLIGHT null ile vurgu kaldirilir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'HIGHLIGHT', itemId: 'copy' });
    api.send({ type: 'HIGHLIGHT', itemId: null });
    expect(api.getContext().highlightedId).toBeNull();
  });

  // ── OPEN_SUBMENU / CLOSE_SUBMENU ──

  it('OPEN_SUBMENU ile alt menu acilir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'more' });
    expect(api.getContext().openSubmenuId).toBe('more');
  });

  it('submenu olmayan oge icin OPEN_SUBMENU no-op', () => {
    const api = createContextMenu({ items: sampleItems });
    const listener = vi.fn();
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.subscribe(listener);
    api.send({ type: 'OPEN_SUBMENU', itemId: 'cut' });
    expect(listener).not.toHaveBeenCalled();
    expect(api.getContext().openSubmenuId).toBeNull();
  });

  it('ayni submenu tekrar OPEN_SUBMENU no-op', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'more' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN_SUBMENU', itemId: 'more' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLOSE_SUBMENU ile alt menu kapanir', () => {
    const api = createContextMenu({ items: sampleItems });
    api.send({ type: 'OPEN', x: 0, y: 0 });
    api.send({ type: 'OPEN_SUBMENU', itemId: 'more' });
    api.send({ type: 'CLOSE_SUBMENU' });
    expect(api.getContext().openSubmenuId).toBeNull();
  });

  it('submenu acik degilken CLOSE_SUBMENU no-op', () => {
    const api = createContextMenu({ items: sampleItems });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE_SUBMENU' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── getItems ──

  it('getItems menu ogelerini dondurur', () => {
    const api = createContextMenu({ items: sampleItems });
    expect(api.getItems()).toBe(sampleItems);
  });

  // ── Subscribe ──

  it('subscribe ile degisiklik dinlenir', () => {
    const api = createContextMenu({ items: sampleItems });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN', x: 0, y: 0 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe sonrasi listener cagrilmaz', () => {
    const api = createContextMenu({ items: sampleItems });
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN', x: 0, y: 0 });
    expect(listener).not.toHaveBeenCalled();
  });
});
