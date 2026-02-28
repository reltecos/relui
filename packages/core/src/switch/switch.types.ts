/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Switch type definitions — framework-agnostic.
 * Switch tip tanımları — framework bağımsız.
 *
 * Toggle anahtarı — açma/kapama kontrolü.
 * Checkbox'a benzer ama indeterminate yok, görsel olarak pill + knob.
 *
 * @packageDocumentation
 */

/**
 * Switch boyutu / Switch size.
 */
export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * Switch renk şeması / Switch color scheme.
 */
export type SwitchColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Switch etkileşim durumu / Switch interaction state.
 */
export type SwitchInteractionState = 'idle' | 'hover' | 'active' | 'focused';

/**
 * Core switch props — framework-agnostic yapılandırma.
 * Core switch props — framework-agnostic configuration.
 */
export interface SwitchProps {
  /** Boyut / Size */
  size?: SwitchSize;

  /** Renk şeması / Color scheme */
  color?: SwitchColor;

  /** Açık mı / Is checked (on) */
  checked?: boolean;

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
 * Switch machine context — iç durum.
 * Switch machine context — internal state.
 */
export interface SwitchMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: SwitchInteractionState;

  /** Açık mı / Is checked (on) */
  checked: boolean;

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
export type SwitchEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'POINTER_DOWN' }
  | { type: 'POINTER_UP' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'TOGGLE' }
  | { type: 'SET_CHECKED'; value: boolean }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getSwitchProps() dönüş tipi — DOM attribute'ları.
 * Return type of getSwitchProps() — DOM attributes.
 */
export interface SwitchDOMProps {
  role: 'switch';
  tabIndex: 0;
  'aria-checked': boolean;
  'aria-disabled': boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': 'checked' | 'unchecked';
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
  'data-focus': '' | undefined;
  'data-hover': '' | undefined;
  'data-active': '' | undefined;
}
