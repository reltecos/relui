/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Combobox bileşeni tip tanımları.
 * Combobox component type definitions.
 *
 * Select tiplerini yeniden kullanır, arama/filtreleme için genişletir.
 * Reuses Select types, extends for search/filtering.
 *
 * @packageDocumentation
 */

import type {
  SelectVariant,
  SelectSize,
  SelectInteractionState,
  SelectValue,
  SelectOption,
  SelectOptionGroup,
  SelectOptionOrGroup,
  SelectListboxDOMProps,
  SelectOptionDOMProps,
} from '../select/select.types';

// Re-export ortak tipler
export type {
  SelectVariant as ComboboxVariant,
  SelectSize as ComboboxSize,
  SelectValue,
  SelectOption,
  SelectOptionGroup,
  SelectOptionOrGroup,
};

/** Combobox etkileşim durumu / Combobox interaction state */
export type ComboboxInteractionState = SelectInteractionState;

/** Filtre fonksiyonu / Filter function */
export type ComboboxFilterFn = (option: SelectOption, searchValue: string) => boolean;

// ── Props ───────────────────────────────────────────────────────────

/**
 * Combobox bileşeni props'ları.
 * Combobox component props.
 */
export interface ComboboxProps {
  /** Seçenekler / Options */
  options: SelectOptionOrGroup[];

  /** Seçili değer / Selected value */
  value?: SelectValue;

  /** Varsayılan değer (uncontrolled) / Default value */
  defaultValue?: SelectValue;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly?: boolean;

  /** Geçersiz mi / Is invalid */
  invalid?: boolean;

  /** Zorunlu mu / Is required */
  required?: boolean;

  /** Özel filtre fonksiyonu / Custom filter function */
  filterFn?: ComboboxFilterFn;

  /** Listede olmayan değer girilebilir mi / Allow custom value not in list */
  allowCustomValue?: boolean;
}

// ── Machine Context ─────────────────────────────────────────────────

/**
 * Combobox state machine context'i.
 * Combobox state machine context.
 */
export interface ComboboxMachineContext {
  /** Etkileşim durumu / Interaction state */
  interactionState: ComboboxInteractionState;

  /** Tüm seçenekler (grup dahil) / All options (including groups) */
  options: SelectOptionOrGroup[];

  /** Düzleştirilmiş seçenek listesi / Flattened option list */
  flatOptions: SelectOption[];

  /** Filtrelenmiş seçenek listesi / Filtered option list */
  filteredOptions: SelectOption[];

  /** Seçili değer / Selected value */
  selectedValue: SelectValue | undefined;

  /** Arama değeri / Search value */
  searchValue: string;

  /** Highlight edilen seçenek indeksi (filteredOptions içinde) / Highlighted option index (in filteredOptions) */
  highlightedIndex: number;

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /** Placeholder / Placeholder */
  placeholder: string;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;

  /** Listede olmayan değer girilebilir mi / Allow custom value not in list */
  allowCustomValue: boolean;
}

// ── Events ──────────────────────────────────────────────────────────

/**
 * Combobox state machine event'leri.
 * Combobox state machine events.
 */
export type ComboboxEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT'; value: SelectValue }
  | { type: 'CLEAR' }
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'HIGHLIGHT'; index: number }
  | { type: 'HIGHLIGHT_FIRST' }
  | { type: 'HIGHLIGHT_LAST' }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean }
  | { type: 'SET_OPTIONS'; options: SelectOptionOrGroup[] }
  | { type: 'SET_VALUE'; value: SelectValue | undefined };

// ── DOM Props ───────────────────────────────────────────────────────

/**
 * Combobox input DOM attribute'ları.
 * Combobox input DOM attributes.
 */
export interface ComboboxInputDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-activedescendant'?: string;
  'aria-disabled'?: true;
  'aria-readonly'?: true;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'aria-autocomplete': 'list';
  'data-state': ComboboxInteractionState;
  'data-disabled'?: '';
  'data-readonly'?: '';
  'data-invalid'?: '';
  autoComplete: 'off';
}

/** Re-export listbox ve option DOM props */
export type ComboboxListboxDOMProps = SelectListboxDOMProps;
export type ComboboxOptionDOMProps = SelectOptionDOMProps;
