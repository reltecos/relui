/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createMCCombobox, findItemIndexByValue, findItemLabelByValue } from './multi-column-combobox.machine';
import type { MCComboboxItem, MCComboboxColumn, MCComboboxProps } from './multi-column-combobox.types';

// ── Test verileri / Test data ───────────────────────────────────────

const columns: MCComboboxColumn[] = [
  { key: 'code', header: 'Kod', width: '4rem' },
  { key: 'name', header: 'İsim' },
  { key: 'dept', header: 'Departman' },
];

const items: MCComboboxItem[] = [
  { value: 1, label: 'Ali Yılmaz', data: { code: 'E001', name: 'Ali Yılmaz', dept: 'Mühendislik' } },
  { value: 2, label: 'Ayşe Demir', data: { code: 'E002', name: 'Ayşe Demir', dept: 'Pazarlama' } },
  { value: 3, label: 'Mehmet Kaya', data: { code: 'E003', name: 'Mehmet Kaya', dept: 'Mühendislik' } },
  { value: 4, label: 'Fatma Şahin', data: { code: 'E004', name: 'Fatma Şahin', dept: 'İnsan Kaynakları' }, disabled: true },
  { value: 5, label: 'Emre Çelik', data: { code: 'E005', name: 'Emre Çelik', dept: 'Pazarlama' } },
];

function createDefault(overrides?: Partial<MCComboboxProps>) {
  return createMCCombobox({
    columns,
    items,
    placeholder: 'Çalışan arayın',
    ...overrides,
  });
}

// ── Yardımcı fonksiyonlar ───────────────────────────────────────────

describe('findItemIndexByValue', () => {
  it('var olan value indeksini döner', () => {
    expect(findItemIndexByValue(items, 3)).toBe(2);
  });

  it('olmayan value için -1 döner', () => {
    expect(findItemIndexByValue(items, 999)).toBe(-1);
  });
});

describe('findItemLabelByValue', () => {
  it('var olan value label döner', () => {
    expect(findItemLabelByValue(items, 2)).toBe('Ayşe Demir');
  });

  it('olmayan value için undefined döner', () => {
    expect(findItemLabelByValue(items, 999)).toBeUndefined();
  });
});

// ── Başlangıç durumu ────────────────────────────────────────────────

describe('initial state', () => {
  it('varsayılan context doğru başlar', () => {
    const api = createDefault();
    const ctx = api.getContext();

    expect(ctx.isOpen).toBe(false);
    expect(ctx.selectedValue).toBeUndefined();
    expect(ctx.searchValue).toBe('');
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.interactionState).toBe('idle');
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
    expect(ctx.showHeaders).toBe(true);
    expect(ctx.items).toHaveLength(5);
    expect(ctx.filteredItems).toHaveLength(5);
    expect(ctx.columns).toHaveLength(3);
  });

  it('defaultValue ile başlar', () => {
    const api = createDefault({ defaultValue: 2 });
    expect(api.getContext().selectedValue).toBe(2);
    expect(api.getSelectedLabel()).toBe('Ayşe Demir');
  });

  it('controlled value ile başlar', () => {
    const api = createDefault({ value: 3 });
    expect(api.getContext().selectedValue).toBe(3);
    expect(api.getSelectedLabel()).toBe('Mehmet Kaya');
  });

  it('showHeaders false olabilir', () => {
    const api = createDefault({ showHeaders: false });
    expect(api.getContext().showHeaders).toBe(false);
  });
});

// ── OPEN / CLOSE / TOGGLE ───────────────────────────────────────────

describe('OPEN / CLOSE / TOGGLE', () => {
  it('OPEN dropdown açar', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    expect(api.isOpen()).toBe(true);
    expect(api.getContext().interactionState).toBe('open');
  });

  it('OPEN zaten açıkken değişmez', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    const ctx1 = api.getContext();
    api.send({ type: 'OPEN' });
    expect(api.getContext()).toBe(ctx1);
  });

  it('CLOSE dropdown kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.isOpen()).toBe(false);
    expect(api.getContext().interactionState).toBe('focused');
    expect(api.getContext().searchValue).toBe('');
  });

  it('CLOSE zaten kapalıyken değişmez', () => {
    const api = createDefault();
    const ctx1 = api.getContext();
    api.send({ type: 'CLOSE' });
    expect(api.getContext()).toBe(ctx1);
  });

  it('TOGGLE açar ve kapatır', () => {
    const api = createDefault();
    api.send({ type: 'TOGGLE' });
    expect(api.isOpen()).toBe(true);
    api.send({ type: 'TOGGLE' });
    expect(api.isOpen()).toBe(false);
  });

  it('readOnly durumda OPEN ve TOGGLE etkisiz', () => {
    const api = createDefault({ readOnly: true });
    api.send({ type: 'OPEN' });
    expect(api.isOpen()).toBe(false);
    api.send({ type: 'TOGGLE' });
    expect(api.isOpen()).toBe(false);
  });
});

