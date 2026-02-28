/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createMultiSelect, getSelectedLabels } from './multi-select.machine';

// ── Test verileri / Test data ───────────────────────────────────────

const basicOptions = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'ABD' },
  { value: 'de', label: 'Almanya' },
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
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
  { value: 'd', label: 'D' },
  { value: 'e', label: 'E' },
];

// ── getSelectedLabels ───────────────────────────────────────────────

describe('getSelectedLabels', () => {
  it('secili degerlerin etiketlerini dondurur / returns labels of selected values', () => {
    const labels = getSelectedLabels(basicOptions, ['tr', 'de']);
    expect(labels).toEqual(['Türkiye', 'Almanya']);
  });

  it('bos secim bos dizi dondurur / empty selection returns empty array', () => {
    expect(getSelectedLabels(basicOptions, [])).toEqual([]);
  });

  it('olmayan deger atlanir / missing value is skipped', () => {
    const labels = getSelectedLabels(basicOptions, ['tr', 'xx']);
    expect(labels).toEqual(['Türkiye']);
  });
});

// ── createMultiSelect — varsayilanlar ───────────────────────────────

describe('createMultiSelect', () => {
  describe('varsayilanlar / defaults', () => {
    it('bos state ile olusur / creates with empty state', () => {
      const ms = createMultiSelect({ options: basicOptions });
      const ctx = ms.getContext();

      expect(ctx.isOpen).toBe(false);
      expect(ctx.selectedValues).toEqual([]);
      expect(ctx.highlightedIndex).toBe(-1);
      expect(ctx.disabled).toBe(false);
      expect(ctx.readOnly).toBe(false);
      expect(ctx.invalid).toBe(false);
    });

    it('baslangic degerleri alinir / initial values are taken', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'us'] });
      expect(ms.getContext().selectedValues).toEqual(['tr', 'us']);
    });

    it('defaultValue alinir / defaultValue is taken', () => {
      const ms = createMultiSelect({ options: basicOptions, defaultValue: ['de'] });
      expect(ms.getContext().selectedValues).toEqual(['de']);
    });

    it('value defaultValue yi override eder / value overrides defaultValue', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr'], defaultValue: ['us'] });
      expect(ms.getContext().selectedValues).toEqual(['tr']);
    });

    it('gruplu secenekler duzlestirilir / grouped options are flattened', () => {
      const ms = createMultiSelect({ options: groupedOptions });
      expect(ms.getContext().flatOptions).toHaveLength(4);
    });
  });

  // ── Acma / Kapama ─────────────────────────────────────────────────

  describe('acma kapama / open close', () => {
    it('OPEN dropdown acar / OPEN opens dropdown', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      expect(ms.getContext().isOpen).toBe(true);
    });

    it('CLOSE dropdown kapatir / CLOSE closes dropdown', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'CLOSE' });
      expect(ms.getContext().isOpen).toBe(false);
    });

    it('TOGGLE acik/kapali cevirir / TOGGLE toggles', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'TOGGLE' });
      expect(ms.isOpen()).toBe(true);
      ms.send({ type: 'TOGGLE' });
      expect(ms.isOpen()).toBe(false);
    });
  });

  // ── TOGGLE_OPTION ─────────────────────────────────────────────────

  describe('TOGGLE_OPTION', () => {
    it('secilmemis secenegi secer / selects unselected option', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'TOGGLE_OPTION', value: 'tr' });
      expect(ms.getContext().selectedValues).toEqual(['tr']);
    });

    it('secili secenegi kaldirir / deselects selected option', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'us'] });
      ms.send({ type: 'TOGGLE_OPTION', value: 'tr' });
      expect(ms.getContext().selectedValues).toEqual(['us']);
    });

    it('dropdown kapanmaz / dropdown stays open', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'TOGGLE_OPTION', value: 'tr' });
      expect(ms.isOpen()).toBe(true);
    });

    it('disabled secenek toggle edilemez / disabled option cannot be toggled', () => {
      const ms = createMultiSelect({ options: withDisabledOptions });
      ms.send({ type: 'TOGGLE_OPTION', value: 'b' });
      expect(ms.getContext().selectedValues).toEqual([]);
    });

    it('maxSelections asilinca ekleme engellenir / adding blocked when maxSelections reached', () => {
      const ms = createMultiSelect({ options: basicOptions, maxSelections: 2 });
      ms.send({ type: 'TOGGLE_OPTION', value: 'tr' });
      ms.send({ type: 'TOGGLE_OPTION', value: 'us' });
      ms.send({ type: 'TOGGLE_OPTION', value: 'de' });
      expect(ms.getContext().selectedValues).toEqual(['tr', 'us']);
    });

    it('maxSelections da kaldirma calisir / removal works at maxSelections', () => {
      const ms = createMultiSelect({ options: basicOptions, maxSelections: 2, value: ['tr', 'us'] });
      ms.send({ type: 'TOGGLE_OPTION', value: 'tr' });
      expect(ms.getContext().selectedValues).toEqual(['us']);
    });
  });

  // ── SELECT / DESELECT ─────────────────────────────────────────────

  describe('SELECT / DESELECT', () => {
    it('SELECT ekler / SELECT adds', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'SELECT', value: 'tr' });
      ms.send({ type: 'SELECT', value: 'de' });
      expect(ms.getContext().selectedValues).toEqual(['tr', 'de']);
    });

    it('SELECT zaten seciliyi tekrar eklemez / SELECT does not duplicate', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr'] });
      ms.send({ type: 'SELECT', value: 'tr' });
      expect(ms.getContext().selectedValues).toEqual(['tr']);
    });

    it('DESELECT kaldirir / DESELECT removes', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'us'] });
      ms.send({ type: 'DESELECT', value: 'tr' });
      expect(ms.getContext().selectedValues).toEqual(['us']);
    });

    it('DESELECT secili olmayanla etkisiz / DESELECT no-op for unselected', () => {
      const ms = createMultiSelect({ options: basicOptions });
      const ctx = ms.getContext();
      ms.send({ type: 'DESELECT', value: 'tr' });
      expect(ms.getContext()).toBe(ctx);
    });
  });

  // ── SELECT_ALL / CLEAR_ALL ────────────────────────────────────────

  describe('SELECT_ALL / CLEAR_ALL', () => {
    it('SELECT_ALL tum secenekleri secer / selects all options', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'SELECT_ALL' });
      expect(ms.getContext().selectedValues).toEqual(['tr', 'us', 'de']);
    });

    it('SELECT_ALL disabled secenekleri atlar / skips disabled options', () => {
      const ms = createMultiSelect({ options: withDisabledOptions });
      ms.send({ type: 'SELECT_ALL' });
      expect(ms.getContext().selectedValues).toEqual(['a', 'c', 'd', 'e']);
    });

    it('SELECT_ALL maxSelections a uyar / respects maxSelections', () => {
      const ms = createMultiSelect({ options: basicOptions, maxSelections: 2 });
      ms.send({ type: 'SELECT_ALL' });
      expect(ms.getContext().selectedValues).toEqual(['tr', 'us']);
    });

    it('CLEAR_ALL tum secimi kaldirir / clears all selections', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'us'] });
      ms.send({ type: 'CLEAR_ALL' });
      expect(ms.getContext().selectedValues).toEqual([]);
    });

    it('CLEAR_ALL bossa etkisiz / CLEAR_ALL no-op when empty', () => {
      const ms = createMultiSelect({ options: basicOptions });
      const ctx = ms.getContext();
      ms.send({ type: 'CLEAR_ALL' });
      expect(ms.getContext()).toBe(ctx);
    });
  });

  // ── Highlight / Navigasyon ────────────────────────────────────────

  describe('highlight navigasyon / highlight navigation', () => {
    it('HIGHLIGHT_NEXT sonraki secenege gider / moves to next', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      expect(ms.getContext().highlightedIndex).toBe(0);
      ms.send({ type: 'HIGHLIGHT_NEXT' });
      expect(ms.getContext().highlightedIndex).toBe(1);
    });

    it('HIGHLIGHT_PREV onceki secenege gider / moves to previous', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'HIGHLIGHT_NEXT' });
      ms.send({ type: 'HIGHLIGHT_PREV' });
      expect(ms.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_FIRST ilke gider / moves to first', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'HIGHLIGHT_LAST' });
      ms.send({ type: 'HIGHLIGHT_FIRST' });
      expect(ms.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_LAST sona gider / moves to last', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'HIGHLIGHT_LAST' });
      expect(ms.getContext().highlightedIndex).toBe(2);
    });

    it('disabled atlanir / disabled skipped', () => {
      const ms = createMultiSelect({ options: withDisabledOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'HIGHLIGHT_NEXT' });
      expect(ms.getContext().highlightedIndex).toBe(2);
    });

    it('sarma calisir / wrapping works', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'HIGHLIGHT_LAST' });
      ms.send({ type: 'HIGHLIGHT_NEXT' });
      expect(ms.getContext().highlightedIndex).toBe(0);
    });
  });

  // ── Disabled ──────────────────────────────────────────────────────

  describe('disabled', () => {
    it('disabled iken acilamaz / cannot open when disabled', () => {
      const ms = createMultiSelect({ options: basicOptions, disabled: true });
      ms.send({ type: 'OPEN' });
      expect(ms.isOpen()).toBe(false);
    });

    it('acikken disabled olursa kapatilir / closes on disable', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'SET_DISABLED', value: true });
      expect(ms.isOpen()).toBe(false);
    });

    it('isInteractionBlocked true / blocked is true', () => {
      const ms = createMultiSelect({ options: basicOptions, disabled: true });
      expect(ms.isInteractionBlocked()).toBe(true);
    });
  });

  // ── ReadOnly ──────────────────────────────────────────────────────

  describe('readOnly', () => {
    it('readOnly iken acilamaz / cannot open when readOnly', () => {
      const ms = createMultiSelect({ options: basicOptions, readOnly: true });
      ms.send({ type: 'OPEN' });
      expect(ms.isOpen()).toBe(false);
    });
  });

  // ── Etkilesim durumlari / Interaction states ──────────────────────

  describe('etkilesim / interaction', () => {
    it('POINTER_ENTER hover / hover on enter', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'POINTER_ENTER' });
      expect(ms.getContext().interactionState).toBe('hover');
    });

    it('BLUR acikken kapatir / BLUR closes when open', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      ms.send({ type: 'BLUR' });
      expect(ms.isOpen()).toBe(false);
      expect(ms.getContext().interactionState).toBe('idle');
    });
  });

  // ── API metotlari ─────────────────────────────────────────────────

  describe('API', () => {
    it('getSelectedLabels secili etiketleri dondurur / returns selected labels', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'de'] });
      expect(ms.getSelectedLabels()).toEqual(['Türkiye', 'Almanya']);
    });

    it('isAllSelected tumu secilince true / true when all selected', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'us', 'de'] });
      expect(ms.isAllSelected()).toBe(true);
    });

    it('isAllSelected eksik secimde false / false when not all', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr'] });
      expect(ms.isAllSelected()).toBe(false);
    });

    it('isAllSelected disabled haric kontrol eder / checks excluding disabled', () => {
      const ms = createMultiSelect({ options: withDisabledOptions, value: ['a', 'c', 'd', 'e'] });
      expect(ms.isAllSelected()).toBe(true);
    });

    it('getSelectionCount secim sayisini dondurur / returns selection count', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr', 'us'] });
      expect(ms.getSelectionCount()).toBe(2);
    });
  });

  // ── DOM Props ─────────────────────────────────────────────────────

  describe('DOM props', () => {
    it('trigger props dogru uretilir / trigger props correct', () => {
      const ms = createMultiSelect({ options: basicOptions });
      const props = ms.getTriggerProps();
      expect(props.role).toBe('combobox');
      expect(props['aria-multiselectable']).toBe(true);
      expect(props['aria-expanded']).toBe(false);
    });

    it('acikken aria-expanded true / expanded true when open', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      expect(ms.getTriggerProps()['aria-expanded']).toBe(true);
    });

    it('activedescendant highlight a bagli / activedescendant follows highlight', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'OPEN' });
      expect(ms.getTriggerProps()['aria-activedescendant']).toBe('ms-option-0');
    });

    it('option props secili icin aria-selected true / selected option has aria-selected', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['us'] });
      const opt1 = ms.getOptionProps(1);
      expect(opt1['aria-selected']).toBe(true);
      const opt0 = ms.getOptionProps(0);
      expect(opt0['aria-selected']).toBe(false);
    });

    it('listbox props / listbox props', () => {
      const ms = createMultiSelect({ options: basicOptions });
      expect(ms.getListboxProps().role).toBe('listbox');
    });
  });

  // ── SET_VALUES ────────────────────────────────────────────────────

  describe('SET_VALUES', () => {
    it('programatik deger set eder / sets values programmatically', () => {
      const ms = createMultiSelect({ options: basicOptions });
      ms.send({ type: 'SET_VALUES', values: ['tr', 'de'] });
      expect(ms.getContext().selectedValues).toEqual(['tr', 'de']);
    });

    it('ayni deger ise context degismez / same values no change', () => {
      const ms = createMultiSelect({ options: basicOptions, value: ['tr'] });
      const ctx = ms.getContext();
      ms.send({ type: 'SET_VALUES', values: ['tr'] });
      expect(ms.getContext()).toBe(ctx);
    });
  });

  // ── Gruplu secenekler ─────────────────────────────────────────────

  describe('gruplu / grouped', () => {
    it('gruplu secenekten toggle yapilir / toggle from grouped option', () => {
      const ms = createMultiSelect({ options: groupedOptions });
      ms.send({ type: 'TOGGLE_OPTION', value: 'jp' });
      ms.send({ type: 'TOGGLE_OPTION', value: 'de' });
      expect(ms.getSelectedLabels()).toEqual(['Japonya', 'Almanya']);
    });
  });
});
