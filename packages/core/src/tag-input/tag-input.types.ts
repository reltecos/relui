/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TagInput type definitions — framework-agnostic.
 * TagInput tip tanımları — framework bağımsız.
 *
 * Combobox + MultiSelect birleşimi: aranabilir, çoklu seçimli tag girişi.
 *
 * @packageDocumentation
 */

import type { SelectOption, SelectOptionOrGroup, SelectVariant, SelectSize } from '../select/select.types';

/**
 * TagInput variant — Select ile aynı.
 */
export type TagInputVariant = SelectVariant;

/**
 * TagInput boyutu — Select ile aynı.
 */
export type TagInputSize = SelectSize;

/**
 * TagInput filtre fonksiyonu.
 */
export type TagInputFilterFn = (option: SelectOption, searchValue: string) => boolean;

/**
 * TagInput etkileşim durumu / Interaction state.
 */
export type TagInputInteractionState = 'idle' | 'hover' | 'focused' | 'open';

/**
 * Core TagInput props — framework-agnostic yapılandırma.
 */
export interface TagInputProps {
  /** Seçenekler / Options */
  options: SelectOptionOrGroup[];

  /** Seçili değerler (controlled) / Selected values (controlled) */
  value?: string[];

  /** Varsayılan seçili değerler (uncontrolled) / Default selected values */
  defaultValue?: string[];

  /** Placeholder */
  placeholder?: string;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** Maksimum tag sayısı / Maximum number of tags */
  maxTags?: number;

  /** Serbest metin girişi / Allow custom values not in options */
  allowCustomValue?: boolean;

  /** Arama filtre fonksiyonu / Search filter function */
  filterFn?: TagInputFilterFn;
}

/**
 * TagInput machine context — iç durum.
 */
export interface TagInputMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: TagInputInteractionState;

  /** Seçenekler (orijinal) / Original options */
  options: SelectOptionOrGroup[];

  /** Düzleştirilmiş seçenekler / Flattened options */
  flatOptions: SelectOption[];

  /** Filtrelenmiş seçenekler / Filtered options (search + already selected removed) */
  filteredOptions: SelectOption[];

  /** Seçili değerler / Selected values */
  selectedValues: string[];

  /** Arama değeri / Search value */
  searchValue: string;

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /** Highlight indeksi (filteredOptions içinde) / Highlight index */
  highlightedIndex: number;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;

  /** Maksimum tag sayısı / Maximum tag count */
  maxTags: number;

  /** Serbest metin izni / Allow custom values */
  allowCustomValue: boolean;
}

/**
 * State machine event'leri.
 */
export type TagInputEvent =
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'ADD_VALUE'; value: string }
  | { type: 'REMOVE_VALUE'; value: string }
  | { type: 'REMOVE_LAST' }
  | { type: 'CLEAR_ALL' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'HIGHLIGHT'; index: number }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'HIGHLIGHT_FIRST' }
  | { type: 'HIGHLIGHT_LAST' }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean }
  | { type: 'SET_VALUE'; value: string[] }
  | { type: 'SET_OPTIONS'; options: SelectOptionOrGroup[] };

/**
 * Input DOM attribute'ları.
 */
export interface TagInputInputDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-activedescendant': string | undefined;
  'aria-disabled': true | undefined;
  'aria-readonly': true | undefined;
  'aria-invalid': true | undefined;
  'aria-required': true | undefined;
  'aria-autocomplete': 'list';
  'data-state': string;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
  autoComplete: 'off';
}

/**
 * Listbox DOM attribute'ları.
 */
export interface TagInputListboxDOMProps {
  role: 'listbox';
  'aria-multiselectable': true;
  tabIndex: -1;
}

/**
 * Option DOM attribute'ları.
 */
export interface TagInputOptionDOMProps {
  role: 'option';
  'aria-selected': boolean;
  'aria-disabled': true | undefined;
  'data-highlighted': '' | undefined;
  'data-disabled': '' | undefined;
}
