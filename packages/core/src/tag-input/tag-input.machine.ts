/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TagInput state machine — framework-agnostic headless tag input logic.
 * TagInput state machine — framework bağımsız headless tag input mantığı.
 *
 * Combobox + MultiSelect birleşimi: aranabilir çoklu seçim.
 * Select helper'larını (flattenOptions, findIndexByValue, findLabelByValue) reuse eder.
 *
 * @packageDocumentation
 */

import type {
  TagInputProps,
  TagInputMachineContext,
  TagInputEvent,
  TagInputInputDOMProps,
  TagInputListboxDOMProps,
  TagInputOptionDOMProps,
  TagInputInteractionState,
  TagInputFilterFn,
} from './tag-input.types';
import type { SelectOption } from '../select/select.types';
import { flattenOptions, findLabelByValue } from '../select/select.machine';

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

const defaultFilterFn: TagInputFilterFn = (option, searchValue) => {
  if (!searchValue) return true;
  return option.label.toLowerCase().includes(searchValue.toLowerCase());
};

// ── Filtreleme / Filtering ──────────────────────────────────────────

function computeFilteredOptions(
  flatOptions: SelectOption[],
  searchValue: string,
  selectedValues: string[],
  filterFn: TagInputFilterFn,
): SelectOption[] {
  const selectedSet = new Set(selectedValues);
  return flatOptions.filter(
    (opt) => !selectedSet.has(String(opt.value)) && filterFn(opt, searchValue),
  );
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: TagInputProps): TagInputMachineContext {
  const flatOpts = flattenOptions(props.options);
  const selectedValues = props.value ?? props.defaultValue ?? [];

  return {
    interactionState: 'idle',
    options: props.options,
    flatOptions: flatOpts,
    filteredOptions: computeFilteredOptions(flatOpts, '', selectedValues, props.filterFn ?? defaultFilterFn),
    selectedValues,
    searchValue: '',
    isOpen: false,
    highlightedIndex: -1,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    maxTags: props.maxTags ?? Infinity,
    allowCustomValue: props.allowCustomValue ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: TagInputMachineContext,
  event: TagInputEvent,
  filterFn: TagInputFilterFn,
): TagInputMachineContext {
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
    const flatOpts = flattenOptions(event.options);
    const filteredOptions = computeFilteredOptions(flatOpts, ctx.searchValue, ctx.selectedValues, filterFn);
    return { ...ctx, options: event.options, flatOptions: flatOpts, filteredOptions };
  }

  if (event.type === 'SET_VALUE') {
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, ctx.searchValue, event.value, filterFn);
    return { ...ctx, selectedValues: event.value, filteredOptions };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Arama ──
  if (event.type === 'SET_SEARCH') {
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, event.value, ctx.selectedValues, filterFn);
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

  // ── Değer ekleme ──
  if (event.type === 'ADD_VALUE') {
    if (ctx.readOnly) return ctx;
    if (ctx.selectedValues.length >= ctx.maxTags) return ctx;
    if (ctx.selectedValues.includes(event.value)) return ctx;

    // Option'lardan gelen değerlerde disabled kontrolü
    if (!ctx.allowCustomValue || ctx.flatOptions.some((o) => String(o.value) === event.value)) {
      const opt = ctx.flatOptions.find((o) => String(o.value) === event.value);
      if (opt && opt.disabled) return ctx;
      if (!opt && !ctx.allowCustomValue) return ctx;
    }

    const newSelected = [...ctx.selectedValues, event.value];
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, '', newSelected, filterFn);
    return {
      ...ctx,
      selectedValues: newSelected,
      searchValue: '',
      filteredOptions,
      highlightedIndex: filteredOptions.length > 0 ? findFirstEnabledIndex(filteredOptions) : -1,
      isOpen: filteredOptions.length > 0,
      interactionState: filteredOptions.length > 0 ? 'open' : 'focused',
    };
  }

  // ── Değer kaldırma ──
  if (event.type === 'REMOVE_VALUE') {
    if (ctx.readOnly) return ctx;
    const idx = ctx.selectedValues.indexOf(event.value);
    if (idx < 0) return ctx;
    const newSelected = ctx.selectedValues.filter((v) => v !== event.value);
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, ctx.searchValue, newSelected, filterFn);
    return {
      ...ctx,
      selectedValues: newSelected,
      filteredOptions,
      highlightedIndex: filteredOptions.length > 0 ? findFirstEnabledIndex(filteredOptions) : -1,
    };
  }

  // ── Son tag'i kaldır (Backspace) ──
  if (event.type === 'REMOVE_LAST') {
    if (ctx.readOnly) return ctx;
    if (ctx.searchValue !== '') return ctx;
    if (ctx.selectedValues.length === 0) return ctx;
    const newSelected = ctx.selectedValues.slice(0, -1);
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, ctx.searchValue, newSelected, filterFn);
    return {
      ...ctx,
      selectedValues: newSelected,
      filteredOptions,
      highlightedIndex: filteredOptions.length > 0 ? findFirstEnabledIndex(filteredOptions) : -1,
    };
  }

  // ── Tüm seçimleri temizle ──
  if (event.type === 'CLEAR_ALL') {
    if (ctx.readOnly) return ctx;
    if (ctx.selectedValues.length === 0 && ctx.searchValue === '') return ctx;
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, '', [], filterFn);
    return {
      ...ctx,
      selectedValues: [],
      searchValue: '',
      filteredOptions,
      highlightedIndex: -1,
    };
  }

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    const filteredOptions = computeFilteredOptions(ctx.flatOptions, ctx.searchValue, ctx.selectedValues, filterFn);
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
      filteredOptions: computeFilteredOptions(ctx.flatOptions, '', ctx.selectedValues, filterFn),
    };
  }

  // ── Highlight ──
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
  let nextState: TagInputInteractionState = interactionState;

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
        const filteredOptions = computeFilteredOptions(ctx.flatOptions, '', ctx.selectedValues, filterFn);
        return {
          ...ctx,
          isOpen: false,
          interactionState: 'idle',
          highlightedIndex: -1,
          searchValue: '',
          filteredOptions,
        };
      }
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getInputProps(ctx: TagInputMachineContext): TagInputInputDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'listbox',
    'aria-activedescendant':
      ctx.isOpen && ctx.highlightedIndex >= 0
        ? `ti-option-${ctx.highlightedIndex}`
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

