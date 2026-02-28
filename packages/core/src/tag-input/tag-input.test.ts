/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createTagInput } from './tag-input.machine';
import type { SelectOption } from '../select/select.types';

// ── Test verileri / Test data ────────────────────────────────────────

const basicOptions: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
];

const withDisabledOptions: SelectOption[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

describe('TagInput Machine', () => {
  // ── Başlangıç durumu ────────────────────────────────────────────

  describe('initial state / başlangıç durumu', () => {
    it('varsayılan context / default context', () => {
      const ti = createTagInput({ options: basicOptions });
      const ctx = ti.getContext();
      expect(ctx.selectedValues).toEqual([]);
      expect(ctx.searchValue).toBe('');
      expect(ctx.isOpen).toBe(false);
      expect(ctx.disabled).toBe(false);
      expect(ctx.readOnly).toBe(false);
      expect(ctx.invalid).toBe(false);
      expect(ctx.required).toBe(false);
      expect(ctx.maxTags).toBe(Infinity);
      expect(ctx.allowCustomValue).toBe(false);
    });

    it('defaultValue ile başlangıç / initializes with defaultValue', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react', 'vue'] });
      expect(ti.getContext().selectedValues).toEqual(['react', 'vue']);
    });

    it('value ile başlangıç / initializes with value', () => {
      const ti = createTagInput({ options: basicOptions, value: ['svelte'] });
      expect(ti.getContext().selectedValues).toEqual(['svelte']);
    });

    it('seçili değerler filtrelenir / selected values filtered out', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'] });
      const labels = ti.getContext().filteredOptions.map((o) => o.label);
      expect(labels).not.toContain('React');
      expect(labels).toContain('Vue');
    });
  });

  // ── Arama / Filtreleme ──────────────────────────────────────────

  describe('search / arama', () => {
    it('SET_SEARCH ile filtreleme / SET_SEARCH filters', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_SEARCH', value: 'rea' });
      expect(ti.getContext().filteredOptions.length).toBe(1);
      expect(ti.getContext().filteredOptions[0].label).toBe('React');
      expect(ti.getContext().isOpen).toBe(true);
    });

    it('case-insensitive arama / case-insensitive search', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_SEARCH', value: 'VUE' });
      expect(ti.getContext().filteredOptions.length).toBe(1);
    });

    it('eşleşme yoksa boş / no match returns empty', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_SEARCH', value: 'xyz' });
      expect(ti.getContext().filteredOptions.length).toBe(0);
      expect(ti.getContext().highlightedIndex).toBe(-1);
    });

    it('seçili değerler aramadan çıkarılır / selected values excluded from search', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'] });
      ti.send({ type: 'SET_SEARCH', value: '' });
      expect(ti.getContext().filteredOptions.map((o) => o.value)).not.toContain('react');
    });

    it('custom filterFn / custom filterFn', () => {
      const ti = createTagInput({
        options: basicOptions,
        filterFn: (opt, search) => opt.value.startsWith(search),
      });
      ti.send({ type: 'SET_SEARCH', value: 'sv' });
      expect(ti.getContext().filteredOptions.length).toBe(1);
      expect(ti.getContext().filteredOptions[0].value).toBe('svelte');
    });
  });

  // ── Değer ekleme ────────────────────────────────────────────────

  describe('add value / değer ekleme', () => {
    it('ADD_VALUE ile ekleme / ADD_VALUE adds', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'ADD_VALUE', value: 'react' });
      expect(ti.getContext().selectedValues).toEqual(['react']);
      expect(ti.getContext().searchValue).toBe('');
    });

    it('çift ekleme engellenir / duplicate blocked', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'] });
      ti.send({ type: 'ADD_VALUE', value: 'react' });
      expect(ti.getContext().selectedValues).toEqual(['react']);
    });

    it('maxTags sınırı / maxTags limit', () => {
      const ti = createTagInput({ options: basicOptions, maxTags: 2, defaultValue: ['react', 'vue'] });
      ti.send({ type: 'ADD_VALUE', value: 'svelte' });
      expect(ti.getContext().selectedValues).toEqual(['react', 'vue']);
    });

    it('disabled option eklenemez / disabled option cannot be added', () => {
      const ti = createTagInput({ options: withDisabledOptions });
      ti.send({ type: 'ADD_VALUE', value: 'b' });
      expect(ti.getContext().selectedValues).toEqual([]);
    });

    it('readOnly iken ekleme engellenir / add blocked when readOnly', () => {
      const ti = createTagInput({ options: basicOptions, readOnly: true });
      ti.send({ type: 'ADD_VALUE', value: 'react' });
      expect(ti.getContext().selectedValues).toEqual([]);
    });

    it('disabled iken ekleme engellenir / add blocked when disabled', () => {
      const ti = createTagInput({ options: basicOptions, disabled: true });
      ti.send({ type: 'ADD_VALUE', value: 'react' });
      expect(ti.getContext().selectedValues).toEqual([]);
    });

    it('ekleme sonrası arama temizlenir / search cleared after add', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_SEARCH', value: 'rea' });
      ti.send({ type: 'ADD_VALUE', value: 'react' });
      expect(ti.getContext().searchValue).toBe('');
    });

    it('ekleme sonrası seçili değer listeden çıkar / added value removed from filtered', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'ADD_VALUE', value: 'react' });
      expect(ti.getContext().filteredOptions.map((o) => o.value)).not.toContain('react');
    });
  });

  // ── allowCustomValue ────────────────────────────────────────────

  describe('allowCustomValue', () => {
    it('serbest metin eklenir / custom text added', () => {
      const ti = createTagInput({ options: basicOptions, allowCustomValue: true });
      ti.send({ type: 'ADD_VALUE', value: 'solid' });
      expect(ti.getContext().selectedValues).toEqual(['solid']);
    });

    it('izin yokken serbest metin engellenir / custom text blocked without permission', () => {
      const ti = createTagInput({ options: basicOptions, allowCustomValue: false });
      ti.send({ type: 'ADD_VALUE', value: 'solid' });
      expect(ti.getContext().selectedValues).toEqual([]);
    });

    it('custom değer etiketlerde value olarak gösterilir / custom value shown as-is in labels', () => {
      const ti = createTagInput({ options: basicOptions, allowCustomValue: true });
      ti.send({ type: 'ADD_VALUE', value: 'solid' });
      expect(ti.getSelectedLabels()).toEqual(['solid']);
    });
  });

  // ── Değer kaldırma ──────────────────────────────────────────────

  describe('remove value / değer kaldırma', () => {
    it('REMOVE_VALUE ile kaldırma / REMOVE_VALUE removes', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react', 'vue'] });
      ti.send({ type: 'REMOVE_VALUE', value: 'react' });
      expect(ti.getContext().selectedValues).toEqual(['vue']);
    });

    it('kaldırılan değer listeye geri döner / removed value returns to filtered', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'] });
      ti.send({ type: 'REMOVE_VALUE', value: 'react' });
      expect(ti.getContext().filteredOptions.map((o) => o.value)).toContain('react');
    });

    it('olmayan değer kaldırılamaz / nonexistent value cannot be removed', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'] });
      const prev = ti.getContext();
      ti.send({ type: 'REMOVE_VALUE', value: 'xyz' });
      expect(ti.getContext()).toBe(prev);
    });

    it('readOnly iken kaldırma engellenir / remove blocked when readOnly', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'], readOnly: true });
      ti.send({ type: 'REMOVE_VALUE', value: 'react' });
      expect(ti.getContext().selectedValues).toEqual(['react']);
    });
  });

  // ── REMOVE_LAST (Backspace) ─────────────────────────────────────

  describe('REMOVE_LAST (Backspace)', () => {
    it('son tag silinir / last tag removed', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react', 'vue'] });
      ti.send({ type: 'REMOVE_LAST' });
      expect(ti.getContext().selectedValues).toEqual(['react']);
    });

    it('arama doluyken çalışmaz / ignored when search not empty', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'] });
      ti.send({ type: 'SET_SEARCH', value: 'v' });
      const prev = ti.getContext();
      ti.send({ type: 'REMOVE_LAST' });
      expect(ti.getContext().selectedValues).toEqual(prev.selectedValues);
    });

    it('boş listeye etkisi yok / no effect on empty list', () => {
      const ti = createTagInput({ options: basicOptions });
      const prev = ti.getContext();
      ti.send({ type: 'REMOVE_LAST' });
      expect(ti.getContext()).toBe(prev);
    });

    it('readOnly iken çalışmaz / ignored when readOnly', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'], readOnly: true });
      ti.send({ type: 'REMOVE_LAST' });
      expect(ti.getContext().selectedValues).toEqual(['react']);
    });
  });

  // ── CLEAR_ALL ───────────────────────────────────────────────────

  describe('CLEAR_ALL', () => {
    it('tüm seçimler temizlenir / all selections cleared', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react', 'vue'] });
      ti.send({ type: 'CLEAR_ALL' });
      expect(ti.getContext().selectedValues).toEqual([]);
      expect(ti.getContext().searchValue).toBe('');
    });

    it('boş listeye etkisi yok / no effect on empty list', () => {
      const ti = createTagInput({ options: basicOptions });
      const prev = ti.getContext();
      ti.send({ type: 'CLEAR_ALL' });
      expect(ti.getContext()).toBe(prev);
    });

    it('readOnly iken engellenir / blocked when readOnly', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react'], readOnly: true });
      ti.send({ type: 'CLEAR_ALL' });
      expect(ti.getContext().selectedValues).toEqual(['react']);
    });
  });

  // ── Dropdown açma/kapama ────────────────────────────────────────

  describe('open / close', () => {
    it('OPEN ile açılır / opens with OPEN', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      expect(ti.getContext().isOpen).toBe(true);
    });

    it('CLOSE ile kapanır / closes with CLOSE', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      ti.send({ type: 'CLOSE' });
      expect(ti.getContext().isOpen).toBe(false);
      expect(ti.getContext().searchValue).toBe('');
    });

    it('readOnly iken açılmaz / cannot open when readOnly', () => {
      const ti = createTagInput({ options: basicOptions, readOnly: true });
      ti.send({ type: 'OPEN' });
      expect(ti.getContext().isOpen).toBe(false);
    });

    it('BLUR ile kapanır / closes with BLUR', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      ti.send({ type: 'BLUR' });
      expect(ti.getContext().isOpen).toBe(false);
      expect(ti.getContext().searchValue).toBe('');
      expect(ti.getContext().interactionState).toBe('idle');
    });
  });

  // ── Highlight ──────────────────────────────────────────────────

  describe('highlight / navigasyon', () => {
    it('HIGHLIGHT_NEXT / HIGHLIGHT_NEXT', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      ti.send({ type: 'HIGHLIGHT_NEXT' });
      expect(ti.getContext().highlightedIndex).toBe(1);
    });

    it('HIGHLIGHT_PREV / HIGHLIGHT_PREV', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      ti.send({ type: 'HIGHLIGHT_NEXT' });
      ti.send({ type: 'HIGHLIGHT_PREV' });
      expect(ti.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_FIRST / HIGHLIGHT_FIRST', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      ti.send({ type: 'HIGHLIGHT_LAST' });
      ti.send({ type: 'HIGHLIGHT_FIRST' });
      expect(ti.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_LAST / HIGHLIGHT_LAST', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      ti.send({ type: 'HIGHLIGHT_LAST' });
      expect(ti.getContext().highlightedIndex).toBe(3);
    });

    it('disabled option atlanır / disabled option skipped', () => {
      const ti = createTagInput({ options: withDisabledOptions });
      ti.send({ type: 'OPEN' });
      // 0 = A, next skip B (disabled) → 2 = C
      ti.send({ type: 'HIGHLIGHT_NEXT' });
      expect(ti.getContext().highlightedIndex).toBe(2);
    });

    it('kapalı iken highlight çalışmaz / highlight ignored when closed', () => {
      const ti = createTagInput({ options: basicOptions });
      const prev = ti.getContext();
      ti.send({ type: 'HIGHLIGHT_NEXT' });
      expect(ti.getContext()).toBe(prev);
    });
  });

  // ── Etkileşim durumları ─────────────────────────────────────────

  describe('interaction states / etkileşim durumları', () => {
    it('FOCUS / FOCUS', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'FOCUS' });
      expect(ti.getContext().interactionState).toBe('focused');
    });

    it('BLUR / BLUR', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'FOCUS' });
      ti.send({ type: 'BLUR' });
      expect(ti.getContext().interactionState).toBe('idle');
    });

    it('POINTER_ENTER / POINTER_ENTER', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'POINTER_ENTER' });
      expect(ti.getContext().interactionState).toBe('hover');
    });

    it('POINTER_LEAVE / POINTER_LEAVE', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'POINTER_ENTER' });
      ti.send({ type: 'POINTER_LEAVE' });
      expect(ti.getContext().interactionState).toBe('idle');
    });
  });

  // ── Prop güncellemeleri ──────────────────────────────────────────

  describe('prop updates / prop güncellemeleri', () => {
    it('SET_DISABLED / SET_DISABLED', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_DISABLED', value: true });
      expect(ti.getContext().disabled).toBe(true);
    });

    it('SET_READ_ONLY / SET_READ_ONLY', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_READ_ONLY', value: true });
      expect(ti.getContext().readOnly).toBe(true);
    });

    it('SET_INVALID / SET_INVALID', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_INVALID', value: true });
      expect(ti.getContext().invalid).toBe(true);
    });

    it('SET_VALUE / SET_VALUE', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'SET_VALUE', value: ['react', 'vue'] });
      expect(ti.getContext().selectedValues).toEqual(['react', 'vue']);
    });

    it('SET_OPTIONS / SET_OPTIONS', () => {
      const ti = createTagInput({ options: basicOptions });
      const newOptions: SelectOption[] = [{ value: 'solid', label: 'Solid' }];
      ti.send({ type: 'SET_OPTIONS', options: newOptions });
      expect(ti.getContext().flatOptions).toEqual(newOptions);
    });
  });

  // ── DOM Props ─────────────────────────────────────────────────

  describe('DOM props', () => {
    it('input props / input props', () => {
      const ti = createTagInput({ options: basicOptions });
      const props = ti.getInputProps();
      expect(props.role).toBe('combobox');
      expect(props['aria-expanded']).toBe(false);
      expect(props['aria-autocomplete']).toBe('list');
      expect(props.autoComplete).toBe('off');
    });

    it('input props açık iken / input props when open', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      expect(ti.getInputProps()['aria-expanded']).toBe(true);
    });

    it('listbox props / listbox props', () => {
      const ti = createTagInput({ options: basicOptions });
      const props = ti.getListboxProps();
      expect(props.role).toBe('listbox');
      expect(props['aria-multiselectable']).toBe(true);
      expect(props.tabIndex).toBe(-1);
    });

    it('option props / option props', () => {
      const ti = createTagInput({ options: basicOptions });
      ti.send({ type: 'OPEN' });
      const props = ti.getOptionProps(0);
      expect(props.role).toBe('option');
      expect(props['data-highlighted']).toBe('');
    });

    it('disabled input props / disabled input props', () => {
      const ti = createTagInput({ options: basicOptions, disabled: true });
      expect(ti.getInputProps()['aria-disabled']).toBe(true);
      expect(ti.getInputProps()['data-disabled']).toBe('');
    });

    it('invalid input props / invalid input props', () => {
      const ti = createTagInput({ options: basicOptions, invalid: true });
      expect(ti.getInputProps()['aria-invalid']).toBe(true);
      expect(ti.getInputProps()['data-invalid']).toBe('');
    });

    it('required input props / required input props', () => {
      const ti = createTagInput({ options: basicOptions, required: true });
      expect(ti.getInputProps()['aria-required']).toBe(true);
    });
  });

  // ── API helpers ─────────────────────────────────────────────────

  describe('API helpers', () => {
    it('getSelectedLabels / getSelectedLabels', () => {
      const ti = createTagInput({ options: basicOptions, defaultValue: ['react', 'vue'] });
      expect(ti.getSelectedLabels()).toEqual(['React', 'Vue']);
    });

    it('isInteractionBlocked / isInteractionBlocked', () => {
      const ti = createTagInput({ options: basicOptions, disabled: true });
      expect(ti.isInteractionBlocked()).toBe(true);
    });
  });
});
