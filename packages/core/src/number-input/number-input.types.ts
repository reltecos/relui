/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberInput type definitions — framework-agnostic.
 * NumberInput tip tanımları — framework bağımsız.
 *
 * @packageDocumentation
 */

/**
 * NumberInput görsel varyantı / NumberInput visual variant.
 *
 * - `outline` — Kenarlıklı, varsayılan / Bordered, default
 * - `filled` — Dolgulu arka plan / Filled background
 * - `flushed` — Sadece alt çizgi / Bottom border only
 */
export type NumberInputVariant = 'outline' | 'filled' | 'flushed';

/**
 * NumberInput boyutu / NumberInput size.
 */
export type NumberInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * NumberInput etkileşim durumu / NumberInput interaction state.
 */
export type NumberInputInteractionState = 'idle' | 'hover' | 'focused';

/**
 * Core number input props — framework-agnostic yapılandırma.
 * Core number input props — framework-agnostic configuration.
 */
export interface NumberInputProps {
  /** Görsel varyant / Visual variant */
  variant?: NumberInputVariant;

  /** Boyut / Size */
  size?: NumberInputSize;

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

  /** Başlangıç değeri / Initial value */
  value?: number | null;

  /** Minimum değer / Minimum value */
  min?: number;

  /** Maksimum değer / Maximum value */
  max?: number;

  /**
   * Artış/azalış adımı / Increment/decrement step.
   *
   * @default 1
   */
  step?: number;

  /**
   * Ondalık basamak hassasiyeti / Decimal precision.
   *
   * Belirtilmezse step'ten otomatik hesaplanır.
   * If not specified, auto-calculated from step.
   *
   * @example precision: 2 → 3.14
   */
  precision?: number;

  /**
   * Focus kaybedince min/max sınırına clamp et.
   * Clamp to min/max boundary on blur.
   *
   * @default true
   */
  clampOnBlur?: boolean;

  /**
   * Kullanıcının boş bırakmasına izin ver.
   * Allow user to leave the input empty.
   *
   * @default true
   */
  allowEmpty?: boolean;
}

/**
 * NumberInput machine context — iç durum.
 * NumberInput machine context — internal state.
 */
export interface NumberInputMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: NumberInputInteractionState;

  /** Mevcut değer / Current value */
  value: number | null;

  /** Minimum değer / Minimum value */
  min: number;

  /** Maksimum değer / Maximum value */
  max: number;

  /** Artış/azalış adımı / Step */
  step: number;

  /** Ondalık hassasiyet / Decimal precision */
  precision: number;

  /** Focus kaybedince clamp / Clamp on blur */
  clampOnBlur: boolean;

  /** Boş değere izin ver / Allow empty value */
  allowEmpty: boolean;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;

  /** Spin aktif mi (buton basılı tutma) / Is spinning (button hold) */
  spinning: boolean;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type NumberInputEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_VALUE'; value: number | null }
  | { type: 'SET_VALUE_FROM_STRING'; value: string }
  | { type: 'SPIN_START'; direction: 'increment' | 'decrement' }
  | { type: 'SPIN_STOP' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getRootProps() dönüş tipi — kök element DOM attribute'ları.
 * Return type of getRootProps() — root element DOM attributes.
 */
export interface NumberInputRootDOMProps {
  'data-state': NumberInputInteractionState;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
}

/**
 * getInputProps() dönüş tipi — input element DOM attribute'ları.
 * Return type of getInputProps() — input element DOM attributes.
 */
export interface NumberInputDOMProps {
  type: 'text';
  inputMode: 'decimal';
  role: 'spinbutton';
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  required: boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuenow': number | undefined;
  'aria-valuetext': string | undefined;
  'data-state': NumberInputInteractionState;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
}

/**
 * getIncrementProps() / getDecrementProps() dönüş tipi.
 * Return type of getIncrementProps() / getDecrementProps().
 */
export interface NumberInputStepperDOMProps {
  role: 'button';
  tabIndex: -1;
  'aria-label': string;
  'aria-disabled': boolean | undefined;
  'data-disabled': '' | undefined;
}
