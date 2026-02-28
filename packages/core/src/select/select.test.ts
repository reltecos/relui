/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import {
  createSelect,
  flattenOptions,
  findIndexByValue,
  findLabelByValue,
} from './select.machine';
import { isOptionGroup } from './select.types';

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
  { value: 'd', label: 'D', disabled: true },
  { value: 'e', label: 'E' },
];

// ── isOptionGroup ───────────────────────────────────────────────────

describe('isOptionGroup', () => {
  it('grup dogru tespit edilir / group is detected correctly', () => {
    expect(isOptionGroup({ label: 'Grup', options: [] })).toBe(true);
  });

  it('secenek dogru tespit edilir / option is detected correctly', () => {
    expect(isOptionGroup({ value: 'a', label: 'A' })).toBe(false);
  });
});

// ── flattenOptions ──────────────────────────────────────────────────

describe('flattenOptions', () => {
  it('duz liste aynen doner / flat list returns as is', () => {
    const flat = flattenOptions(basicOptions);
    expect(flat).toHaveLength(3);
    expect(flat[0]?.value).toBe('tr');
  });

  it('gruplar duzlestirilir / groups are flattened', () => {
    const flat = flattenOptions(groupedOptions);
    expect(flat).toHaveLength(4);
    expect(flat[0]?.value).toBe('de');
    expect(flat[2]?.value).toBe('tr');
  });

  it('bos liste bos doner / empty list returns empty', () => {
    expect(flattenOptions([])).toHaveLength(0);
  });

  it('karisik liste duzlestirilir / mixed list is flattened', () => {
    const mixed = [
      { value: 'solo', label: 'Yalniz' },
      { label: 'Grup', options: [{ value: 'g1', label: 'G1' }] },
    ];
    const flat = flattenOptions(mixed);
    expect(flat).toHaveLength(2);
    expect(flat[0]?.value).toBe('solo');
    expect(flat[1]?.value).toBe('g1');
  });
});

// ── findIndexByValue / findLabelByValue ─────────────────────────────

describe('findIndexByValue', () => {
  const flat = flattenOptions(basicOptions);

  it('var olan degeri bulur / finds existing value', () => {
    expect(findIndexByValue(flat, 'us')).toBe(1);
  });

  it('olmayan deger -1 doner / missing value returns -1', () => {
    expect(findIndexByValue(flat, 'xx')).toBe(-1);
  });

  it('undefined -1 doner / undefined returns -1', () => {
    expect(findIndexByValue(flat, undefined)).toBe(-1);
  });
});

describe('findLabelByValue', () => {
  const flat = flattenOptions(basicOptions);

  it('var olan degerin etiketini bulur / finds label for existing value', () => {
    expect(findLabelByValue(flat, 'de')).toBe('Almanya');
  });

  it('olmayan deger undefined doner / missing value returns undefined', () => {
    expect(findLabelByValue(flat, 'xx')).toBeUndefined();
  });
});

// ── createSelect — varsayilanlar ────────────────────────────────────

