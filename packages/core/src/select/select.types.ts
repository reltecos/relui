/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Select bileşeni tip tanımları.
 * Select component type definitions.
 *
 * @packageDocumentation
 */

// ── Görsel varyantlar / Visual variants ─────────────────────────────

/** Select görsel varyantı / Select visual variant */
export type SelectVariant = 'outline' | 'filled' | 'flushed';

/** Select boyutu / Select size */
export type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Etkileşim durumu / Interaction state ────────────────────────────

/** Select etkileşim durumu / Select interaction state */
export type SelectInteractionState = 'idle' | 'hover' | 'focused' | 'open';

// ── Option / Seçenek tanımı ─────────────────────────────────────────

/** Select seçenek değeri / Select option value */
export type SelectValue = string | number;

/**
 * Select seçenek tanımı.
 * Select option definition.
 */
export interface SelectOption {
  /** Seçenek değeri / Option value */
  value: SelectValue;

  /** Görüntülenen metin / Display label */
  label: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;
}

/**
 * Select seçenek grubu.
 * Select option group.
 */
export interface SelectOptionGroup {
  /** Grup etiketi / Group label */
  label: string;

  /** Gruptaki seçenekler / Options in group */
  options: SelectOption[];
}

/** Seçenek veya grup / Option or group */
export type SelectOptionOrGroup = SelectOption | SelectOptionGroup;

// ── Yardımcı — Grup mu kontrol / Is group check ────────────────────

/**
 * SelectOptionOrGroup'un grup olup olmadığını kontrol et.
 * Check if a SelectOptionOrGroup is a group.
 */
export function isOptionGroup(item: SelectOptionOrGroup): item is SelectOptionGroup {
  return 'options' in item;
}

// ── Props ───────────────────────────────────────────────────────────

/**
 * Select bileşeni props'ları.
 * Select component props.
 */
export interface SelectProps {
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
}

// ── Machine Context ─────────────────────────────────────────────────

/**
 * Select state machine context'i.
 * Select state machine context.
 *
 * Düzleştirilmiş seçenek listesi (`flatOptions`) ile çalışır.
 * Works with flattened option list (`flatOptions`).
 */
export interface SelectMachineContext {
  /** Etkileşim durumu / Interaction state */
  interactionState: SelectInteractionState;

  /** Tüm seçenekler (grup dahil) / All options (including groups) */
  options: SelectOptionOrGroup[];

  /** Düzleştirilmiş seçenek listesi (sadece SelectOption) / Flattened option list */
  flatOptions: SelectOption[];

  /** Seçili değer / Selected value */
  selectedValue: SelectValue | undefined;

  /** Highlight edilen seçenek indeksi (flatOptions'daki) / Highlighted option index */
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
}

// ── Events ──────────────────────────────────────────────────────────

/**
 * Select state machine event'leri.
 * Select state machine events.
 */
export type SelectEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT'; value: SelectValue }
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
 * Select trigger (button) DOM attribute'ları.
 * Select trigger (button) DOM attributes.
 */
export interface SelectTriggerDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-activedescendant'?: string;
  'aria-disabled'?: true;
  'aria-readonly'?: true;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'data-state': SelectInteractionState;
  'data-disabled'?: '';
  'data-readonly'?: '';
  'data-invalid'?: '';
  tabIndex: 0;
}

/**
 * Select listbox DOM attribute'ları.
 * Select listbox DOM attributes.
 */
export interface SelectListboxDOMProps {
  role: 'listbox';
  tabIndex: -1;
}

/**
 * Select option DOM attribute'ları.
 * Select option DOM attributes.
 */
export interface SelectOptionDOMProps {
  role: 'option';
  'aria-selected': boolean;
  'aria-disabled'?: true;
  'data-highlighted'?: '';
  'data-disabled'?: '';
}
