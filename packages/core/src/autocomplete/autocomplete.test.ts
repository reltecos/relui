/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createAutocomplete, defaultFilterFn } from './autocomplete.machine';
import type { AutocompleteOption } from './autocomplete.types';

const OPTIONS: AutocompleteOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape', disabled: true },
  { value: 'mango', label: 'Mango' },
];

describe('defaultFilterFn', () => {
  it('eslesme bulur (case insensitive)', () => {
    expect(defaultFilterFn({ value: 'a', label: 'Apple' }, 'app')).toBe(true);
  });

  it('eslesme bulamaz', () => {
    expect(defaultFilterFn({ value: 'a', label: 'Apple' }, 'xyz')).toBe(false);
  });

  it('bos query hepsini gecirir', () => {
    expect(defaultFilterFn({ value: 'a', label: 'Apple' }, '')).toBe(true);
  });
});

describe('createAutocomplete', () => {
  // ── Create ──

  it('varsayilan degerlerle olusturulur', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    const ctx = ac.getContext();
    expect(ctx.query).toBe('');
    expect(ctx.selectedValue).toBe('');
    expect(ctx.isOpen).toBe(false);
    expect(ctx.highlightedIndex).toBe(-1);
  });

  it('defaultValue ile olusturulur', () => {
    const ac = createAutocomplete({ options: OPTIONS, defaultValue: 'banana' });
    const ctx = ac.getContext();
    expect(ctx.selectedValue).toBe('banana');
    expect(ctx.selectedLabel).toBe('Banana');
    expect(ctx.query).toBe('Banana');
  });

  // ── SET_QUERY ──

  it('SET_QUERY ile query guncellenir', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: 'app' });
    const ctx = ac.getContext();
    expect(ctx.query).toBe('app');
    expect(ctx.isOpen).toBe(true);
  });

  it('SET_QUERY filtreleme yapar', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: 'an' });
    const ctx = ac.getContext();
    expect(ctx.filteredOptions.map((o) => o.value)).toEqual(['banana', 'mango']);
  });

  it('SET_QUERY sonuc yoksa isOpen false', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: 'zzzzz' });
    expect(ac.getContext().isOpen).toBe(false);
  });

  it('SET_QUERY onQueryChange cagrilir', () => {
    const onQueryChange = vi.fn();
    const ac = createAutocomplete({ options: OPTIONS, onQueryChange });
    ac.send({ type: 'SET_QUERY', query: 'test' });
    expect(onQueryChange).toHaveBeenCalledWith('test');
  });

  // ── SELECT ──

  it('SELECT ile secenek secilir', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: 'app' });
    ac.send({ type: 'SELECT', value: 'apple' });
    const ctx = ac.getContext();
    expect(ctx.selectedValue).toBe('apple');
    expect(ctx.selectedLabel).toBe('Apple');
    expect(ctx.query).toBe('Apple');
    expect(ctx.isOpen).toBe(false);
  });

  it('SELECT disabled secenegi reddeder', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: '' });
    ac.send({ type: 'SELECT', value: 'grape' });
    expect(ac.getContext().selectedValue).toBe('');
  });

  it('SELECT onChange cagrilir', () => {
    const onChange = vi.fn();
    const ac = createAutocomplete({ options: OPTIONS, onChange });
    ac.send({ type: 'SET_QUERY', query: '' });
    ac.send({ type: 'SELECT', value: 'apple' });
    expect(onChange).toHaveBeenCalledWith('apple', 'Apple');
  });

  // ── HIGHLIGHT ──

  it('HIGHLIGHT_NEXT ile sonraki secenek vurgulanir', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: '' });
    ac.send({ type: 'HIGHLIGHT_NEXT' });
    expect(ac.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_NEXT disabled secenegi atlar', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: '' });
    // 0: Apple, 1: Banana, 2: Cherry, 3: Grape (disabled), 4: Mango
    ac.send({ type: 'HIGHLIGHT_NEXT' }); // → 0
    ac.send({ type: 'HIGHLIGHT_NEXT' }); // → 1
    ac.send({ type: 'HIGHLIGHT_NEXT' }); // → 2
    ac.send({ type: 'HIGHLIGHT_NEXT' }); // → 4 (skip 3)
    expect(ac.getContext().highlightedIndex).toBe(4);
  });

  it('HIGHLIGHT_PREV ile onceki secenek vurgulanir', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'SET_QUERY', query: '' });
    ac.send({ type: 'HIGHLIGHT_NEXT' }); // → 0 (Apple)
    ac.send({ type: 'HIGHLIGHT_NEXT' }); // → 1 (Banana)
    ac.send({ type: 'HIGHLIGHT_PREV' }); // → 0 (Apple)
    expect(ac.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_NEXT bos listede calismaz', () => {
    const ac = createAutocomplete({ options: [] });
    ac.send({ type: 'HIGHLIGHT_NEXT' });
    expect(ac.getContext().highlightedIndex).toBe(-1);
  });

  // ── OPEN / CLOSE ──

  it('OPEN ile liste acilir', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'OPEN' });
    expect(ac.getContext().isOpen).toBe(true);
  });

  it('CLOSE ile liste kapanir', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    ac.send({ type: 'OPEN' });
    ac.send({ type: 'CLOSE' });
    expect(ac.getContext().isOpen).toBe(false);
  });

  it('OPEN bos options ile acilmaz', () => {
    const ac = createAutocomplete({ options: [] });
    ac.send({ type: 'OPEN' });
    expect(ac.getContext().isOpen).toBe(false);
  });

  // ── SET_OPTIONS ──

  it('SET_OPTIONS ile secenekler guncellenir', () => {
    const ac = createAutocomplete({ options: [] });
    ac.send({ type: 'SET_OPTIONS', options: OPTIONS });
    expect(ac.getContext().options).toHaveLength(5);
  });

  // ── CLEAR ──

  it('CLEAR ile secim temizlenir', () => {
    const ac = createAutocomplete({ options: OPTIONS, defaultValue: 'apple' });
    ac.send({ type: 'CLEAR' });
    const ctx = ac.getContext();
    expect(ctx.selectedValue).toBe('');
    expect(ctx.query).toBe('');
    expect(ctx.isOpen).toBe(false);
  });

  it('CLEAR onChange cagrilir', () => {
    const onChange = vi.fn();
    const ac = createAutocomplete({ options: OPTIONS, defaultValue: 'apple', onChange });
    ac.send({ type: 'CLEAR' });
    expect(onChange).toHaveBeenCalledWith('', '');
  });

  // ── Subscribe / Destroy ──

  it('subscribe calisiyor', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    const listener = vi.fn();
    ac.subscribe(listener);
    ac.send({ type: 'SET_QUERY', query: 'a' });
    expect(listener).toHaveBeenCalled();
  });

  it('unsubscribe calisiyor', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    const listener = vi.fn();
    const unsub = ac.subscribe(listener);
    unsub();
    ac.send({ type: 'SET_QUERY', query: 'a' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const ac = createAutocomplete({ options: OPTIONS });
    const listener = vi.fn();
    ac.subscribe(listener);
    ac.destroy();
    ac.send({ type: 'SET_QUERY', query: 'a' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Custom filterFn ──

  it('custom filterFn kullanilir', () => {
    const ac = createAutocomplete({
      options: OPTIONS,
      filterFn: (opt, q) => opt.value.startsWith(q),
    });
    ac.send({ type: 'SET_QUERY', query: 'ch' });
    expect(ac.getContext().filteredOptions.map((o) => o.value)).toEqual(['cherry']);
  });
});
