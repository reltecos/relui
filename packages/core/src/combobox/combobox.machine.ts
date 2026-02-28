/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Combobox state machine — framework-agnostic headless combobox logic.
 * Combobox state machine — framework bağımsız headless combobox mantığı.
 *
 * Select machine'inden ilham alır, arama/filtreleme mantığı ekler.
 *
 * @packageDocumentation
 */

import type {
  ComboboxProps,
  ComboboxMachineContext,
  ComboboxEvent,
  ComboboxInputDOMProps,
  ComboboxListboxDOMProps,
  ComboboxOptionDOMProps,
  ComboboxInteractionState,
  ComboboxFilterFn,
  SelectOption,
} from './combobox.types';
import { flattenOptions, findIndexByValue, findLabelByValue } from '../select/select.machine';

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getOption(options: SelectOption[], index: number): SelectOption | undefined {
  return options[index];
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

function findEnabledIndex(
  options: SelectOption[],
  startIndex: number,
  direction: 'forward' | 'backward',
): number {
  const len = options.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    index = ((index % len) + len) % len;

    const opt = getOption(options, index);
    if (opt && !opt.disabled) {
      return index;
    }
  }

  return -1;
}

function findFirstEnabledIndex(options: SelectOption[]): number {
  for (let i = 0; i < options.length; i++) {
    const opt = getOption(options, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

function findLastEnabledIndex(options: SelectOption[]): number {
  for (let i = options.length - 1; i >= 0; i--) {
    const opt = getOption(options, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

// ── Varsayılan filtre / Default filter ──────────────────────────────

const defaultFilterFn: ComboboxFilterFn = (option, searchValue) => {
  if (!searchValue) return true;
  return option.label.toLowerCase().includes(searchValue.toLowerCase());
};

// ── Filtreleme / Filtering ──────────────────────────────────────────

function filterOptions(
  flatOptions: SelectOption[],
  searchValue: string,
  filterFn: ComboboxFilterFn,
): SelectOption[] {
  if (!searchValue) return flatOptions;
  return flatOptions.filter((opt) => filterFn(opt, searchValue));
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(
  props: ComboboxProps,
): ComboboxMachineContext {
  const flatOptions = flattenOptions(props.options);
  const selectedValue = props.value ?? props.defaultValue;

  return {
    interactionState: 'idle',
    options: props.options,
    flatOptions,
    filteredOptions: flatOptions,
    selectedValue,
    searchValue: '',
    highlightedIndex: -1,
    isOpen: false,
    placeholder: props.placeholder ?? '',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    allowCustomValue: props.allowCustomValue ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: ComboboxMachineContext,
  event: ComboboxEvent,
  filterFn: ComboboxFilterFn,
): ComboboxMachineContext {
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

  if (event.type === 'SET_OPTIONS') {
    const flatOptions = flattenOptions(event.options);
    const filteredOptions = filterOptions(flatOptions, ctx.searchValue, filterFn);
    return { ...ctx, options: event.options, flatOptions, filteredOptions };
  }

  if (event.type === 'SET_VALUE') {
    if (event.value === ctx.selectedValue) return ctx;
    return { ...ctx, selectedValue: event.value };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Arama değeri güncelleme ──
  if (event.type === 'SET_SEARCH') {
    const filteredOptions = filterOptions(ctx.flatOptions, event.value, filterFn);
    const highlightedIndex = filteredOptions.length > 0
      ? findFirstEnabledIndex(filteredOptions)
      : -1;
    return {
      ...ctx,
      searchValue: event.value,
      filteredOptions,
      highlightedIndex,
      isOpen: true,
      interactionState: 'open',
    };
  }

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    const filteredOptions = filterOptions(ctx.flatOptions, ctx.searchValue, filterFn);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      filteredOptions,
      highlightedIndex: findFirstEnabledIndex(filteredOptions),
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
      filteredOptions: ctx.flatOptions,
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
        filteredOptions: ctx.flatOptions,
      };
    }
    const filteredOptions = filterOptions(ctx.flatOptions, ctx.searchValue, filterFn);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      filteredOptions,
      highlightedIndex: findFirstEnabledIndex(filteredOptions),
    };
  }

  // ── Seçim — dropdown KAPANIR, arama temizlenir ──
  if (event.type === 'SELECT') {
    const idx = findIndexByValue(ctx.flatOptions, event.value);
    if (idx >= 0) {
      const opt = getOption(ctx.flatOptions, idx);
      if (opt && opt.disabled) return ctx;
    }
    if (event.value === ctx.selectedValue) {
      // Aynı değer seçilmiş — yine de kapat ve aramayı temizle
      return {
        ...ctx,
        isOpen: false,
        interactionState: 'focused',
        highlightedIndex: -1,
        searchValue: '',
        filteredOptions: ctx.flatOptions,
      };
    }
    return {
      ...ctx,
      selectedValue: event.value,
      isOpen: false,
      interactionState: 'focused',
      highlightedIndex: -1,
      searchValue: '',
      filteredOptions: ctx.flatOptions,
    };
  }

  // ── Temizleme ──
  if (event.type === 'CLEAR') {
    if (ctx.selectedValue === undefined && ctx.searchValue === '') return ctx;
    return {
      ...ctx,
      selectedValue: undefined,
      searchValue: '',
      filteredOptions: ctx.flatOptions,
    };
  }

  // ── Highlight (filteredOptions içinde) ──
  if (event.type === 'HIGHLIGHT') {
    if (!ctx.isOpen) return ctx;
    if (event.index === ctx.highlightedIndex) return ctx;
    if (event.index >= 0 && event.index < ctx.filteredOptions.length) {
      const opt = getOption(ctx.filteredOptions, event.index);
      if (opt && opt.disabled) return ctx;
    }
    return { ...ctx, highlightedIndex: event.index };
  }

  if (event.type === 'HIGHLIGHT_NEXT') {
    if (!ctx.isOpen) return ctx;
    const next = findEnabledIndex(ctx.filteredOptions, ctx.highlightedIndex, 'forward');
    if (next < 0 || next === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: next };
  }

  if (event.type === 'HIGHLIGHT_PREV') {
    if (!ctx.isOpen) return ctx;
    const prev = findEnabledIndex(ctx.filteredOptions, ctx.highlightedIndex, 'backward');
    if (prev < 0 || prev === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: prev };
  }

  if (event.type === 'HIGHLIGHT_FIRST') {
    if (!ctx.isOpen) return ctx;
    const first = findFirstEnabledIndex(ctx.filteredOptions);
    if (first < 0 || first === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: first };
  }

  if (event.type === 'HIGHLIGHT_LAST') {
    if (!ctx.isOpen) return ctx;
    const last = findLastEnabledIndex(ctx.filteredOptions);
    if (last < 0 || last === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: last };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: ComboboxInteractionState = interactionState;

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
        // allowCustomValue: blur'da searchValue'yu value olarak kabul et
        if (ctx.allowCustomValue && ctx.searchValue) {
          return {
            ...ctx,
            selectedValue: ctx.searchValue,
            isOpen: false,
            interactionState: 'idle',
            highlightedIndex: -1,
            searchValue: '',
            filteredOptions: ctx.flatOptions,
          };
        }
        return {
          ...ctx,
          isOpen: false,
          interactionState: 'idle',
          highlightedIndex: -1,
          searchValue: '',
          filteredOptions: ctx.flatOptions,
        };
      }
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getInputProps(ctx: ComboboxMachineContext): ComboboxInputDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'listbox',
    'aria-activedescendant':
      ctx.isOpen && ctx.highlightedIndex >= 0
        ? `cb-option-${ctx.highlightedIndex}`
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

function getListboxProps(): ComboboxListboxDOMProps {
  return {
    role: 'listbox',
    tabIndex: -1,
  };
}

function getOptionProps(
  ctx: ComboboxMachineContext,
  index: number,
): ComboboxOptionDOMProps {
  const opt = getOption(ctx.filteredOptions, index);
  const isSelected = opt ? opt.value === ctx.selectedValue : false;
  const isHighlighted = index === ctx.highlightedIndex;
  const isDisabled = opt ? opt.disabled === true : false;

  return {
    role: 'option',
    'aria-selected': isSelected,
    'aria-disabled': isDisabled ? true : undefined,
    'data-highlighted': isHighlighted ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Combobox API — state machine ve DOM props üreticileri.
 * Combobox API — state machine and DOM props generators.
 */
export interface ComboboxAPI {
  /** Mevcut context / Current context */
  getContext(): ComboboxMachineContext;

  /** Event gönder / Send event */
  send(event: ComboboxEvent): ComboboxMachineContext;

  /** Input DOM attribute'ları / Input DOM attributes */
  getInputProps(): ComboboxInputDOMProps;

  /** Listbox DOM attribute'ları / Listbox DOM attributes */
  getListboxProps(): ComboboxListboxDOMProps;

  /** Option DOM attribute'ları / Option DOM attributes */
  getOptionProps(index: number): ComboboxOptionDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili etiket / Selected label */
  getSelectedLabel(): string | undefined;

  /** Dropdown açık mı / Is dropdown open */
  isOpen(): boolean;
}

/**
 * Combobox state machine oluştur.
 * Create a combobox state machine.
 *
 * @example
 * ```ts
 * const cb = createCombobox({
 *   options: [
 *     { value: 'tr', label: 'Türkiye' },
 *     { value: 'us', label: 'ABD' },
 *     { value: 'de', label: 'Almanya' },
 *   ],
 *   placeholder: 'Ülke arayın',
 * });
 *
 * cb.send({ type: 'SET_SEARCH', value: 'tür' });
 * cb.getContext().filteredOptions; // [{ value: 'tr', label: 'Türkiye' }]
 * ```
 */
export function createCombobox(props: ComboboxProps): ComboboxAPI {
  const filterFn = props.filterFn ?? defaultFilterFn;
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: ComboboxEvent) {
      ctx = transition(ctx, event, filterFn);
      return ctx;
    },

    getInputProps() {
      return getInputProps(ctx);
    },

    getListboxProps() {
      return getListboxProps();
    },

    getOptionProps(index: number) {
      return getOptionProps(ctx, index);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getSelectedLabel() {
      if (ctx.selectedValue === undefined) return undefined;
      return findLabelByValue(ctx.flatOptions, ctx.selectedValue) ?? String(ctx.selectedValue);
    },

    isOpen() {
      return ctx.isOpen;
    },
  };
}