function getListboxProps(): TagInputListboxDOMProps {
  return {
    role: 'listbox',
    'aria-multiselectable': true,
    tabIndex: -1,
  };
}

function getOptionProps(
  ctx: TagInputMachineContext,
  index: number,
): TagInputOptionDOMProps {
  const opt = getOption(ctx.filteredOptions, index);
  const isHighlighted = index === ctx.highlightedIndex;
  const isDisabled = opt ? opt.disabled === true : false;

  return {
    role: 'option',
    'aria-selected': false,
    'aria-disabled': isDisabled ? true : undefined,
    'data-highlighted': isHighlighted ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * TagInput API — state machine ve DOM props üreticileri.
 */
export interface TagInputAPI {
  /** Mevcut context / Current context */
  getContext(): TagInputMachineContext;

  /** Event gönder / Send event */
  send(event: TagInputEvent): TagInputMachineContext;

  /** Input DOM attribute'ları / Input DOM attributes */
  getInputProps(): TagInputInputDOMProps;

  /** Listbox DOM attribute'ları / Listbox DOM attributes */
  getListboxProps(): TagInputListboxDOMProps;

  /** Option DOM attribute'ları / Option DOM attributes */
  getOptionProps(index: number): TagInputOptionDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili etiketler / Selected labels */
  getSelectedLabels(): string[];
}

/**
 * TagInput state machine oluştur.
 * Create a tag input state machine.
 *
 * @example
 * ```ts
 * const ti = createTagInput({
 *   options: [
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue' },
 *     { value: 'svelte', label: 'Svelte' },
 *   ],
 *   maxTags: 3,
 * });
 *
 * ti.send({ type: 'ADD_VALUE', value: 'react' });
 * ti.getContext().selectedValues; // ['react']
 * ```
 */
export function createTagInput(props: TagInputProps): TagInputAPI {
  const filterFn = props.filterFn ?? defaultFilterFn;
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: TagInputEvent) {
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

    getSelectedLabels() {
      return ctx.selectedValues.map((val) => {
        const label = findLabelByValue(ctx.flatOptions, val);
        return label ?? val;
      });
    },
  };
}
