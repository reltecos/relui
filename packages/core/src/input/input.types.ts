/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Input type definitions — framework-agnostic.
 * Input tip tanımları — framework bağımsız.
 *
 * @packageDocumentation
 */

/**
 * Input görsel varyantı / Input visual variant.
 *
 * - `outline` — Kenarlıklı, varsayılan / Bordered, default
 * - `filled` — Dolgulu arka plan / Filled background
 * - `flushed` — Sadece alt çizgi / Bottom border only
 */
export type InputVariant = 'outline' | 'filled' | 'flushed';

/**
 * Input boyutu / Input size.
 */
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Input etkileşim durumu / Input interaction state.
 */
export type InputInteractionState = 'idle' | 'hover' | 'focused';

/**
 * HTML input tipi / HTML input type.
 */
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';

/**
 * Core input props — framework-agnostic yapılandırma.
 * Core input props — framework-agnostic configuration.
 */
export interface InputProps {
  /** Görsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /**
   * Geçersiz durumu / Invalid state.
   *
   * true olduğunda border kırmızıya döner ve aria-invalid set edilir.
   */
  invalid?: boolean;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** HTML input tipi / HTML input type */
  type?: InputType;
}

/**
 * Input machine context — iç durum.
 * Input machine context — internal state.
 */
export interface InputMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: InputInteractionState;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;

  /** HTML input tipi / HTML input type */
  type: InputType;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type InputEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getInputProps() dönüş tipi — DOM attribute'ları.
 * Return type of getInputProps() — DOM attributes.
 */
export interface InputDOMProps {
  type: InputType;
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  required: boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': InputInteractionState;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
}