// ── SET_SEARCH (filtreleme) ─────────────────────────────────────────

describe('SET_SEARCH', () => {
  it('label ile filtreler', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'ali' });
    expect(api.getContext().filteredItems).toHaveLength(1);
    expect(api.getContext().filteredItems[0].label).toBe('Ali Yılmaz');
    expect(api.isOpen()).toBe(true);
  });

  it('sütun verisi ile filtreler', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'pazarlama' });
    const filtered = api.getContext().filteredItems;
    expect(filtered).toHaveLength(2);
    expect(filtered[0].label).toBe('Ayşe Demir');
    expect(filtered[1].label).toBe('Emre Çelik');
  });

  it('kod sütunu ile filtreler', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'E003' });
    expect(api.getContext().filteredItems).toHaveLength(1);
    expect(api.getContext().filteredItems[0].label).toBe('Mehmet Kaya');
  });

  it('boş arama tüm item\'ları döner', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'ali' });
    expect(api.getContext().filteredItems).toHaveLength(1);
    api.send({ type: 'SET_SEARCH', value: '' });
    expect(api.getContext().filteredItems).toHaveLength(5);
  });

  it('sonuç yoksa highlightedIndex -1 olur', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'zzzzz' });
    expect(api.getContext().filteredItems).toHaveLength(0);
    expect(api.getContext().highlightedIndex).toBe(-1);
  });

  it('özel filterFn kullanılabilir', () => {
    const api = createMCCombobox({
      columns,
      items,
      filterFn: (item, search) => item.label.startsWith(search),
    });
    api.send({ type: 'SET_SEARCH', value: 'Ay' });
    expect(api.getContext().filteredItems).toHaveLength(1);
    expect(api.getContext().filteredItems[0].label).toBe('Ayşe Demir');
  });
});

// ── SELECT ──────────────────────────────────────────────────────────

describe('SELECT', () => {
  it('item seçer ve dropdown kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 2 });
    expect(api.getContext().selectedValue).toBe(2);
    expect(api.isOpen()).toBe(false);
    expect(api.getSelectedLabel()).toBe('Ayşe Demir');
  });

  it('disabled item seçilemez', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 4 });
    expect(api.getContext().selectedValue).toBeUndefined();
  });

  it('aynı değer seçilince dropdown kapanır ama value değişmez', () => {
    const api = createDefault({ defaultValue: 2 });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 2 });
    expect(api.getContext().selectedValue).toBe(2);
    expect(api.isOpen()).toBe(false);
  });

  it('SELECT sonrası searchValue temizlenir', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'ali' });
    api.send({ type: 'SELECT', value: 1 });
    expect(api.getContext().searchValue).toBe('');
    expect(api.getContext().filteredItems).toHaveLength(5);
  });
});

// ── CLEAR ───────────────────────────────────────────────────────────

describe('CLEAR', () => {
  it('seçimi temizler', () => {
    const api = createDefault({ defaultValue: 2 });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().selectedValue).toBeUndefined();
    expect(api.getSelectedLabel()).toBeUndefined();
  });

  it('searchValue temizlenir', () => {
    const api = createDefault();
    api.send({ type: 'SET_SEARCH', value: 'ali' });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().searchValue).toBe('');
    expect(api.getContext().filteredItems).toHaveLength(5);
  });

  it('zaten temizse context değişmez', () => {
    const api = createDefault();
    const ctx1 = api.getContext();
    api.send({ type: 'CLEAR' });
    expect(api.getContext()).toBe(ctx1);
  });
});

// ── HIGHLIGHT ───────────────────────────────────────────────────────

