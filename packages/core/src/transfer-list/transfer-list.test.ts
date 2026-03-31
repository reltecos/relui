/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTransferList } from './transfer-list.machine';

const allIds = ['a', 'b', 'c', 'd', 'e'];

describe('createTransferList', () => {
  // ── Initial state ──

  it('baslangicta tum ogeler kaynakta', () => {
    const api = createTransferList({ allIds });
    const ctx = api.getContext();
    expect(ctx.sourceIds.size).toBe(5);
    expect(ctx.targetIds.size).toBe(0);
  });

  it('defaultTargetIds ile baslangic hedef ayarlanir', () => {
    const api = createTransferList({ allIds, defaultTargetIds: ['c', 'd'] });
    const ctx = api.getContext();
    expect(ctx.sourceIds.size).toBe(3);
    expect(ctx.targetIds.has('c')).toBe(true);
    expect(ctx.targetIds.has('d')).toBe(true);
  });

  it('baslangicta secimler bos', () => {
    const api = createTransferList({ allIds });
    const ctx = api.getContext();
    expect(ctx.selectedSourceIds.size).toBe(0);
    expect(ctx.selectedTargetIds.size).toBe(0);
  });

  it('baslangicta filtreler bos', () => {
    const api = createTransferList({ allIds });
    const ctx = api.getContext();
    expect(ctx.filterSource).toBe('');
    expect(ctx.filterTarget).toBe('');
  });

  // ── Selection ──

  it('TOGGLE_SOURCE ile kaynak secimi toggle edilir', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'a' });
    expect(api.getContext().selectedSourceIds.has('a')).toBe(true);
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'a' });
    expect(api.getContext().selectedSourceIds.has('a')).toBe(false);
  });

  it('SELECT_SOURCE ile kaynak secilir', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'SELECT_SOURCE', itemId: 'b' });
    expect(api.getContext().selectedSourceIds.has('b')).toBe(true);
  });

  it('DESELECT_SOURCE ile kaynak secimi kaldirilir', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'SELECT_SOURCE', itemId: 'a' });
    api.send({ type: 'DESELECT_SOURCE', itemId: 'a' });
    expect(api.getContext().selectedSourceIds.has('a')).toBe(false);
  });

  it('TOGGLE_TARGET ile hedef secimi toggle edilir', () => {
    const api = createTransferList({ allIds, defaultTargetIds: ['c'] });
    api.send({ type: 'TOGGLE_TARGET', itemId: 'c' });
    expect(api.getContext().selectedTargetIds.has('c')).toBe(true);
  });

  // ── Move ──

  it('MOVE_RIGHT secili kaynak ogelerini hedefe tasir', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'a' });
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'b' });
    api.send({ type: 'MOVE_RIGHT' });
    const ctx = api.getContext();
    expect(ctx.targetIds.has('a')).toBe(true);
    expect(ctx.targetIds.has('b')).toBe(true);
    expect(ctx.sourceIds.has('a')).toBe(false);
    expect(ctx.selectedSourceIds.size).toBe(0);
  });

  it('MOVE_LEFT secili hedef ogelerini kaynaga tasir', () => {
    const api = createTransferList({ allIds, defaultTargetIds: ['c', 'd'] });
    api.send({ type: 'TOGGLE_TARGET', itemId: 'c' });
    api.send({ type: 'MOVE_LEFT' });
    const ctx = api.getContext();
    expect(ctx.sourceIds.has('c')).toBe(true);
    expect(ctx.targetIds.has('c')).toBe(false);
    expect(ctx.selectedTargetIds.size).toBe(0);
  });

  it('MOVE_RIGHT secim bos ise bir sey yapmaz', () => {
    const api = createTransferList({ allIds });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'MOVE_RIGHT' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('MOVE_ALL_RIGHT tum kaynak ogelerini hedefe tasir', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'MOVE_ALL_RIGHT' });
    const ctx = api.getContext();
    expect(ctx.sourceIds.size).toBe(0);
    expect(ctx.targetIds.size).toBe(5);
  });

  it('MOVE_ALL_LEFT tum hedef ogelerini kaynaga tasir', () => {
    const api = createTransferList({ allIds, defaultTargetIds: allIds });
    api.send({ type: 'MOVE_ALL_LEFT' });
    const ctx = api.getContext();
    expect(ctx.sourceIds.size).toBe(5);
    expect(ctx.targetIds.size).toBe(0);
  });

  it('MOVE_ALL_RIGHT kaynak bos ise bir sey yapmaz', () => {
    const api = createTransferList({ allIds, defaultTargetIds: allIds });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'MOVE_ALL_RIGHT' });
    expect(fn).not.toHaveBeenCalled();
  });

  // ── Filter ──

  it('SET_FILTER_SOURCE kaynak filtresini ayarlar', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'SET_FILTER_SOURCE', value: 'test' });
    expect(api.getContext().filterSource).toBe('test');
  });

  it('SET_FILTER_TARGET hedef filtresini ayarlar', () => {
    const api = createTransferList({ allIds });
    api.send({ type: 'SET_FILTER_TARGET', value: 'abc' });
    expect(api.getContext().filterTarget).toBe('abc');
  });

  // ── Callbacks ──

  it('onTargetChange MOVE_RIGHT sonrasi cagirilir', () => {
    const onTargetChange = vi.fn();
    const api = createTransferList({ allIds, onTargetChange });
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'a' });
    api.send({ type: 'MOVE_RIGHT' });
    expect(onTargetChange).toHaveBeenCalled();
  });

  it('onSourceChange MOVE_LEFT sonrasi cagirilir', () => {
    const onSourceChange = vi.fn();
    const api = createTransferList({ allIds, defaultTargetIds: ['c'], onSourceChange });
    api.send({ type: 'TOGGLE_TARGET', itemId: 'c' });
    api.send({ type: 'MOVE_LEFT' });
    expect(onSourceChange).toHaveBeenCalled();
  });

  // ── Subscribe / Destroy ──

  it('subscribe ve unsubscribe calisir', () => {
    const api = createTransferList({ allIds });
    const fn = vi.fn();
    const unsub = api.subscribe(fn);
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'a' });
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'b' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('destroy tum listener lari temizler', () => {
    const api = createTransferList({ allIds });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'TOGGLE_SOURCE', itemId: 'a' });
    expect(fn).not.toHaveBeenCalled();
  });
});