describe('createSelect', () => {
  describe('varsayilanlar / defaults', () => {
    it('bos state ile olusur / creates with empty state', () => {
      const select = createSelect({ options: basicOptions });
      const ctx = select.getContext();

      expect(ctx.isOpen).toBe(false);
      expect(ctx.selectedValue).toBeUndefined();
      expect(ctx.highlightedIndex).toBe(-1);
      expect(ctx.disabled).toBe(false);
      expect(ctx.readOnly).toBe(false);
      expect(ctx.invalid).toBe(false);
      expect(ctx.required).toBe(false);
      expect(ctx.interactionState).toBe('idle');
    });

    it('baslangic degeri alinir / initial value is taken', () => {
      const select = createSelect({ options: basicOptions, value: 'us' });
      expect(select.getContext().selectedValue).toBe('us');
    });

    it('defaultValue alinir / defaultValue is taken', () => {
      const select = createSelect({ options: basicOptions, defaultValue: 'de' });
      expect(select.getContext().selectedValue).toBe('de');
    });

    it('value defaultValue yi override eder / value overrides defaultValue', () => {
      const select = createSelect({ options: basicOptions, value: 'tr', defaultValue: 'us' });
      expect(select.getContext().selectedValue).toBe('tr');
    });

    it('placeholder alinir / placeholder is taken', () => {
      const select = createSelect({ options: basicOptions, placeholder: 'Secin' });
      expect(select.getContext().placeholder).toBe('Secin');
    });

    it('flatOptions gruplardan duzlestirilir / flatOptions are flattened from groups', () => {
      const select = createSelect({ options: groupedOptions });
      expect(select.getContext().flatOptions).toHaveLength(4);
    });
  });

  // ── Acma / Kapama ─────────────────────────────────────────────────

  describe('acma kapama / open close', () => {
    it('OPEN dropdown acar / OPEN opens dropdown', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      expect(select.getContext().isOpen).toBe(true);
      expect(select.getContext().interactionState).toBe('open');
    });

    it('CLOSE dropdown kapatir / CLOSE closes dropdown', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'CLOSE' });
      expect(select.getContext().isOpen).toBe(false);
      expect(select.getContext().interactionState).toBe('focused');
    });

    it('TOGGLE acik/kapali cevirir / TOGGLE toggles', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'TOGGLE' });
      expect(select.getContext().isOpen).toBe(true);
      select.send({ type: 'TOGGLE' });
      expect(select.getContext().isOpen).toBe(false);
    });

    it('acilirken secili oge highlight edilir / selected item highlighted on open', () => {
      const select = createSelect({ options: basicOptions, value: 'us' });
      select.send({ type: 'OPEN' });
      expect(select.getContext().highlightedIndex).toBe(1);
    });

    it('acilirken secili yoksa ilk oge highlight edilir / first item highlighted when no selection', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      expect(select.getContext().highlightedIndex).toBe(0);
    });

    it('kapatilinca highlight sifirlanir / highlight resets on close', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT_NEXT' });
      select.send({ type: 'CLOSE' });
      expect(select.getContext().highlightedIndex).toBe(-1);
    });

    it('zaten acikken OPEN etkisiz / OPEN ignored when already open', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      const ctx1 = select.getContext();
      select.send({ type: 'OPEN' });
      expect(select.getContext()).toBe(ctx1);
    });

    it('zaten kapalikken CLOSE etkisiz / CLOSE ignored when already closed', () => {
      const select = createSelect({ options: basicOptions });
      const ctx1 = select.getContext();
      select.send({ type: 'CLOSE' });
      expect(select.getContext()).toBe(ctx1);
    });
  });

  // ── Secim / Selection ─────────────────────────────────────────────

  describe('secim / selection', () => {
    it('SELECT deger secer ve dropdown kapatir / SELECT selects and closes', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'SELECT', value: 'de' });
      expect(select.getContext().selectedValue).toBe('de');
      expect(select.getContext().isOpen).toBe(false);
    });

    it('secili etiket alinir / selected label is retrieved', () => {
      const select = createSelect({ options: basicOptions, value: 'tr' });
      expect(select.getSelectedLabel()).toBe('Türkiye');
    });

    it('secim yoksa etiket undefined / no selection returns undefined label', () => {
      const select = createSelect({ options: basicOptions });
      expect(select.getSelectedLabel()).toBeUndefined();
    });

    it('disabled secenek secilemez / disabled option cannot be selected', () => {
      const select = createSelect({ options: withDisabledOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'SELECT', value: 'b' });
      expect(select.getContext().selectedValue).toBeUndefined();
      expect(select.getContext().isOpen).toBe(true);
    });

    it('SET_VALUE programatik secim yapar / SET_VALUE sets value programmatically', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'SET_VALUE', value: 'us' });
      expect(select.getContext().selectedValue).toBe('us');
    });

    it('SET_VALUE undefined ile secim kaldirilir / SET_VALUE undefined clears selection', () => {
      const select = createSelect({ options: basicOptions, value: 'tr' });
      select.send({ type: 'SET_VALUE', value: undefined });
      expect(select.getContext().selectedValue).toBeUndefined();
    });
  });

  // ── Highlight / Navigasyon ────────────────────────────────────────

  describe('highlight navigasyon / highlight navigation', () => {
    it('HIGHLIGHT_NEXT sonraki secenege gider / moves to next option', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      expect(select.getContext().highlightedIndex).toBe(0);
      select.send({ type: 'HIGHLIGHT_NEXT' });
      expect(select.getContext().highlightedIndex).toBe(1);
    });

    it('HIGHLIGHT_PREV onceki secenege gider / moves to previous option', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT_NEXT' });
      select.send({ type: 'HIGHLIGHT_NEXT' });
      select.send({ type: 'HIGHLIGHT_PREV' });
      expect(select.getContext().highlightedIndex).toBe(1);
    });

    it('HIGHLIGHT_FIRST ilk secenege gider / moves to first option', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT_LAST' });
      select.send({ type: 'HIGHLIGHT_FIRST' });
      expect(select.getContext().highlightedIndex).toBe(0);
    });

    it('HIGHLIGHT_LAST son secenege gider / moves to last option', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT_LAST' });
      expect(select.getContext().highlightedIndex).toBe(2);
    });

    it('son secenekten sonra basa sarar / wraps from last to first', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT_LAST' });
      select.send({ type: 'HIGHLIGHT_NEXT' });
      expect(select.getContext().highlightedIndex).toBe(0);
    });

    it('ilk secenekten once sona sarar / wraps from first to last', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT_PREV' });
      expect(select.getContext().highlightedIndex).toBe(2);
    });

    it('disabled secenekler atlanir / disabled options are skipped', () => {
      const select = createSelect({ options: withDisabledOptions });
      select.send({ type: 'OPEN' });
      // ilk: 0 (A), sonraki: 2 (C) — B disabled
      expect(select.getContext().highlightedIndex).toBe(0);
      select.send({ type: 'HIGHLIGHT_NEXT' });
      expect(select.getContext().highlightedIndex).toBe(2);
    });

    it('HIGHLIGHT belirli indekse gider / HIGHLIGHT moves to specific index', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT', index: 2 });
      expect(select.getContext().highlightedIndex).toBe(2);
    });

    it('disabled indeks highlight edilemez / disabled index cannot be highlighted', () => {
      const select = createSelect({ options: withDisabledOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'HIGHLIGHT', index: 1 }); // B disabled
      expect(select.getContext().highlightedIndex).toBe(0);
    });

    it('kapali iken highlight islemleri etkisiz / highlight ignored when closed', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'HIGHLIGHT_NEXT' });
      expect(select.getContext().highlightedIndex).toBe(-1);
    });
  });

  // ── Disabled ──────────────────────────────────────────────────────

  describe('disabled', () => {
    it('disabled iken acilamaz / cannot open when disabled', () => {
      const select = createSelect({ options: basicOptions, disabled: true });
      select.send({ type: 'OPEN' });
      expect(select.getContext().isOpen).toBe(false);
    });

    it('disabled iken TOGGLE etkisiz / TOGGLE ignored when disabled', () => {
      const select = createSelect({ options: basicOptions, disabled: true });
      select.send({ type: 'TOGGLE' });
      expect(select.getContext().isOpen).toBe(false);
    });

    it('acikken disabled olursa kapatilir / closing on disable while open', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'SET_DISABLED', value: true });
      expect(select.getContext().isOpen).toBe(false);
      expect(select.getContext().interactionState).toBe('idle');
    });

    it('isInteractionBlocked disabled iken true / blocked when disabled', () => {
      const select = createSelect({ options: basicOptions, disabled: true });
      expect(select.isInteractionBlocked()).toBe(true);
    });
  });

  // ── ReadOnly ──────────────────────────────────────────────────────

  describe('readOnly', () => {
    it('readOnly iken acilamaz / cannot open when readOnly', () => {
      const select = createSelect({ options: basicOptions, readOnly: true });
      select.send({ type: 'OPEN' });
      expect(select.getContext().isOpen).toBe(false);
    });

    it('readOnly iken TOGGLE etkisiz / TOGGLE ignored when readOnly', () => {
      const select = createSelect({ options: basicOptions, readOnly: true });
      select.send({ type: 'TOGGLE' });
      expect(select.getContext().isOpen).toBe(false);
    });
  });

  // ── Etkilesim durumlari / Interaction states ──────────────────────

  describe('etkilesim durumlari / interaction states', () => {
    it('POINTER_ENTER hover yapar / POINTER_ENTER hovers', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'POINTER_ENTER' });
      expect(select.getContext().interactionState).toBe('hover');
    });

    it('POINTER_LEAVE idle a doner / POINTER_LEAVE returns to idle', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'POINTER_ENTER' });
      select.send({ type: 'POINTER_LEAVE' });
      expect(select.getContext().interactionState).toBe('idle');
    });

    it('FOCUS focused yapar / FOCUS focuses', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'FOCUS' });
      expect(select.getContext().interactionState).toBe('focused');
    });

    it('BLUR idle a doner / BLUR returns to idle', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'FOCUS' });
      select.send({ type: 'BLUR' });
      expect(select.getContext().interactionState).toBe('idle');
    });

    it('acikken BLUR kapatir / BLUR while open closes', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'BLUR' });
      expect(select.getContext().isOpen).toBe(false);
      expect(select.getContext().interactionState).toBe('idle');
    });
  });

  // ── SET_OPTIONS ───────────────────────────────────────────────────

  describe('SET_OPTIONS', () => {
    it('secenekler degistirilir / options are changed', () => {
      const select = createSelect({ options: basicOptions });
      const newOptions = [{ value: 'new', label: 'Yeni' }];
      select.send({ type: 'SET_OPTIONS', options: newOptions });
      expect(select.getContext().flatOptions).toHaveLength(1);
      expect(select.getContext().flatOptions[0]?.value).toBe('new');
    });
  });

  // ── DOM Props ─────────────────────────────────────────────────────

  describe('DOM props', () => {
    it('trigger props dogru uretilir / trigger props generated correctly', () => {
      const select = createSelect({ options: basicOptions });
      const props = select.getTriggerProps();
      expect(props.role).toBe('combobox');
      expect(props['aria-expanded']).toBe(false);
      expect(props['aria-haspopup']).toBe('listbox');
      expect(props.tabIndex).toBe(0);
    });

    it('acikken aria-expanded true / aria-expanded true when open', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      expect(select.getTriggerProps()['aria-expanded']).toBe(true);
    });

    it('highlight edilen oge activedescendant olur / highlighted becomes activedescendant', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      expect(select.getTriggerProps()['aria-activedescendant']).toBe('option-0');
    });

    it('kapali iken activedescendant undefined / activedescendant undefined when closed', () => {
      const select = createSelect({ options: basicOptions });
      expect(select.getTriggerProps()['aria-activedescendant']).toBeUndefined();
    });

    it('disabled trigger props / disabled trigger props', () => {
      const select = createSelect({ options: basicOptions, disabled: true });
      const props = select.getTriggerProps();
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('invalid trigger props / invalid trigger props', () => {
      const select = createSelect({ options: basicOptions, invalid: true });
      const props = select.getTriggerProps();
      expect(props['aria-invalid']).toBe(true);
      expect(props['data-invalid']).toBe('');
    });

    it('required trigger props / required trigger props', () => {
      const select = createSelect({ options: basicOptions, required: true });
      const props = select.getTriggerProps();
      expect(props['aria-required']).toBe(true);
    });

    it('listbox props dogru uretilir / listbox props generated correctly', () => {
      const select = createSelect({ options: basicOptions });
      const props = select.getListboxProps();
      expect(props.role).toBe('listbox');
      expect(props.tabIndex).toBe(-1);
    });

    it('option props dogru uretilir / option props generated correctly', () => {
      const select = createSelect({ options: basicOptions, value: 'us' });
      select.send({ type: 'OPEN' });

      const opt0 = select.getOptionProps(0);
      expect(opt0.role).toBe('option');
      expect(opt0['aria-selected']).toBe(false);
      expect(opt0['data-highlighted']).toBeUndefined();

      const opt1 = select.getOptionProps(1);
      expect(opt1['aria-selected']).toBe(true);
      expect(opt1['data-highlighted']).toBe('');
    });

    it('disabled option props / disabled option props', () => {
      const select = createSelect({ options: withDisabledOptions });
      const opt1 = select.getOptionProps(1); // B disabled
      expect(opt1['aria-disabled']).toBe(true);
      expect(opt1['data-disabled']).toBe('');
    });
  });

  // ── isOpen ────────────────────────────────────────────────────────

  describe('isOpen', () => {
    it('kapali iken false / false when closed', () => {
      const select = createSelect({ options: basicOptions });
      expect(select.isOpen()).toBe(false);
    });

    it('acik iken true / true when open', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'OPEN' });
      expect(select.isOpen()).toBe(true);
    });
  });

  // ── Gruplu secenekler / Grouped options ───────────────────────────

  describe('gruplu secenekler / grouped options', () => {
    it('gruplu secenekler duz liste olarak calisir / grouped options work as flat list', () => {
      const select = createSelect({ options: groupedOptions });
      select.send({ type: 'OPEN' });
      expect(select.getContext().highlightedIndex).toBe(0);

      select.send({ type: 'HIGHLIGHT_NEXT' });
      expect(select.getContext().highlightedIndex).toBe(1);

      select.send({ type: 'HIGHLIGHT_NEXT' });
      expect(select.getContext().highlightedIndex).toBe(2);
    });

    it('gruplu secenekten secim yapilir / selection from grouped option', () => {
      const select = createSelect({ options: groupedOptions });
      select.send({ type: 'OPEN' });
      select.send({ type: 'SELECT', value: 'jp' });
      expect(select.getSelectedLabel()).toBe('Japonya');
    });
  });

  // ── Prop guncelleme / Prop updates ────────────────────────────────

  describe('prop guncelleme / prop updates', () => {
    it('SET_DISABLED degistirir / SET_DISABLED changes', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'SET_DISABLED', value: true });
      expect(select.getContext().disabled).toBe(true);
    });

    it('SET_READ_ONLY degistirir / SET_READ_ONLY changes', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'SET_READ_ONLY', value: true });
      expect(select.getContext().readOnly).toBe(true);
    });

    it('SET_INVALID degistirir / SET_INVALID changes', () => {
      const select = createSelect({ options: basicOptions });
      select.send({ type: 'SET_INVALID', value: true });
      expect(select.getContext().invalid).toBe(true);
    });

    it('ayni deger ise context degismez / same value returns same context', () => {
      const select = createSelect({ options: basicOptions, disabled: false });
      const ctx1 = select.getContext();
      select.send({ type: 'SET_DISABLED', value: false });
      expect(select.getContext()).toBe(ctx1);
    });
  });
});
