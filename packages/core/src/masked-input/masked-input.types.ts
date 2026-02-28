/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MaskedInput type definitions — framework-agnostic.
 * MaskedInput tip tanımları — framework bağımsız.
 *
 * @packageDocumentation
 */

/**
 * MaskedInput görsel varyantı / MaskedInput visual variant.
 */
export type MaskedInputVariant = 'outline' | 'filled' | 'flushed';

/**
 * MaskedInput boyutu / MaskedInput size.
 */
export type MaskedInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * MaskedInput etkileşim durumu / MaskedInput interaction state.
 */
export type MaskedInputInteractionState = 'idle' | 'hover' | 'focused';

/**
 * Mask tanım karakteri — tek bir mask pozisyonunu temsil eder.
 * Mask definition character — represents a single mask position.
 *
 * - `editable` — kullanıcı giriş yapabilir, `accept` regex ile doğrulanır
 * - `static` — sabit karakter, otomatik eklenir
 */
export interface MaskSlot {
  /** Slot tipi / Slot type */
  type: 'editable' | 'static';

  /** Sabit karakter (sadece static tip için) / Static character (only for static type) */
  char?: string;

  /** Kabul edilen karakter regex'i (sadece editable tip için) / Accepted character regex (only for editable type) */
  accept?: RegExp;
}

/**
 * Core masked input props — framework-agnostic yapılandırma.
 * Core masked input props — framework-agnostic configuration.
 */
export interface MaskedInputProps {
  /** Görsel varyant / Visual variant */
  variant?: MaskedInputVariant;

  /** Boyut / Size */
  size?: MaskedInputSize;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /**
   * Mask pattern string'i.
   * Mask pattern string.
   *
   * Özel karakterler / Special characters:
   * - `#` — rakam / digit (0-9)
   * - `A` — harf / letter (a-zA-Z)
   * - `*` — herhangi karakter / any character
   * - `\\` — sonraki karakteri escape et / escape next character
   * - Diğer her şey sabit karakter / Everything else is a static character
   *
   * @example
   * '(###) ### ## ##'  → Telefon / Phone
   * '## / ## / ####'   → Tarih / Date
   * '###.###.###.###'  → IPv4
   */
  mask: string;

  /**
   * Boş editable slot gösterimi.
   * Placeholder character for empty editable slots.
   *
   * @default '_'
   */
  maskChar?: string;

  /**
   * Başlangıç ham değeri (mask karakterleri olmadan).
   * Initial raw value (without mask characters).
   */
  value?: string;
}

/**
 * MaskedInput machine context — iç durum.
 * MaskedInput machine context — internal state.
 */
export interface MaskedInputMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: MaskedInputInteractionState;

  /** Mask pattern / Mask pattern */
  mask: string;

  /** Parse edilmiş mask tanımı / Parsed mask definition */
  maskSlots: MaskSlot[];

  /** Mask placeholder karakteri / Mask placeholder character */
  maskChar: string;

  /** Ham değer (mask karakterleri olmadan) / Raw value (without mask characters) */
  rawValue: string;

  /** Toplam editable slot sayısı / Total editable slot count */
  editableCount: number;

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
export type MaskedInputEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_RAW_VALUE'; value: string }
  | { type: 'SET_INPUT_VALUE'; value: string }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getInputProps() dönüş tipi — input element DOM attribute'ları.
 * Return type of getInputProps() — input element DOM attributes.
 */
export interface MaskedInputDOMProps {
  type: 'text';
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  required: boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': MaskedInputInteractionState;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
}
