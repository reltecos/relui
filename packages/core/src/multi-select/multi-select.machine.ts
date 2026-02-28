/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiSelect state machine — framework-agnostic headless multi-select logic.
 * MultiSelect state machine — framework bağımsız headless çoklu seçim mantığı.
 *
 * Select machine'inden ilham alır, çoklu seçim ve toggle mantığı ekler.
 *
 * @packageDocumentation
 */

import type {
  MultiSelectProps,
  MultiSelectMachineContext,
  MultiSelectEvent,
  MultiSelectTriggerDOMProps,
  MultiSelectListboxDOMProps,
  MultiSelectOptionDOMProps,
  MultiSelectInteractionState,
  SelectValue,
  SelectOption,
} from './multi-select.types';
import { flattenOptions, findIndexByValue } from '../select/select.machine';

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getOption(options: SelectOption[], index: number): SelectOption | undefined {
  return options[index];
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

function findEnabledIndex(
  flatOptions: SelectOption[],
  startIndex: number,
  direction: 'forward' | 'backward',
): number {
  const len = flatOptions.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    index = ((index % len) + len) % len;

    const opt = getOption(flatOptions, index);
    if (opt && !opt.disabled) {
      return index;
    }
  }

  return -1;
}

function findFirstEnabledIndex(flatOptions: SelectOption[]): number {
  for (let i = 0; i < flatOptions.length; i++) {
    const opt = getOption(flatOptions, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

function findLastEnabledIndex(flatOptions: SelectOption[]): number {
  for (let i = flatOptions.length - 1; i >= 0; i--) {
    const opt = getOption(flatOptions, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

// ── Yardımcı — Değer listesi işlemleri ──────────────────────────────

function hasValue(values: SelectValue[], value: SelectValue): boolean {
  return values.indexOf(value) >= 0;
}

function addValue(values: SelectValue[], value: SelectValue): SelectValue[] {
  if (hasValue(values, value)) return values;
  return [...values, value];
}

function removeValue(values: SelectValue[], value: SelectValue): SelectValue[] {
  return values.filter((v) => v !== value);
}

function toggleValue(values: SelectValue[], value: SelectValue): SelectValue[] {
  return hasValue(values, value) ? removeValue(values, value) : addValue(values, value);
}

// ── Etiket yardımcıları / Label helpers ─────────────────────────────

/**
 * Seçili değerlerin etiketlerini döndür.
 * Return labels of selected values.
 */
export function getSelectedLabels(
  flatOptions: SelectOption[],
  selectedValues: SelectValue[],
): string[] {
  const labels: string[] = [];
  for (const val of selectedValues) {
    for (const opt of flatOptions) {
      if (opt.value === val) {
        labels.push(opt.label);
        break;
      }
    }
  }
  return labels;
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: MultiSelectProps): MultiSelectMachineContext {
  const flatOptions = flattenOptions(props.options);
  const selectedValues = props.value ?? props.defaultValue ?? [];

  return {
    interactionState: 'idle',
    options: props.options,
    flatOptions,
    selectedValues,
    highlightedIndex: -1,
    isOpen: false,
    placeholder: props.placeholder ?? '',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    maxSelections: props.maxSelections ?? Infinity,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: MultiSelectMachineContext,
  event: MultiSelectEvent,
): MultiSelectMachineContext {
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
    return { ...ctx, options: event.options, flatOptions };
  }

  if (event.type === 'SET_VALUES') {
    if (
      event.values.length === ctx.selectedValues.length &&
      event.values.every((v, i) => ctx.selectedValues[i] === v)
    ) {
      return ctx;
    }
    return { ...ctx, selectedValues: event.values };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      highlightedIndex: findFirstEnabledIndex(ctx.flatOptions),
    };
  }

  if (event.type === 'CLOSE') {
    if (!ctx.isOpen) return ctx;
    return {
      ...ctx,
      isOpen: false,
      interactionState: 'focused',
      highlightedIndex: -1,
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
      };
    }
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      highlightedIndex: findFirstEnabledIndex(ctx.flatOptions),
    };
  }

  // ── Seçim toggle — dropdown KAPANMAZ ──
  if (event.type === 'TOGGLE_OPTION') {
    const idx = findIndexByValue(ctx.flatOptions, event.value);
    if (idx >= 0) {
      const opt = getOption(ctx.flatOptions, idx);
      if (opt && opt.disabled) return ctx;
    }

    const isSelected = hasValue(ctx.selectedValues, event.value);
    if (!isSelected && ctx.selectedValues.length >= ctx.maxSelections) {
      return ctx;
    }

    return { ...ctx, selectedValues: toggleValue(ctx.selectedValues, event.value) };
  }

  // ── Açık ekleme ──
  if (event.type === 'SELECT') {
    const idx = findIndexByValue(ctx.flatOptions, event.value);
    if (idx >= 0) {
      const opt = getOption(ctx.flatOptions, idx);
      if (opt && opt.disabled) return ctx;
    }
    if (hasValue(ctx.selectedValues, event.value)) return ctx;
    if (ctx.selectedValues.length >= ctx.maxSelections) return ctx;
    return { ...ctx, selectedValues: addValue(ctx.selectedValues, event.value) };
  }

  // ── Açık kaldırma ──
  if (event.type === 'DESELECT') {
    if (!hasValue(ctx.selectedValues, event.value)) return ctx;
    return { ...ctx, selectedValues: removeValue(ctx.selectedValues, event.value) };
  }

  // ── Tümünü seç ──
  if (event.type === 'SELECT_ALL') {
    const all: SelectValue[] = [];
    for (const opt of ctx.flatOptions) {
      if (!opt.disabled && all.length < ctx.maxSelections) {
        all.push(opt.value);
      }
    }
    if (
      all.length === ctx.selectedValues.length &&
      all.every((v, i) => ctx.selectedValues[i] === v)
    ) {
      return ctx;
    }
    return { ...ctx, selectedValues: all };
  }

  // ── Tümünü temizle ──
  if (event.type === 'CLEAR_ALL') {
    if (ctx.selectedValues.length === 0) return ctx;
    return { ...ctx, selectedValues: [] };
  }

  // ── Highlight ──
  if (event.type === 'HIGHLIGHT') {
    if (!ctx.isOpen) return ctx;
    if (event.index === ctx.highlightedIndex) return ctx;
    if (event.index >= 0 && event.index < ctx.flatOptions.length) {
      const opt = getOption(ctx.flatOptions, event.index);
      if (opt && opt.disabled) return ctx;
    }
    return { ...ctx, highlightedIndex: event.index };
  }

  if (event.type === 'HIGHLIGHT_NEXT') {
    if (!ctx.isOpen) return ctx;
    const next = findEnabledIndex(ctx.flatOptions, ctx.highlightedIndex, 'forward');
    if (next < 0 || next === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: next };
  }

  if (event.type === 'HIGHLIGHT_PREV') {
    if (!ctx.isOpen) return ctx;
    const prev = findEnabledIndex(ctx.flatOptions, ctx.highlightedIndex, 'backward');
    if (prev < 0 || prev === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: prev };
  }

  if (event.type === 'HIGHLIGHT_FIRST') {
    if (!ctx.isOpen) return ctx;
    const first = findFirstEnabledIndex(ctx.flatOptions);
    if (first < 0 || first === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: first };
  }

  if (event.type === 'HIGHLIGHT_LAST') {
    if (!ctx.isOpen) return ctx;
    const last = findLastEnabledIndex(ctx.flatOptions);
    if (last < 0 || last === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: last };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: MultiSelectInteractionState = interactionState;

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
        };
      }
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getTriggerProps(ctx: MultiSelectMachineContext): MultiSelectTriggerDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'listbox',
    'aria-activedescendant':
      ctx.isOpen && ctx.highlightedIndex >= 0
        ? `ms-option-${ctx.highlightedIndex}`
        : undefined,
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-multiselectable': true,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    tabIndex: 0,
  };
}

function getListboxProps(): MultiSelectListboxDOMProps {
  return {
    role: 'listbox',
    tabIndex: -1,
  };
}

function getOptionProps(
  ctx: MultiSelectMachineContext,
  index: number,
): MultiSelectOptionDOMProps {
  const opt = getOption(ctx.flatOptions, index);
  const isSelected = opt ? hasValue(ctx.selectedValues, opt.value) : false;
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
 * MultiSelect API — state machine ve DOM props üreticileri.
 * MultiSelect API — state machine and DOM props generators.
 */
export interface MultiSelectAPI {
  /** Mevcut context / Current context */
  getContext(): MultiSelectMachineContext;

  /** Event gönder / Send event */
  send(event: MultiSelectEvent): MultiSelectMachineContext;

  /** Trigger DOM attribute'ları / Trigger DOM attributes */
  getTriggerProps(): MultiSelectTriggerDOMProps;

  /** Listbox DOM attribute'ları / Listbox DOM attributes */
  getListboxProps(): MultiSelectListboxDOMProps;

  /** Option DOM attribute'ları / Option DOM attributes */
  getOptionProps(index: number): MultiSelectOptionDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili etiketler / Selected labels */
  getSelectedLabels(): string[];

  /** Dropdown açık mı / Is dropdown open */
  isOpen(): boolean;

  /** Tüm seçenekler seçili mi / Are all options selected */
  isAllSelected(): boolean;

  /** Seçim sayısı / Selection count */
  getSelectionCount(): number;
}

/**
 * MultiSelect state machine oluştur.
 * Create a multi-select state machine.
 *
 * @example
 * ```ts
 * const ms = createMultiSelect({
 *   options: [
 *     { value: 'tr', label: 'Türkiye' },
 *     { value: 'us', label: 'ABD' },
 *     { value: 'de', label: 'Almanya' },
 *   ],
 *   placeholder: 'Ülke seçin',
 * });
 *
 * ms.send({ type: 'TOGGLE_OPTION', value: 'tr' });
 * ms.send({ type: 'TOGGLE_OPTION', value: 'de' });
 * ms.getSelectedLabels(); // ['Türkiye', 'Almanya']
 * ms.getSelectionCount(); // 2
 * ```
 */
export function createMultiSelect(props: MultiSelectProps): MultiSelectAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: MultiSelectEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getTriggerProps() {
      return getTriggerProps(ctx);
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
      return getSelectedLabels(ctx.flatOptions, ctx.selectedValues);
    },

    isOpen() {
      return ctx.isOpen;
    },

    isAllSelected() {
      const enabledCount = ctx.flatOptions.filter((o) => !o.disabled).length;
      return enabledCount > 0 && ctx.selectedValues.length >= enabledCount;
    },

    getSelectionCount() {
      return ctx.selectedValues.length;
    },
  };
}
