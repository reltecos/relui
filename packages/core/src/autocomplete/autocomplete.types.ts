/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Autocomplete tipleri.
 * Autocomplete types.
 *
 * @packageDocumentation
 */

// ── Types ────────────────────────────────────────────

/** Autocomplete secenegi / Autocomplete option */
export interface AutocompleteOption {
  /** Benzersiz deger / Unique value */
  readonly value: string;
  /** Gorunen etiket / Display label */
  readonly label: string;
  /** Grup ismi / Group name */
  readonly group?: string;
  /** Devre disi mi / Is disabled */
  readonly disabled?: boolean;
}

/** Filtreleme fonksiyonu / Filter function */
export type AutocompleteFilterFn = (option: AutocompleteOption, query: string) => boolean;

// ── Events ───────────────────────────────────────────

/** Autocomplete event'leri / Autocomplete events */
export type AutocompleteEvent =
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SELECT'; value: string }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_OPTIONS'; options: AutocompleteOption[] }
  | { type: 'CLEAR' };

// ── Context ──────────────────────────────────────────

/** Autocomplete state / Autocomplete context */
export interface AutocompleteContext {
  /** Arama metni / Search query */
  readonly query: string;
  /** Secili deger / Selected value */
  readonly selectedValue: string;
  /** Secili etiket / Selected label */
  readonly selectedLabel: string;
  /** Vurgulanan index / Highlighted index */
  readonly highlightedIndex: number;
  /** Acik mi / Is open */
  readonly isOpen: boolean;
  /** Filtrelenmis secenekler / Filtered options */
  readonly filteredOptions: readonly AutocompleteOption[];
  /** Tum secenekler / All options */
  readonly options: readonly AutocompleteOption[];
}

// ── Config ───────────────────────────────────────────

/** Autocomplete yapilandirmasi / Autocomplete configuration */
export interface AutocompleteConfig {
  /** Secenek listesi / Option list */
  options?: AutocompleteOption[];
  /** Varsayilan deger / Default value */
  defaultValue?: string;
  /** Filtreleme fonksiyonu / Filter function */
  filterFn?: AutocompleteFilterFn;
  /** Secim degisince callback / On selection change callback */
  onChange?: (value: string, label: string) => void;
  /** Arama degisince callback / On query change callback */
  onQueryChange?: (query: string) => void;
}

// ── API ──────────────────────────────────────────────

/** Autocomplete API / Autocomplete API */
export interface AutocompleteAPI {
  /** Guncel context / Get current context */
  getContext(): AutocompleteContext;
  /** Event gonder / Send event */
  send(event: AutocompleteEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
