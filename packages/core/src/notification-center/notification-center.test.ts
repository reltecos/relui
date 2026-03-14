/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createNotificationCenter } from './notification-center.machine';

describe('createNotificationCenter', () => {
  // ── Baslangic durumu ──

  it('varsayilan olarak kapali ve bos baslar', () => {
    const api = createNotificationCenter();
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.notifications).toEqual([]);
    expect(ctx.unreadCount).toBe(0);
  });

  it('open: true ile acik baslar', () => {
    const api = createNotificationCenter({ open: true });
    expect(api.getContext().open).toBe(true);
  });

  // ── ADD ──

  it('bildirim ekler', () => {
    const api = createNotificationCenter();
    api.send({
      type: 'ADD',
      notification: { id: 'n1', severity: 'info', message: 'Merhaba' },
    });
    const ctx = api.getContext();
    expect(ctx.notifications).toHaveLength(1);
    expect(ctx.notifications[0]?.message).toBe('Merhaba');
    expect(ctx.notifications[0]?.read).toBe(false);
    expect(ctx.notifications[0]?.createdAt).toBeGreaterThan(0);
  });

  it('yeni bildirim basa eklenir (en yeni uste)', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'a', severity: 'info', message: 'Birinci' } });
    api.send({ type: 'ADD', notification: { id: 'b', severity: 'info', message: 'Ikinci' } });
    expect(api.getContext().notifications[0]?.id).toBe('b');
    expect(api.getContext().notifications[1]?.id).toBe('a');
  });

  it('ayni id ile bildirim guncellenebilir', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'x', severity: 'info', message: 'Eski' } });
    api.send({ type: 'ADD', notification: { id: 'x', severity: 'success', message: 'Yeni' } });
    expect(api.getContext().notifications).toHaveLength(1);
    expect(api.getContext().notifications[0]?.message).toBe('Yeni');
    expect(api.getContext().notifications[0]?.severity).toBe('success');
  });

  it('maxItems sinirini asinca en eski kaldirilir', () => {
    const api = createNotificationCenter({ maxItems: 3 });
    api.send({ type: 'ADD', notification: { id: 'a', severity: 'info', message: 'A' } });
    api.send({ type: 'ADD', notification: { id: 'b', severity: 'info', message: 'B' } });
    api.send({ type: 'ADD', notification: { id: 'c', severity: 'info', message: 'C' } });
    api.send({ type: 'ADD', notification: { id: 'd', severity: 'info', message: 'D' } });
    expect(api.getContext().notifications).toHaveLength(3);
    expect(api.getContext().notifications.map((n) => n.id)).toEqual(['d', 'c', 'b']);
  });

  it('unreadCount ADD ile artar', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'n1', severity: 'info', message: 'M' } });
    api.send({ type: 'ADD', notification: { id: 'n2', severity: 'info', message: 'M' } });
    expect(api.getContext().unreadCount).toBe(2);
  });

  it('title ve group desteklenir', () => {
    const api = createNotificationCenter();
    api.send({
      type: 'ADD',
      notification: { id: 'n1', severity: 'info', title: 'Baslik', message: 'Mesaj', group: 'sistem' },
    });
    const n = api.getContext().notifications[0];
    expect(n?.title).toBe('Baslik');
    expect(n?.group).toBe('sistem');
  });

  // ── REMOVE ──

  it('bildirimi kaldirir', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'n1', severity: 'info', message: 'M' } });
    api.send({ type: 'REMOVE', id: 'n1' });
    expect(api.getContext().notifications).toHaveLength(0);
  });

  it('var olmayan bildirimi kaldirmaya calismak bir sey yapmaz', () => {
    const listener = vi.fn();
    const api = createNotificationCenter();
    api.subscribe(listener);
    api.send({ type: 'REMOVE', id: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('onRemove callback cagirilir', () => {
    const onRemove = vi.fn();
    const api = createNotificationCenter({ onRemove });
    api.send({ type: 'ADD', notification: { id: 'n1', severity: 'info', message: 'M' } });
    api.send({ type: 'REMOVE', id: 'n1' });
    expect(onRemove).toHaveBeenCalledWith('n1');
  });

  it('okunmamis bildirim kaldirilinca unreadCount azalir', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'n1', severity: 'info', message: 'M' } });
    api.send({ type: 'ADD', notification: { id: 'n2', severity: 'info', message: 'M' } });
    expect(api.getContext().unreadCount).toBe(2);
    api.send({ type: 'REMOVE', id: 'n1' });
    expect(api.getContext().unreadCount).toBe(1);
  });

  // ── REMOVE_ALL ──

  it('tum bildirimleri kaldirir', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'a', severity: 'info', message: 'M' } });
    api.send({ type: 'ADD', notification: { id: 'b', severity: 'info', message: 'M' } });
    api.send({ type: 'REMOVE_ALL' });
    expect(api.getContext().notifications).toHaveLength(0);
    expect(api.getContext().unreadCount).toBe(0);
  });

  it('bos listede REMOVE_ALL notify yapmaz', () => {
    const listener = vi.fn();
    const api = createNotificationCenter();
    api.subscribe(listener);
    api.send({ type: 'REMOVE_ALL' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── MARK_READ ──

  it('bildirimi okundu olarak isaretler', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'n1', severity: 'info', message: 'M' } });
    api.send({ type: 'MARK_READ', id: 'n1' });
    expect(api.getContext().notifications[0]?.read).toBe(true);
    expect(api.getContext().unreadCount).toBe(0);
  });

  it('zaten okunmus bildirimi tekrar isaretleme notify yapmaz', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'n1', severity: 'info', message: 'M' } });
    api.send({ type: 'MARK_READ', id: 'n1' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'MARK_READ', id: 'n1' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('var olmayan bildirim icin MARK_READ notify yapmaz', () => {
    const listener = vi.fn();
    const api = createNotificationCenter();
    api.subscribe(listener);
    api.send({ type: 'MARK_READ', id: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── MARK_ALL_READ ──

  it('tum bildirimleri okundu olarak isaretler', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'a', severity: 'info', message: 'M' } });
    api.send({ type: 'ADD', notification: { id: 'b', severity: 'info', message: 'M' } });
    api.send({ type: 'MARK_ALL_READ' });
    expect(api.getContext().unreadCount).toBe(0);
    expect(api.getContext().notifications.every((n) => n.read)).toBe(true);
  });

  it('hepsi okunmusken MARK_ALL_READ notify yapmaz', () => {
    const api = createNotificationCenter();
    api.send({ type: 'ADD', notification: { id: 'a', severity: 'info', message: 'M' } });
    api.send({ type: 'MARK_ALL_READ' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'MARK_ALL_READ' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── TOGGLE / OPEN / CLOSE ──

  it('TOGGLE panel durumunu degistirir', () => {
    const api = createNotificationCenter();
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(true);
    api.send({ type: 'TOGGLE' });
    expect(api.getContext().open).toBe(false);
  });

  it('OPEN paneli acar', () => {
    const api = createNotificationCenter();
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('zaten acikken OPEN notify yapmaz', () => {
    const api = createNotificationCenter({ open: true });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('CLOSE paneli kapatir', () => {
    const api = createNotificationCenter({ open: true });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('zaten kapaliyken CLOSE notify yapmaz', () => {
    const api = createNotificationCenter();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLOSE' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('onOpenChange callback cagirilir', () => {
    const onOpenChange = vi.fn();
    const api = createNotificationCenter({ onOpenChange });
    api.send({ type: 'TOGGLE' });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    api.send({ type: 'TOGGLE' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── subscribe ──

  it('subscribe ile dinleyici eklenir', () => {
    const api = createNotificationCenter();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'OPEN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe ile dinleyici kaldirilir', () => {
    const api = createNotificationCenter();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'OPEN' });
    expect(listener).not.toHaveBeenCalled();
  });
});