describe('HIGHLIGHT', () => {
  it('OPEN ilk enabled item\'ı highlight eder', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_NEXT bir sonraki enabled item\'a geçer', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('HIGHLIGHT_NEXT disabled item\'ı atlar', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', index: 2 }); // index 2 → Mehmet
    api.send({ type: 'HIGHLIGHT_NEXT' }); // index 3 disabled → 4'e atlar
    expect(api.getContext().highlightedIndex).toBe(4);
  });

  it('HIGHLIGHT_PREV bir önceki enabled item\'a geçer', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', index: 2 });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('HIGHLIGHT_FIRST ilk enabled item\'a gider', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', index: 4 });
    api.send({ type: 'HIGHLIGHT_FIRST' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_LAST son enabled item\'a gider', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_LAST' });
    expect(api.getContext().highlightedIndex).toBe(4); // index 4 = Emre (enabled)
  });

  it('HIGHLIGHT disabled item\'a index değişmez', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', index: 3 }); // disabled
    expect(api.getContext().highlightedIndex).toBe(0); // değişmez
  });

  it('dropdown kapalıyken HIGHLIGHT etkisiz', () => {
    const api = createDefault();
    const ctx1 = api.getContext();
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext()).toBe(ctx1);
  });

  it('HIGHLIGHT_NEXT son item\'dan ilk\'e wrap olur', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', index: 4 });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });
});

// ── Prop sync ───────────────────────────────────────────────────────

describe('prop sync', () => {
  it('SET_DISABLED dropdown kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_DISABLED', value: true });
    expect(api.isOpen()).toBe(false);
    expect(api.isInteractionBlocked()).toBe(true);
  });

  it('SET_DISABLED aynı değer context değiştirmez', () => {
    const api = createDefault();
    const ctx1 = api.getContext();
    api.send({ type: 'SET_DISABLED', value: false });
    expect(api.getContext()).toBe(ctx1);
  });

  it('disabled durumda etkileşim engellenir', () => {
    const api = createDefault({ disabled: true });
    api.send({ type: 'OPEN' });
    expect(api.isOpen()).toBe(false);
    api.send({ type: 'SET_SEARCH', value: 'ali' });
    expect(api.getContext().searchValue).toBe('');
  });

  it('SET_READ_ONLY günceller', () => {
    const api = createDefault();
    api.send({ type: 'SET_READ_ONLY', value: true });
    expect(api.getContext().readOnly).toBe(true);
  });

  it('SET_INVALID günceller', () => {
    const api = createDefault();
    api.send({ type: 'SET_INVALID', value: true });
    expect(api.getContext().invalid).toBe(true);
  });

  it('SET_VALUE dışarıdan değer atar', () => {
    const api = createDefault();
    api.send({ type: 'SET_VALUE', value: 3 });
    expect(api.getContext().selectedValue).toBe(3);
    expect(api.getSelectedLabel()).toBe('Mehmet Kaya');
  });

  it('SET_ITEMS item listesini günceller', () => {
    const api = createDefault();
    const newItems: MCComboboxItem[] = [
      { value: 10, label: 'Yeni Kişi', data: { code: 'N001', name: 'Yeni Kişi', dept: 'Yeni' } },
    ];
    api.send({ type: 'SET_ITEMS', items: newItems });
    expect(api.getContext().items).toHaveLength(1);
    expect(api.getContext().filteredItems).toHaveLength(1);
  });
});

// ── Etkileşim state geçişleri ───────────────────────────────────────

describe('interaction state transitions', () => {
  it('POINTER_ENTER → hover, POINTER_LEAVE → idle', () => {
    const api = createDefault();
    api.send({ type: 'POINTER_ENTER' });
    expect(api.getContext().interactionState).toBe('hover');
    api.send({ type: 'POINTER_LEAVE' });
    expect(api.getContext().interactionState).toBe('idle');
  });

  it('FOCUS → focused (dropdown kapalı)', () => {
    const api = createDefault();
    api.send({ type: 'FOCUS' });
    expect(api.getContext().interactionState).toBe('focused');
  });

  it('BLUR dropdown açıkken kapatır ve idle olur', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'BLUR' });
    expect(api.isOpen()).toBe(false);
    expect(api.getContext().interactionState).toBe('idle');
    expect(api.getContext().searchValue).toBe('');
  });

  it('BLUR dropdown kapalıyken idle olur', () => {
    const api = createDefault();
    api.send({ type: 'FOCUS' });
    api.send({ type: 'BLUR' });
    expect(api.getContext().interactionState).toBe('idle');
  });
});

