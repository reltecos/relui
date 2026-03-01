/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiColumnCombobox state machine — framework-agnostic headless multi-column combobox logic.
 * MultiColumnCombobox state machine — framework bağımsız headless çok sütunlu combobox mantığı.
 *
 * Combobox machine'inden ilham alır, çok sütunlu filtreleme ve grid layout mantığı ekler.
 *
 * @packageDocumentation
 */

import type {
  MCComboboxProps,
  MCComboboxMachineContext,
  MCComboboxEvent,
  MCComboboxInputDOMProps,
  MCComboboxGridDOMProps,
  MCComboboxRowDOMProps,
  MCComboboxInteractionState,
  MCComboboxFilterFn,
  MCComboboxItem,
  MCComboboxColumn,
  SelectValue,
} from './multi-column-combobox.types';

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getItem(items: MCComboboxItem[], index: number): MCComboboxItem | undefined {
  return items[index];
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

function findEnabledIndex(
  items: MCComboboxItem[],
  startIndex: number,
  direction: 'forward' | 'backward',
): number {
  const len = items.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    index = ((index % len) + len) % len;

    const item = getItem(items, index);
    if (item && !item.disabled) {
      return index;
    }
  }

  return -1;
}

function findFirstEnabledIndex(items: MCComboboxItem[]): number {
  for (let i = 0; i < items.length; i++) {
    const item = getItem(items, i);
    if (item && !item.disabled) return i;
  }
  return -1;
}

function findLastEnabledIndex(items: MCComboboxItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = getItem(items, i);
    if (item && !item.disabled) return i;
  }
  return -1;
}

// ── Yardımcı — Değer ile indeks bul / Find index by value ──────────

/**
 * Item listesinde value'ye göre indeks bul.
 * Find index by value in item list.
 */
export function findItemIndexByValue(items: MCComboboxItem[], value: SelectValue): number {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item && item.value === value) return i;
  }
  return -1;
}

/**
 * Item listesinde value'ye göre label bul.
 * Find label by value in item list.
 */
export function findItemLabelByValue(items: MCComboboxItem[], value: SelectValue): string | undefined {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item && item.value === value) return item.label;
  }
  return undefined;
}

// ── Varsayılan filtre / Default filter ──────────────────────────────

const defaultFilterFn: MCComboboxFilterFn = (item, searchValue, columns) => {
  if (!searchValue) return true;
  const lower = searchValue.toLowerCase();

  // Label'da ara
  if (item.label.toLowerCase().includes(lower)) return true;

  // Tüm sütun verilerinde ara
  for (const col of columns) {
    const cellValue = item.data[col.key];
    if (cellValue !== undefined && String(cellValue).toLowerCase().includes(lower)) {
      return true;
    }
  }

  return false;
};

// ── Filtreleme / Filtering ──────────────────────────────────────────

