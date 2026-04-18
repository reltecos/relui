/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createEmojiPicker } from './emoji-picker.machine';

describe('createEmojiPicker', () => {
  it('baslangic state varsayilan', () => {
    const api = createEmojiPicker();
    const ctx = api.getContext();
    expect(ctx.search).toBe('');
    expect(ctx.activeCategory).toBe('smileys');
    expect(ctx.skinTone).toBe('default');
    expect(ctx.recentEmojis).toHaveLength(0);
    expect(ctx.filteredEmojis.length).toBeGreaterThan(0);
  });

  it('defaultCategory ile baslatilir', () => {
    const api = createEmojiPicker({ defaultCategory: 'animals' });
    expect(api.getContext().activeCategory).toBe('animals');
    expect(api.getContext().filteredEmojis.every((e) => e.category === 'animals')).toBe(true);
  });

  it('SET_SEARCH arama yapar', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SEARCH', search: 'smile' });
    expect(api.getContext().search).toBe('smile');
    expect(api.getContext().filteredEmojis.length).toBeGreaterThan(0);
  });

  it('SET_SEARCH tum kategorilerde arar', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SEARCH', search: 'dog' });
    expect(api.getContext().filteredEmojis.some((e) => e.category === 'animals')).toBe(true);
  });

  it('SET_SEARCH keyword ile arar', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SEARCH', search: 'lol' });
    expect(api.getContext().filteredEmojis.length).toBeGreaterThan(0);
  });

  it('SET_SEARCH esleme yoksa bos liste', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SEARCH', search: 'zzzzzzzzz' });
    expect(api.getContext().filteredEmojis).toHaveLength(0);
  });

  it('CLEAR_SEARCH aramayı temizler', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SEARCH', search: 'smile' });
    api.send({ type: 'CLEAR_SEARCH' });
    expect(api.getContext().search).toBe('');
  });

  it('SET_CATEGORY kategori degistirir', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_CATEGORY', category: 'food' });
    expect(api.getContext().activeCategory).toBe('food');
    expect(api.getContext().filteredEmojis.every((e) => e.category === 'food')).toBe(true);
  });

  it('SET_CATEGORY arama temizlenir', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SEARCH', search: 'test' });
    api.send({ type: 'SET_CATEGORY', category: 'animals' });
    expect(api.getContext().search).toBe('');
  });

  it('SET_SKIN_TONE skin tone degistirir', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SET_SKIN_TONE', skinTone: 'dark' });
    expect(api.getContext().skinTone).toBe('dark');
  });

  it('SELECT_EMOJI callback cagrilir', () => {
    const onSelect = vi.fn();
    const api = createEmojiPicker({ onSelect });
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    expect(onSelect).toHaveBeenCalledWith('😀');
  });

  it('SELECT_EMOJI recent listeye ekler', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    expect(api.getContext().recentEmojis).toContain('😀');
  });

  it('SELECT_EMOJI duplicate recent eklemez', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    expect(api.getContext().recentEmojis.filter((e) => e === '😀')).toHaveLength(1);
  });

  it('recent en son secilen basta', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    api.send({ type: 'SELECT_EMOJI', emoji: '😎' });
    expect(api.getContext().recentEmojis[0]).toBe('😎');
  });

  it('recentCount ile sinirlanir', () => {
    const api = createEmojiPicker({ recentCount: 3 });
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    api.send({ type: 'SELECT_EMOJI', emoji: '😎' });
    api.send({ type: 'SELECT_EMOJI', emoji: '😢' });
    api.send({ type: 'SELECT_EMOJI', emoji: '🔥' });
    expect(api.getContext().recentEmojis).toHaveLength(3);
  });

  it('CLEAR_RECENT recent temizler', () => {
    const api = createEmojiPicker();
    api.send({ type: 'SELECT_EMOJI', emoji: '😀' });
    api.send({ type: 'CLEAR_RECENT' });
    expect(api.getContext().recentEmojis).toHaveLength(0);
  });

  it('getAllEmojis tum emojileri doner', () => {
    const api = createEmojiPicker();
    expect(api.getAllEmojis().length).toBeGreaterThanOrEqual(100);
  });

  it('getByCategory kategori emojilerini doner', () => {
    const api = createEmojiPicker();
    const animals = api.getByCategory('animals');
    expect(animals.every((e) => e.category === 'animals')).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
  });

  it('subscribe bildirim alir', () => {
    const api = createEmojiPicker();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_SEARCH', search: 'a' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createEmojiPicker();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_SEARCH', search: 'a' });
    expect(fn).not.toHaveBeenCalled();
  });
});
