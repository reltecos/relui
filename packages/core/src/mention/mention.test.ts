/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createMention } from './mention.machine';
import type { MentionItem } from './mention.types';

const items: MentionItem[] = [
  { id: '1', label: 'Alice' },
  { id: '2', label: 'Bob' },
  { id: '3', label: 'Charlie' },
  { id: '4', label: 'David' },
];

describe('createMention', () => {
  it('baslangic state kapali', () => {
    const api = createMention({ items });
    expect(api.getContext().isOpen).toBe(false);
    expect(api.getContext().query).toBe('');
  });

  it('OPEN popup acar', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 5 });
    expect(api.getContext().isOpen).toBe(true);
    expect(api.getContext().triggerPosition).toBe(5);
  });

  it('CLOSE popup kapatir', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().isOpen).toBe(false);
  });

  it('SET_QUERY filtreleme yapar', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'SET_QUERY', query: 'ali' });
    expect(api.getContext().filteredItems).toHaveLength(1);
    expect(api.getContext().filteredItems[0]?.label).toBe('Alice');
  });

  it('bos query tum itemlari gosterir', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    expect(api.getContext().filteredItems).toHaveLength(4);
  });

  it('HIGHLIGHT_NEXT indeksi ilerletir', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('HIGHLIGHT_NEXT wrap yapar', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    for (let i = 0; i < 4; i++) api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_PREV indeksi geriletir', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_PREV wrap yapar', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(3);
  });

  it('SELECT_ITEM secim yapar ve kapatir', () => {
    const onSelect = vi.fn();
    const api = createMention({ items, onSelect });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'SELECT_ITEM' });
    expect(onSelect).toHaveBeenCalledWith(items[0]);
    expect(api.getContext().isOpen).toBe(false);
  });

  it('SELECT_ITEM index ile secim', () => {
    const onSelect = vi.fn();
    const api = createMention({ items, onSelect });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'SELECT_ITEM', index: 2 });
    expect(onSelect).toHaveBeenCalledWith(items[2]);
  });

  it('SET_ITEMS itemlari gunceller', () => {
    const api = createMention({ items: [] });
    api.send({ type: 'SET_ITEMS', items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    expect(api.getContext().filteredItems).toHaveLength(4);
  });

  it('RESET state sifirlar', () => {
    const api = createMention({ items });
    api.send({ type: 'OPEN', triggerPosition: 0 });
    api.send({ type: 'SET_QUERY', query: 'a' });
    api.send({ type: 'RESET' });
    expect(api.getContext().isOpen).toBe(false);
    expect(api.getContext().query).toBe('');
  });

  it('kapali iken HIGHLIGHT_NEXT islem yapmaz', () => {
    const api = createMention({ items });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('subscribe bildirim alir', () => {
    const api = createMention({ items });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'OPEN', triggerPosition: 0 });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createMention({ items });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'OPEN', triggerPosition: 0 });
    expect(fn).not.toHaveBeenCalled();
  });
});
