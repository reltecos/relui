/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiSelect bileşeni tip tanımları.
 * MultiSelect component type definitions.
 *
 * Select tiplerini yeniden kullanır, çoklu seçim için genişletir.
 * Reuses Select types, extends for multi-selection.
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
  SelectVariant as MultiSelectVariant,
  SelectSize as MultiSelectSize,
  SelectValue,
  SelectOption,
  SelectOptionGroup,
  SelectOptionOrGroup,
};

/** MultiSelect etkileşim durumu / MultiSelect interaction state */
export type MultiSelectInteractionState = SelectInteractionState;

// ── Props ───────────────────────────────────────────────────────────

/**
 * MultiSelect bileşeni props'ları.
 * MultiSelect component props.
 */
export interface MultiSelectProps {
  /** Seçenekler / Options */
  options: SelectOptionOrGroup[];

  /** Seçili değerler / Selected values */
  value?: SelectValue[];

  /** Varsayılan değerler (uncontrolled) / Default values */
  defaultValue?: SelectValue[];

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

  /** Maksimum seçim sayısı / Maximum selection count */
  maxSelections?: number;
}

// ── Machine Context ─────────────────────────────────────────────────

/**
 * MultiSelect state machine context'i.
 * MultiSelect state machine context.
 */
export interface MultiSelectMachineContext {
  /** Etkileşim durumu / Interaction state */
  interactionState: MultiSelectInteractionState;

  /** Tüm seçenekler (grup dahil) / All options (including groups) */
  options: SelectOptionOrGroup[];

  /** Düzleştirilmiş seçenek listesi / Flattened option list */
  flatOptions: SelectOption[];

  /** Seçili değerler / Selected values */
  selectedValues: SelectValue[];

  /** Highlight edilen seçenek indeksi / Highlighted option index */
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

  /** Maksimum seçim sayısı / Maximum selection count */
  maxSelections: number;
}

// ── Events ──────────────────────────────────────────────────────────

/**
 * MultiSelect state machine event'leri.
 * MultiSelect state machine events.
 */
export type MultiSelectEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'TOGGLE_OPTION'; value: SelectValue }
  | { type: 'SELECT'; value: SelectValue }
  | { type: 'DESELECT'; value: SelectValue }
  | { type: 'SELECT_ALL' }
  | { type: 'CLEAR_ALL' }
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
  | { type: 'SET_VALUES'; values: SelectValue[] };

// ── DOM Props ───────────────────────────────────────────────────────

/**
 * MultiSelect trigger DOM attribute'ları.
 * MultiSelect trigger DOM attributes.
 */
export interface MultiSelectTriggerDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-activedescendant'?: string;
  'aria-disabled'?: true;
  'aria-readonly'?: true;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'aria-multiselectable': true;
  'data-state': MultiSelectInteractionState;
  'data-disabled'?: '';
  'data-readonly'?: '';
  'data-invalid'?: '';
  tabIndex: 0;
}

/** Re-export listbox ve option DOM props */
export type MultiSelectListboxDOMProps = SelectListboxDOMProps;
export type MultiSelectOptionDOMProps = SelectOptionDOMProps;