// ── DOM Props ───────────────────────────────────────────────────────

describe('DOM props', () => {
  it('getInputProps doğru attribute döner', () => {
    const api = createDefault();
    const inputProps = api.getInputProps();
    expect(inputProps.role).toBe('combobox');
    expect(inputProps['aria-expanded']).toBe(false);
    expect(inputProps['aria-haspopup']).toBe('grid');
    expect(inputProps['aria-autocomplete']).toBe('list');
    expect(inputProps.autoComplete).toBe('off');
    expect(inputProps['data-state']).toBe('idle');
    expect(inputProps['aria-activedescendant']).toBeUndefined();
  });

  it('dropdown açıkken aria-activedescendant set edilir', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    const inputProps = api.getInputProps();
    expect(inputProps['aria-expanded']).toBe(true);
    expect(inputProps['aria-activedescendant']).toBe('mccb-row-0');
  });

  it('disabled durumda data attribute\'lar set edilir', () => {
    const api = createDefault({ disabled: true });
    const inputProps = api.getInputProps();
    expect(inputProps['aria-disabled']).toBe(true);
    expect(inputProps['data-disabled']).toBe('');
  });

  it('invalid durumda data attribute\'lar set edilir', () => {
    const api = createDefault({ invalid: true });
    const inputProps = api.getInputProps();
    expect(inputProps['aria-invalid']).toBe(true);
    expect(inputProps['data-invalid']).toBe('');
  });

  it('readOnly durumda data attribute\'lar set edilir', () => {
    const api = createDefault({ readOnly: true });
    const inputProps = api.getInputProps();
    expect(inputProps['aria-readonly']).toBe(true);
    expect(inputProps['data-readonly']).toBe('');
  });

  it('required durumda aria-required set edilir', () => {
    const api = createDefault({ required: true });
    const inputProps = api.getInputProps();
    expect(inputProps['aria-required']).toBe(true);
  });

  it('getGridProps doğru attribute döner', () => {
    const api = createDefault();
    const gridProps = api.getGridProps();
    expect(gridProps.role).toBe('grid');
    expect(gridProps.tabIndex).toBe(-1);
  });

  it('getRowProps doğru attribute döner', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    const rowProps = api.getRowProps(0);
    expect(rowProps.role).toBe('row');
    expect(rowProps['aria-selected']).toBe(false);
    expect(rowProps['data-highlighted']).toBe('');
  });

  it('seçili row aria-selected true döner', () => {
    const api = createDefault({ defaultValue: 1 });
    api.send({ type: 'OPEN' });
    const rowProps = api.getRowProps(0);
    expect(rowProps['aria-selected']).toBe(true);
  });

  it('disabled row data-disabled set edilir', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    const rowProps = api.getRowProps(3); // Fatma — disabled
    expect(rowProps['aria-disabled']).toBe(true);
    expect(rowProps['data-disabled']).toBe('');
  });
});

// ── getSelectedLabel ────────────────────────────────────────────────

describe('getSelectedLabel', () => {
  it('seçim yokken undefined döner', () => {
    const api = createDefault();
    expect(api.getSelectedLabel()).toBeUndefined();
  });

  it('seçim varken label döner', () => {
    const api = createDefault({ defaultValue: 1 });
    expect(api.getSelectedLabel()).toBe('Ali Yılmaz');
  });

  it('item bulunamazsa String(value) döner', () => {
    const api = createDefault();
    api.send({ type: 'SET_VALUE', value: 999 });
    expect(api.getSelectedLabel()).toBe('999');
  });
});

// ── Full flow ───────────────────────────────────────────────────────

describe('full flow', () => {
  it('arama → highlight → seçim → temizleme akışı', () => {
    const api = createDefault();

    // Arama yap
    api.send({ type: 'SET_SEARCH', value: 'müh' });
    expect(api.getContext().filteredItems).toHaveLength(2); // Ali + Mehmet

    // Highlight next
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(1);

    // Seç
    const highlighted = api.getContext().filteredItems[1];
    api.send({ type: 'SELECT', value: highlighted.value });
    expect(api.getContext().selectedValue).toBe(highlighted.value);
    expect(api.isOpen()).toBe(false);
    expect(api.getContext().searchValue).toBe('');

    // Temizle
    api.send({ type: 'CLEAR' });
    expect(api.getContext().selectedValue).toBeUndefined();
  });
});
