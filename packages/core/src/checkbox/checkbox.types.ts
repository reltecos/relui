/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checkbox type definitions — framework-agnostic.
 * Checkbox tip tanımları — framework bağımsız.
 *
 * WAI-ARIA Checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 *
 * @packageDocumentation
 */

/**
 * Checkbox boyutu / Checkbox size.
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Checkbox renk şeması / Checkbox color scheme.
 */
export type CheckboxColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Checkbox etkileşim durumu / Checkbox interaction state.
 */
export type CheckboxInteractionState = 'idle' | 'hover' | 'active' | 'focused';

/**
 * Checkbox işaretlenme durumu / Checkbox checked state.
 *
 * - `false` — İşaretlenmemiş / Unchecked
 * - `true` — İşaretlenmiş / Checked
 * - `'indeterminate'` — Belirsiz / Indeterminate (kısmen seçili alt öğeler)
 */
export type CheckboxCheckedState = boolean | 'indeterminate';

/**
 * Core checkbox props — framework-agnostic yapılandırma.
 * Core checkbox props — framework-agnostic configuration.
 */
export interface CheckboxProps {
  /** Boyut / Size */
  size?: CheckboxSize;

  /** Renk şeması / Color scheme */
  color?: CheckboxColor;

  /** İşaretlenme durumu / Checked state */
  checked?: CheckboxCheckedState;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** İsim / Name attribute (form entegrasyonu) */
  name?: string;

  /** Değer / Value attribute (form entegrasyonu) */
  value?: string;
}

/**
 * Checkbox machine context — iç durum.
 * Checkbox machine context — internal state.
 */
export interface CheckboxMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: CheckboxInteractionState;

  /** İşaretlenme durumu / Checked state */
  checked: CheckboxCheckedState;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type CheckboxEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'POINTER_DOWN' }
  | { type: 'POINTER_UP' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'TOGGLE' }
  | { type: 'SET_CHECKED'; value: CheckboxCheckedState }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getCheckboxProps() dönüş tipi — DOM attribute'ları.
 * Return type of getCheckboxProps() — DOM attributes.
 */
export interface CheckboxDOMProps {
  role: 'checkbox';
  tabIndex: 0;
  'aria-checked': boolean | 'mixed';
  'aria-disabled': boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': 'checked' | 'unchecked' | 'indeterminate';
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
  'data-focus': '' | undefined;
  'data-hover': '' | undefined;
  'data-active': '' | undefined;
}
