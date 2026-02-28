/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Radio type definitions — framework-agnostic.
 * Radio tip tanımları — framework bağımsız.
 *
 * WAI-ARIA Radio Group pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * @packageDocumentation
 */

/**
 * Radio boyutu / Radio size.
 */
export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * Radio renk şeması / Radio color scheme.
 */
export type RadioColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Radio etkileşim durumu / Radio interaction state.
 */
export type RadioInteractionState = 'idle' | 'hover' | 'active' | 'focused';

/**
 * Core radio props — framework-agnostic yapılandırma.
 * Core radio props — framework-agnostic configuration.
 */
export interface RadioProps {
  /** Boyut / Size */
  size?: RadioSize;

  /** Renk şeması / Color scheme */
  color?: RadioColor;

  /** Seçili mi / Is checked */
  checked?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** İsim / Name attribute (form entegrasyonu — grup içinde aynı) */
  name?: string;

  /** Değer / Value attribute (form entegrasyonu) */
  value?: string;
}

/**
 * Radio machine context — iç durum.
 * Radio machine context — internal state.
 */
export interface RadioMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: RadioInteractionState;

  /** Seçili mi / Is checked */
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
export type RadioEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'POINTER_DOWN' }
  | { type: 'POINTER_UP' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SELECT' }
  | { type: 'SET_CHECKED'; value: boolean }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getRadioProps() dönüş tipi — DOM attribute'ları.
 * Return type of getRadioProps() — DOM attributes.
 */
export interface RadioDOMProps {
  role: 'radio';
  tabIndex: 0 | -1;
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