function filterItems(
  items: MCComboboxItem[],
  searchValue: string,
  columns: MCComboboxColumn[],
  filterFn: MCComboboxFilterFn,
): MCComboboxItem[] {
  if (!searchValue) return items;
  return items.filter((item) => filterFn(item, searchValue, columns));
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(
  props: MCComboboxProps,
): MCComboboxMachineContext {
  const selectedValue = props.value ?? props.defaultValue;

  return {
    interactionState: 'idle',
    columns: props.columns,
    items: props.items,
    filteredItems: props.items,
    selectedValue,
    searchValue: '',
    highlightedIndex: -1,
    isOpen: false,
    placeholder: props.placeholder ?? '',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    showHeaders: props.showHeaders ?? true,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: MCComboboxMachineContext,
  event: MCComboboxEvent,
  filterFn: MCComboboxFilterFn,
): MCComboboxMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
      isOpen: event.value ? false : ctx.isOpen,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) return ctx;
    return { ...ctx, invalid: event.value };
  }

  if (event.type === 'SET_ITEMS') {
    const filteredItems = filterItems(event.items, ctx.searchValue, ctx.columns, filterFn);
    return { ...ctx, items: event.items, filteredItems };
  }

  if (event.type === 'SET_VALUE') {
    if (event.value === ctx.selectedValue) return ctx;
    return { ...ctx, selectedValue: event.value };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Arama değeri güncelleme ──
  if (event.type === 'SET_SEARCH') {
    const filteredItems = filterItems(ctx.items, event.value, ctx.columns, filterFn);
    const highlightedIndex = filteredItems.length > 0
      ? findFirstEnabledIndex(filteredItems)
      : -1;
    return {
      ...ctx,
      searchValue: event.value,
      filteredItems,
      highlightedIndex,
      isOpen: true,
      interactionState: 'open',
    };
  }

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    const filteredItems = filterItems(ctx.items, ctx.searchValue, ctx.columns, filterFn);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      filteredItems,
      highlightedIndex: findFirstEnabledIndex(filteredItems),
    };
  }

  if (event.type === 'CLOSE') {
    if (!ctx.isOpen) return ctx;
    return {
      ...ctx,
      isOpen: false,
      interactionState: 'focused',
      highlightedIndex: -1,
      searchValue: '',
      filteredItems: ctx.items,
    };
  }

  if (event.type === 'TOGGLE') {
    if (ctx.readOnly) return ctx;
    if (ctx.isOpen) {
      return {
        ...ctx,
        isOpen: false,
        interactionState: 'focused',
        highlightedIndex: -1,
        searchValue: '',
        filteredItems: ctx.items,
      };
    }
    const filteredItems = filterItems(ctx.items, ctx.searchValue, ctx.columns, filterFn);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      filteredItems,
      highlightedIndex: findFirstEnabledIndex(filteredItems),
    };
  }

  // ── Seçim — dropdown KAPANIR, arama temizlenir ──
  if (event.type === 'SELECT') {
    const idx = findItemIndexByValue(ctx.items, event.value);
    if (idx >= 0) {
      const item = getItem(ctx.items, idx);
      if (item && item.disabled) return ctx;
    }
    if (event.value === ctx.selectedValue) {
      // Aynı değer — yine de kapat
      return {
        ...ctx,
        isOpen: false,
        interactionState: 'focused',
        highlightedIndex: -1,
        searchValue: '',
        filteredItems: ctx.items,
      };
    }
    return {
      ...ctx,
      selectedValue: event.value,
      isOpen: false,
      interactionState: 'focused',
      highlightedIndex: -1,
      searchValue: '',
      filteredItems: ctx.items,
    };
  }

  // ── Temizleme ──
  if (event.type === 'CLEAR') {
    if (ctx.selectedValue === undefined && ctx.searchValue === '') return ctx;
    return {
      ...ctx,
      selectedValue: undefined,
      searchValue: '',
      filteredItems: ctx.items,
    };
  }

  // ── Highlight (filteredItems içinde) ──
  if (event.type === 'HIGHLIGHT') {
    if (!ctx.isOpen) return ctx;
    if (event.index === ctx.highlightedIndex) return ctx;
    if (event.index >= 0 && event.index < ctx.filteredItems.length) {
      const item = getItem(ctx.filteredItems, event.index);
      if (item && item.disabled) return ctx;
    }
    return { ...ctx, highlightedIndex: event.index };
  }

  if (event.type === 'HIGHLIGHT_NEXT') {
    if (!ctx.isOpen) return ctx;
    const next = findEnabledIndex(ctx.filteredItems, ctx.highlightedIndex, 'forward');
    if (next < 0 || next === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: next };
  }

  if (event.type === 'HIGHLIGHT_PREV') {
    if (!ctx.isOpen) return ctx;
    const prev = findEnabledIndex(ctx.filteredItems, ctx.highlightedIndex, 'backward');
    if (prev < 0 || prev === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: prev };
  }

  if (event.type === 'HIGHLIGHT_FIRST') {
    if (!ctx.isOpen) return ctx;
    const first = findFirstEnabledIndex(ctx.filteredItems);
    if (first < 0 || first === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: first };
  }

  if (event.type === 'HIGHLIGHT_LAST') {
    if (!ctx.isOpen) return ctx;
    const last = findLastEnabledIndex(ctx.filteredItems);
    if (last < 0 || last === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: last };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: MCComboboxInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') nextState = 'hover';
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') nextState = 'idle';
      break;

    case 'FOCUS':
      if (!ctx.isOpen) nextState = 'focused';
      break;

    case 'BLUR':
      if (ctx.isOpen) {
        return {
          ...ctx,
          isOpen: false,
          interactionState: 'idle',
          highlightedIndex: -1,
          searchValue: '',
          filteredItems: ctx.items,
        };
      }
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getInputProps(ctx: MCComboboxMachineContext): MCComboboxInputDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'grid',
    'aria-activedescendant':
      ctx.isOpen && ctx.highlightedIndex >= 0
        ? `mccb-row-${ctx.highlightedIndex}`
        : undefined,
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-autocomplete': 'list',
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    autoComplete: 'off',
  };
}

