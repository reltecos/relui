/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createCombobox } from './combobox.machine';
import type { ComboboxProps } from './combobox.types';

// ── Test verileri / Test data ───────────────────────────────────────

const basicOptions = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'ABD' },
  { value: 'de', label: 'Almanya' },
  { value: 'fr', label: 'Fransa' },
];

const groupedOptions = [
  {
    label: 'Avrupa',
    options: [
      { value: 'de', label: 'Almanya' },
      { value: 'fr', label: 'Fransa' },
    ],
  },
  {
    label: 'Asya',
    options: [
      { value: 'tr', label: 'Türkiye' },
      { value: 'jp', label: 'Japonya' },
    ],
  },
];

const withDisabledOptions = [
  { value: 'a', label: 'Aktif' },
  { value: 'b', label: 'Pasif', disabled: true },
  { value: 'c', label: 'Diger Aktif' },
];

function make(overrides: Partial<ComboboxProps> = {}) {
  return createCombobox({ options: basicOptions, ...overrides });
}

describe('createCombobox', () => {
  // ── Başlangıç durumu ────────────────────────────────────────────

  describe('başlangıç durumu / initial state', () => {
    it('kapalı başlar / starts closed', () => {
      const cb = make();
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('idle durumda başlar / starts in idle state', () => {
      const cb = make();
      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('seçili değer undefined başlar / selected value starts undefined', () => {
      const cb = make();
      expect(cb.getContext().selectedValue).toBeUndefined();
    });

    it('defaultValue ile başlar / starts with defaultValue', () => {
      const cb = make({ defaultValue: 'tr' });
      expect(cb.getContext().selectedValue).toBe('tr');
    });

    it('value prop ile başlar / starts with value prop', () => {
      const cb = make({ value: 'us' });
      expect(cb.getContext().selectedValue).toBe('us');
    });

    it('arama boş başlar / search starts empty', () => {
      const cb = make();
      expect(cb.getContext().searchValue).toBe('');
    });

    it('filteredOptions tüm options ile başlar / filteredOptions starts with all options', () => {
      const cb = make();
      expect(cb.getContext().filteredOptions).toEqual(cb.getContext().flatOptions);
    });

    it('gruplu seçenekler düzleştirilir / grouped options are flattened', () => {
      const cb = make({ options: groupedOptions });
      expect(cb.getContext().flatOptions).toHaveLength(4);
    });

    it('placeholder ayarlanır / placeholder is set', () => {
      const cb = make({ placeholder: 'Ara...' });
      expect(cb.getContext().placeholder).toBe('Ara...');
    });

    it('varsayılan placeholder boş / default placeholder empty', () => {
      const cb = make();
      expect(cb.getContext().placeholder).toBe('');
    });
  });

  // ── Arama / Filtreleme ──────────────────────────────────────────

  describe('arama ve filtreleme / search and filtering', () => {
    it('SET_SEARCH filtreleme yapar / SET_SEARCH filters', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'tür' });
      expect(cb.getContext().filteredOptions).toHaveLength(1);
      expect(cb.getContext().filteredOptions[0]?.label).toBe('Türkiye');
    });

    it('SET_SEARCH dropdown açar / SET_SEARCH opens dropdown', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'a' });
      expect(cb.getContext().isOpen).toBe(true);
    });

    it('SET_SEARCH case insensitive / SET_SEARCH is case insensitive', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'ABD' });
      expect(cb.getContext().filteredOptions).toHaveLength(1);
      expect(cb.getContext().filteredOptions[0]?.value).toBe('us');
    });

    it('boş arama tüm seçenekleri gösterir / empty search shows all options', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'tür' });
      cb.send({ type: 'SET_SEARCH', value: '' });
      expect(cb.getContext().filteredOptions).toHaveLength(4);
    });

    it('eşleşme yoksa boş liste / no match returns empty list', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'xyz' });
      expect(cb.getContext().filteredOptions).toHaveLength(0);
      expect(cb.getContext().highlightedIndex).toBe(-1);
    });

    it('SET_SEARCH ilk sonucu highlight eder / SET_SEARCH highlights first result', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'a' });
      const filtered = cb.getContext().filteredOptions;
      expect(filtered.length).toBeGreaterThan(0);
      expect(cb.getContext().highlightedIndex).toBe(0);
    });

    it('özel filtre fonksiyonu kullanılır / custom filter function is used', () => {
      const cb = createCombobox({
        options: basicOptions,
        filterFn: (opt, search) => opt.value === search,
      });
      cb.send({ type: 'SET_SEARCH', value: 'tr' });
      expect(cb.getContext().filteredOptions).toHaveLength(1);
      expect(cb.getContext().filteredOptions[0]?.label).toBe('Türkiye');
    });
  });

  // ── Açma / Kapama ───────────────────────────────────────────────

  describe('açma ve kapama / open and close', () => {
    it('OPEN açar / OPEN opens', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      expect(cb.getContext().isOpen).toBe(true);
    });

    it('CLOSE kapatır / CLOSE closes', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'CLOSE' });
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('CLOSE aramayı temizler / CLOSE clears search', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'test' });
      cb.send({ type: 'CLOSE' });
      expect(cb.getContext().searchValue).toBe('');
      expect(cb.getContext().filteredOptions).toEqual(cb.getContext().flatOptions);
    });

    it('TOGGLE açar ve kapatır / TOGGLE opens and closes', () => {
      const cb = make();
      cb.send({ type: 'TOGGLE' });
      expect(cb.getContext().isOpen).toBe(true);
      cb.send({ type: 'TOGGLE' });
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('açıkken zaten açıksa değişmez / no change when already open', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      const ctx1 = cb.getContext();
      cb.send({ type: 'OPEN' });
      expect(cb.getContext()).toBe(ctx1);
    });

    it('readOnly iken açılamaz / cannot open when readOnly', () => {
      const cb = make({ readOnly: true });
      cb.send({ type: 'OPEN' });
      expect(cb.getContext().isOpen).toBe(false);
    });
  });

  // ── Seçim ───────────────────────────────────────────────────────

  describe('seçim / selection', () => {
    it('SELECT değer seçer ve kapatır / SELECT picks value and closes', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'SELECT', value: 'tr' });
      expect(cb.getContext().selectedValue).toBe('tr');
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('SELECT aramayı temizler / SELECT clears search', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'tür' });
      cb.send({ type: 'SELECT', value: 'tr' });
      expect(cb.getContext().searchValue).toBe('');
    });

    it('aynı değer tekrar seçilince de kapanır / reselecting same value closes', () => {
      const cb = make({ value: 'tr' });
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'SELECT', value: 'tr' });
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('disabled seçenek seçilemez / disabled option cannot be selected', () => {
      const cb = createCombobox({ options: withDisabledOptions });
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'SELECT', value: 'b' });
      expect(cb.getContext().selectedValue).toBeUndefined();
    });

    it('CLEAR seçimi temizler / CLEAR clears selection', () => {
      const cb = make({ value: 'tr' });
      cb.send({ type: 'CLEAR' });
      expect(cb.getContext().selectedValue).toBeUndefined();
    });

    it('getSelectedLabel doğru etiket döner / getSelectedLabel returns correct label', () => {
      const cb = make({ value: 'tr' });
      expect(cb.getSelectedLabel()).toBe('Türkiye');
    });

    it('seçim yoksa getSelectedLabel undefined / getSelectedLabel undefined when no selection', () => {
      const cb = make();
      expect(cb.getSelectedLabel()).toBeUndefined();
    });
  });

  // ── Highlight ───────────────────────────────────────────────────

  describe('highlight', () => {
    it('OPEN ilk seçeneği highlight eder / OPEN highlights first option', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      expect(cb.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_NEXT sonraki seçeneğe geçer / HIGHLIGHT_NEXT moves to next', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      expect(cb.getContext().highlightedIndex).toBe(1);
    });

    it('HIGHLIGHT_PREV önceki seçeneğe geçer / HIGHLIGHT_PREV moves to previous', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      cb.send({ type: 'HIGHLIGHT_PREV' });
      expect(cb.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_FIRST ilk seçeneğe gider / HIGHLIGHT_FIRST goes to first', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      cb.send({ type: 'HIGHLIGHT_FIRST' });
      expect(cb.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_LAST son seçeneğe gider / HIGHLIGHT_LAST goes to last', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'HIGHLIGHT_LAST' });
      expect(cb.getContext().highlightedIndex).toBe(3);
    });

    it('filtrelenmiş listede highlight çalışır / highlight works in filtered list', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'a' }); // ABD, Almanya
      expect(cb.getContext().highlightedIndex).toBe(0);
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      expect(cb.getContext().highlightedIndex).toBe(1);
    });

    it('disabled seçenek atlanır / disabled option is skipped', () => {
      const cb = createCombobox({ options: withDisabledOptions });
      cb.send({ type: 'OPEN' });
      // index 0: Aktif (highlighted)
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      // index 1: Pasif (disabled) → atlanır → index 2: Diger Aktif
      expect(cb.getContext().highlightedIndex).toBe(2);
    });

    it('kapalıyken highlight çalışmaz / highlight does not work when closed', () => {
      const cb = make();
      cb.send({ type: 'HIGHLIGHT_NEXT' });
      expect(cb.getContext().highlightedIndex).toBe(-1);
    });
  });

  // ── Disabled / ReadOnly / Invalid ───────────────────────────────

  describe('disabled / readOnly / invalid', () => {
    it('disabled iken arama yapılamaz / cannot search when disabled', () => {
      const cb = make({ disabled: true });
      cb.send({ type: 'SET_SEARCH', value: 'test' });
      expect(cb.getContext().searchValue).toBe('');
    });

    it('disabled iken açılamaz / cannot open when disabled', () => {
      const cb = make({ disabled: true });
      cb.send({ type: 'OPEN' });
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('SET_DISABLED true kapatır / SET_DISABLED true closes', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'SET_DISABLED', value: true });
      expect(cb.getContext().isOpen).toBe(false);
    });

    it('SET_READ_ONLY günceller / SET_READ_ONLY updates', () => {
      const cb = make();
      cb.send({ type: 'SET_READ_ONLY', value: true });
      expect(cb.getContext().readOnly).toBe(true);
    });

    it('SET_INVALID günceller / SET_INVALID updates', () => {
      const cb = make();
      cb.send({ type: 'SET_INVALID', value: true });
      expect(cb.getContext().invalid).toBe(true);
    });
  });

  // ── BLUR ────────────────────────────────────────────────────────

  describe('blur', () => {
    it('BLUR açık dropdown kapatır / BLUR closes open dropdown', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'BLUR' });
      expect(cb.getContext().isOpen).toBe(false);
      expect(cb.getContext().searchValue).toBe('');
    });

    it('allowCustomValue: BLUR ile arama değeri seçilir / allowCustomValue: search becomes value on BLUR', () => {
      const cb = make({ allowCustomValue: true });
      cb.send({ type: 'SET_SEARCH', value: 'Yeni Ülke' });
      cb.send({ type: 'BLUR' });
      expect(cb.getContext().selectedValue).toBe('Yeni Ülke');
      expect(cb.getContext().isOpen).toBe(false);
      expect(cb.getContext().searchValue).toBe('');
    });

    it('allowCustomValue: boş arama ile BLUR seçim değiştirmez / allowCustomValue: empty search BLUR no change', () => {
      const cb = make({ allowCustomValue: true, value: 'tr' });
      cb.send({ type: 'OPEN' });
      cb.send({ type: 'BLUR' });
      expect(cb.getContext().selectedValue).toBe('tr');
    });
  });

  // ── Etkileşim state geçişleri ───────────────────────────────────

  describe('etkileşim state / interaction state', () => {
    it('POINTER_ENTER hover yapar / POINTER_ENTER sets hover', () => {
      const cb = make();
      cb.send({ type: 'POINTER_ENTER' });
      expect(cb.getContext().interactionState).toBe('hover');
    });

    it('POINTER_LEAVE idle yapar / POINTER_LEAVE sets idle', () => {
      const cb = make();
      cb.send({ type: 'POINTER_ENTER' });
      cb.send({ type: 'POINTER_LEAVE' });
      expect(cb.getContext().interactionState).toBe('idle');
    });

    it('FOCUS focused yapar / FOCUS sets focused', () => {
      const cb = make();
      cb.send({ type: 'FOCUS' });
      expect(cb.getContext().interactionState).toBe('focused');
    });

    it('BLUR idle yapar / BLUR sets idle', () => {
      const cb = make();
      cb.send({ type: 'FOCUS' });
      cb.send({ type: 'BLUR' });
      expect(cb.getContext().interactionState).toBe('idle');
    });
  });

  // ── DOM Props ───────────────────────────────────────────────────

  describe('DOM props', () => {
    it('input props doğru / input props correct', () => {
      const cb = make();
      const props = cb.getInputProps();
      expect(props.role).toBe('combobox');
      expect(props['aria-expanded']).toBe(false);
      expect(props['aria-haspopup']).toBe('listbox');
      expect(props['aria-autocomplete']).toBe('list');
      expect(props.autoComplete).toBe('off');
    });

    it('açıkken aria-expanded true / aria-expanded true when open', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      expect(cb.getInputProps()['aria-expanded']).toBe(true);
    });

    it('highlight varken aria-activedescendant dolu / aria-activedescendant set when highlighted', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      expect(cb.getInputProps()['aria-activedescendant']).toBe('cb-option-0');
    });

    it('disabled props doğru / disabled props correct', () => {
      const cb = make({ disabled: true });
      const props = cb.getInputProps();
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('invalid props doğru / invalid props correct', () => {
      const cb = make({ invalid: true });
      const props = cb.getInputProps();
      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('listbox props doğru / listbox props correct', () => {
      const cb = make();
      const props = cb.getListboxProps();
      expect(props.role).toBe('listbox');
      expect(props.tabIndex).toBe(-1);
    });

    it('option props doğru / option props correct', () => {
      const cb = make({ value: 'tr' });
      cb.send({ type: 'OPEN' });
      const props = cb.getOptionProps(0);
      expect(props.role).toBe('option');
      expect(props['aria-selected']).toBe(true);
      expect(props['data-highlighted']).toBe('');
    });

    it('seçili olmayan option / non-selected option', () => {
      const cb = make();
      cb.send({ type: 'OPEN' });
      const props = cb.getOptionProps(1);
      expect(props['aria-selected']).toBe(false);
      expect(props['data-highlighted']).toBeUndefined();
    });
  });

  // ── Prop sync ───────────────────────────────────────────────────

  describe('prop sync', () => {
    it('SET_OPTIONS seçenekleri günceller / SET_OPTIONS updates options', () => {
      const cb = make();
      const newOpts = [{ value: 'x', label: 'X' }];
      cb.send({ type: 'SET_OPTIONS', options: newOpts });
      expect(cb.getContext().flatOptions).toHaveLength(1);
    });

    it('SET_OPTIONS mevcut aramayı yeniden filtreler / SET_OPTIONS re-filters current search', () => {
      const cb = make();
      cb.send({ type: 'SET_SEARCH', value: 'tür' });
      expect(cb.getContext().filteredOptions).toHaveLength(1);
      cb.send({ type: 'SET_OPTIONS', options: [{ value: 'tr', label: 'Türkiye' }, { value: 'tm', label: 'Türkmenistan' }] });
      expect(cb.getContext().filteredOptions).toHaveLength(2);
    });

    it('SET_VALUE değer günceller / SET_VALUE updates value', () => {
      const cb = make();
      cb.send({ type: 'SET_VALUE', value: 'de' });
      expect(cb.getContext().selectedValue).toBe('de');
    });

    it('SET_VALUE aynı değer değişmez / SET_VALUE same value no change', () => {
      const cb = make({ value: 'tr' });
      const ctx1 = cb.getContext();
      cb.send({ type: 'SET_VALUE', value: 'tr' });
      expect(cb.getContext()).toBe(ctx1);
    });
  });

  // ── isOpen / isInteractionBlocked ───────────────────────────────

  describe('API yardımcıları / API helpers', () => {
    it('isOpen doğru döner / isOpen returns correct value', () => {
      const cb = make();
      expect(cb.isOpen()).toBe(false);
      cb.send({ type: 'OPEN' });
      expect(cb.isOpen()).toBe(true);
    });

    it('isInteractionBlocked disabled durumunda true / isInteractionBlocked true when disabled', () => {
      const cb = make({ disabled: true });
      expect(cb.isInteractionBlocked()).toBe(true);
    });

    it('isInteractionBlocked normal durumda false / isInteractionBlocked false normally', () => {
      const cb = make();
      expect(cb.isInteractionBlocked()).toBe(false);
    });
  });
});
