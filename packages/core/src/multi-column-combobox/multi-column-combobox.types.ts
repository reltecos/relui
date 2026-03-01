/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiColumnCombobox bileşeni tip tanımları.
 * MultiColumnCombobox component type definitions.
 *
 * Combobox'ın çok sütunlu versiyonu — dropdown'da tablo gibi birden fazla sütun gösterilir.
 * Multi-column version of Combobox — displays multiple columns in dropdown like a table.
 *
 * @packageDocumentation
 */

import type {
  SelectVariant,
  SelectSize,
  SelectInteractionState,
  SelectValue,
  SelectListboxDOMProps,
} from '../select/select.types';

// Re-export ortak tipler
export type {
  SelectVariant as MCComboboxVariant,
  SelectSize as MCComboboxSize,
  SelectValue,
};

/** MCCombobox etkileşim durumu / MCCombobox interaction state */
export type MCComboboxInteractionState = SelectInteractionState;

// ── Sütun tanımı / Column definition ────────────────────────────────

/**
 * Çok sütunlu combobox sütun tanımı.
 * Multi-column combobox column definition.
 */
export interface MCComboboxColumn {
  /** Sütun anahtarı — item'daki data key / Column key — data key in item */
  key: string;

  /** Sütun başlığı / Column header */
  header: string;

  /** Sütun genişliği (CSS değeri) / Column width (CSS value) */
  width?: string;
}

// ── Item tanımı / Item definition ───────────────────────────────────

/**
 * Çok sütunlu combobox item'ı.
 * Multi-column combobox item.
 */
export interface MCComboboxItem {
  /** Item değeri / Item value */
  value: SelectValue;

  /** Görüntülenen etiket (input'ta gösterilir) / Display label (shown in input) */
  label: string;

  /** Sütun verileri / Column data */
  data: Record<string, string | number>;

  /** Pasif mi / Is disabled */
  disabled?: boolean;
}

/** Filtre fonksiyonu / Filter function */
export type MCComboboxFilterFn = (item: MCComboboxItem, searchValue: string, columns: MCComboboxColumn[]) => boolean;

// ── Props ───────────────────────────────────────────────────────────

/**
 * MultiColumnCombobox bileşeni props'ları.
 * MultiColumnCombobox component props.
 */
export interface MCComboboxProps {
  /** Sütun tanımları / Column definitions */
  columns: MCComboboxColumn[];

  /** Item listesi / Item list */
  items: MCComboboxItem[];

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
  filterFn?: MCComboboxFilterFn;

  /** Sütun başlıklarını göster / Show column headers */
  showHeaders?: boolean;
}

// ── Machine Context ─────────────────────────────────────────────────

/**
 * MultiColumnCombobox state machine context'i.
 * MultiColumnCombobox state machine context.
 */
export interface MCComboboxMachineContext {
  /** Etkileşim durumu / Interaction state */
  interactionState: MCComboboxInteractionState;

  /** Sütun tanımları / Column definitions */
  columns: MCComboboxColumn[];

  /** Tüm item'lar / All items */
  items: MCComboboxItem[];

  /** Filtrelenmiş item listesi / Filtered item list */
  filteredItems: MCComboboxItem[];

  /** Seçili değer / Selected value */
  selectedValue: SelectValue | undefined;

  /** Arama değeri / Search value */
  searchValue: string;

  /** Highlight edilen item indeksi (filteredItems içinde) / Highlighted item index (in filteredItems) */
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

  /** Sütun başlıklarını göster / Show column headers */
  showHeaders: boolean;
}

// ── Events ──────────────────────────────────────────────────────────

/**
 * MultiColumnCombobox state machine event'leri.
 * MultiColumnCombobox state machine events.
 */
export type MCComboboxEvent =
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
  | { type: 'SET_ITEMS'; items: MCComboboxItem[] }
  | { type: 'SET_VALUE'; value: SelectValue | undefined };

// ── DOM Props ───────────────────────────────────────────────────────

/**
 * MultiColumnCombobox input DOM attribute'ları.
 * MultiColumnCombobox input DOM attributes.
 */
export interface MCComboboxInputDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'grid';
  'aria-activedescendant'?: string;
  'aria-disabled'?: true;
  'aria-readonly'?: true;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'aria-autocomplete': 'list';
  'data-state': MCComboboxInteractionState;
  'data-disabled'?: '';
  'data-readonly'?: '';
  'data-invalid'?: '';
  autoComplete: 'off';
}

/**
 * MultiColumnCombobox grid (listbox) DOM attribute'ları.
 * MultiColumnCombobox grid (listbox) DOM attributes.
 */
export interface MCComboboxGridDOMProps {
  role: 'grid';
  'aria-label'?: string;
  tabIndex: -1;
}

/** Re-export listbox props for compat */
export type MCComboboxListboxDOMProps = SelectListboxDOMProps;

/**
 * MultiColumnCombobox row DOM attribute'ları.
 * MultiColumnCombobox row DOM attributes.
 */
export interface MCComboboxRowDOMProps {
  role: 'row';
  'aria-selected': boolean;
  'aria-disabled'?: true;
  'data-highlighted'?: '';
  'data-disabled'?: '';
}
