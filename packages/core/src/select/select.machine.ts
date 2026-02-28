/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Select state machine — framework-agnostic headless select logic.
 * Select state machine — framework bağımsız headless select mantığı.
 *
 * Dropdown açma/kapama, seçenek yönetimi, klavye navigasyonu.
 * Dropdown open/close, option management, keyboard navigation.
 *
 * @packageDocumentation
 */

import type {
  SelectProps,
  SelectMachineContext,
  SelectEvent,
  SelectTriggerDOMProps,
  SelectListboxDOMProps,
  SelectOptionDOMProps,
  SelectOption,
  SelectOptionOrGroup,
  SelectValue,
  SelectInteractionState,
} from './select.types';
import { isOptionGroup } from './select.types';

// ── Yardımcı — Düzleştirme / Flatten helper ────────────────────────

/**
 * Seçenek listesini düzleştir (grupları aç).
 * Flatten option list (expand groups).
 */
export function flattenOptions(options: SelectOptionOrGroup[]): SelectOption[] {
  const flat: SelectOption[] = [];
  for (const item of options) {
    if (isOptionGroup(item)) {
      for (const opt of item.options) {
        flat.push(opt);
      }
    } else {
      flat.push(item);
    }
  }
  return flat;
}

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getOption(options: SelectOption[], index: number): SelectOption | undefined {
  return options[index];
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

/**
 * Verilen yönde bir sonraki disabled olmayan seçenek indeksini bul.
 * Find next non-disabled option index in given direction.
 */
function findEnabledIndex(
  flatOptions: SelectOption[],
  startIndex: number,
  direction: 'forward' | 'backward',
  wrap: boolean = true,
): number {
  const len = flatOptions.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    if (wrap) {
      index = ((index % len) + len) % len;
    } else {
      if (index < 0 || index >= len) return -1;
    }

    const opt = getOption(flatOptions, index);
    if (opt && !opt.disabled) {
      return index;
    }
  }

  return -1;
}

/**
 * İlk disabled olmayan seçenek indeksini bul.
 * Find first non-disabled option index.
 */
function findFirstEnabledIndex(flatOptions: SelectOption[]): number {
  for (let i = 0; i < flatOptions.length; i++) {
    const opt = getOption(flatOptions, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

/**
 * Son disabled olmayan seçenek indeksini bul.
 * Find last non-disabled option index.
 */
function findLastEnabledIndex(flatOptions: SelectOption[]): number {
  for (let i = flatOptions.length - 1; i >= 0; i--) {
    const opt = getOption(flatOptions, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

/**
 * Değere göre flatOptions'daki indeksi bul.
 * Find index in flatOptions by value.
 */
export function findIndexByValue(
  flatOptions: SelectOption[],
  value: SelectValue | undefined,
): number {
  if (value === undefined) return -1;
  for (let i = 0; i < flatOptions.length; i++) {
    const opt = getOption(flatOptions, i);
    if (opt && opt.value === value) return i;
  }
  return -1;
}

/**
 * Değere göre seçenek etiketini bul.
 * Find option label by value.
 */
export function findLabelByValue(
  flatOptions: SelectOption[],
  value: SelectValue | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  for (const opt of flatOptions) {
    if (opt.value === value) return opt.label;
  }
  return undefined;
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: SelectProps): SelectMachineContext {
  const flatOptions = flattenOptions(props.options);
  const selectedValue = props.value ?? props.defaultValue;

  return {
    interactionState: 'idle',
    options: props.options,
    flatOptions,
    selectedValue,
    highlightedIndex: -1,
    isOpen: false,
    placeholder: props.placeholder ?? '',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: SelectMachineContext,
  event: SelectEvent,
): SelectMachineContext {
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

  if (event.type === 'SET_VALUE') {
    if (event.value === ctx.selectedValue) return ctx;
    return { ...ctx, selectedValue: event.value };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    // Açılırken seçili öğeyi highlight et
    const hlIndex = findIndexByValue(ctx.flatOptions, ctx.selectedValue);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      highlightedIndex: hlIndex >= 0 ? hlIndex : findFirstEnabledIndex(ctx.flatOptions),
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
    const hlIndex = findIndexByValue(ctx.flatOptions, ctx.selectedValue);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      highlightedIndex: hlIndex >= 0 ? hlIndex : findFirstEnabledIndex(ctx.flatOptions),
    };
  }

  // ── Seçim ──
  if (event.type === 'SELECT') {
    // Disabled seçenek seçilemez
    const idx = findIndexByValue(ctx.flatOptions, event.value);
    if (idx >= 0) {
      const opt = getOption(ctx.flatOptions, idx);
      if (opt && opt.disabled) return ctx;
    }
    return {
      ...ctx,
      selectedValue: event.value,
      isOpen: false,
      interactionState: 'focused',
      highlightedIndex: -1,
    };
  }

  // ── Highlight ──
  if (event.type === 'HIGHLIGHT') {
    if (!ctx.isOpen) return ctx;
    if (event.index === ctx.highlightedIndex) return ctx;
    // Disabled seçenek highlight edilemez
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
  let nextState: SelectInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') {
        nextState = 'hover';
      }
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') {
        nextState = 'idle';
      }
      break;

    case 'FOCUS':
      if (!ctx.isOpen) {
        nextState = 'focused';
      }
      break;

    case 'BLUR':
      if (ctx.isOpen) {
        // Blur olunca dropdown kapat
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

function getTriggerProps(ctx: SelectMachineContext): SelectTriggerDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'listbox',
    'aria-activedescendant':
      ctx.isOpen && ctx.highlightedIndex >= 0
        ? `option-${ctx.highlightedIndex}`
        : undefined,
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    tabIndex: 0,
  };
}

function getListboxProps(): SelectListboxDOMProps {
  return {
    role: 'listbox',
    tabIndex: -1,
  };
}

function getOptionProps(
  ctx: SelectMachineContext,
  index: number,
): SelectOptionDOMProps {
  const opt = getOption(ctx.flatOptions, index);
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
 * Select API — state machine ve DOM props üreticileri.
 * Select API — state machine and DOM props generators.
 */
export interface SelectAPI {
  /** Mevcut context / Current context */
  getContext(): SelectMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: SelectEvent): SelectMachineContext;

  /** Trigger (button) DOM attribute'ları / Trigger DOM attributes */
  getTriggerProps(): SelectTriggerDOMProps;

  /** Listbox DOM attribute'ları / Listbox DOM attributes */
  getListboxProps(): SelectListboxDOMProps;

  /** Option DOM attribute'ları / Option DOM attributes */
  getOptionProps(index: number): SelectOptionDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili seçenek etiketi / Selected option label */
  getSelectedLabel(): string | undefined;

  /** Dropdown açık mı / Is dropdown open */
  isOpen(): boolean;
}

/**
 * Select state machine oluştur.
 * Create a select state machine.
 *
 * @example
 * ```ts
 * const select = createSelect({
 *   options: [
 *     { value: 'tr', label: 'Türkiye' },
 *     { value: 'us', label: 'ABD' },
 *     { value: 'de', label: 'Almanya' },
 *   ],
 *   placeholder: 'Ülke seçin',
 * });
 *
 * select.send({ type: 'OPEN' });
 * select.send({ type: 'SELECT', value: 'tr' });
 * select.getSelectedLabel(); // 'Türkiye'
 * ```
 */
export function createSelect(props: SelectProps): SelectAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: SelectEvent) {
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

    getSelectedLabel() {
      return findLabelByValue(ctx.flatOptions, ctx.selectedValue);
    },

    isOpen() {
      return ctx.isOpen;
    },
  };
}