function getGridProps(): MCComboboxGridDOMProps {
  return {
    role: 'grid',
    tabIndex: -1,
  };
}

function getRowProps(
  ctx: MCComboboxMachineContext,
  index: number,
): MCComboboxRowDOMProps {
  const item = getItem(ctx.filteredItems, index);
  const isSelected = item ? item.value === ctx.selectedValue : false;
  const isHighlighted = index === ctx.highlightedIndex;
  const isDisabled = item ? item.disabled === true : false;

  return {
    role: 'row',
    'aria-selected': isSelected,
    'aria-disabled': isDisabled ? true : undefined,
    'data-highlighted': isHighlighted ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * MultiColumnCombobox API — state machine ve DOM props üreticileri.
 * MultiColumnCombobox API — state machine and DOM props generators.
 */
export interface MCComboboxAPI {
  /** Mevcut context / Current context */
  getContext(): MCComboboxMachineContext;

  /** Event gönder / Send event */
  send(event: MCComboboxEvent): MCComboboxMachineContext;

  /** Input DOM attribute'ları / Input DOM attributes */
  getInputProps(): MCComboboxInputDOMProps;

  /** Grid DOM attribute'ları / Grid DOM attributes */
  getGridProps(): MCComboboxGridDOMProps;

  /** Row DOM attribute'ları / Row DOM attributes */
  getRowProps(index: number): MCComboboxRowDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili etiket / Selected label */
  getSelectedLabel(): string | undefined;

  /** Dropdown açık mı / Is dropdown open */
  isOpen(): boolean;
}

/**
 * MultiColumnCombobox state machine oluştur.
 * Create a multi-column combobox state machine.
 *
 * @example
 * ```ts
 * const mccb = createMCCombobox({
 *   columns: [
 *     { key: 'code', header: 'Kod', width: '4rem' },
 *     { key: 'name', header: 'İsim' },
 *     { key: 'dept', header: 'Departman' },
 *   ],
 *   items: [
 *     { value: 1, label: 'Ali Yılmaz', data: { code: 'E001', name: 'Ali Yılmaz', dept: 'Mühendislik' } },
 *     { value: 2, label: 'Ayşe Demir', data: { code: 'E002', name: 'Ayşe Demir', dept: 'Pazarlama' } },
 *   ],
 *   placeholder: 'Çalışan arayın',
 * });
 *
 * mccb.send({ type: 'SET_SEARCH', value: 'ali' });
 * mccb.getContext().filteredItems; // [{ value: 1, label: 'Ali Yılmaz', ... }]
 * ```
 */
export function createMCCombobox(props: MCComboboxProps): MCComboboxAPI {
  const filterFn = props.filterFn ?? defaultFilterFn;
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: MCComboboxEvent) {
      ctx = transition(ctx, event, filterFn);
      return ctx;
    },

    getInputProps() {
      return getInputProps(ctx);
    },

    getGridProps() {
      return getGridProps();
    },

    getRowProps(index: number) {
      return getRowProps(ctx, index);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getSelectedLabel() {
      if (ctx.selectedValue === undefined) return undefined;
      return findItemLabelByValue(ctx.items, ctx.selectedValue) ?? String(ctx.selectedValue);
    },

    isOpen() {
      return ctx.isOpen;
    },
  };
}
