/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Textarea type definitions — framework-agnostic.
 * Textarea tip tanımları — framework bağımsız.
 *
 * @packageDocumentation
 */

/**
 * Textarea görsel varyantı / Textarea visual variant.
 *
 * - `outline` — Kenarlıklı, varsayılan / Bordered, default
 * - `filled` — Dolgulu arka plan / Filled background
 * - `flushed` — Sadece alt çizgi / Bottom border only
 */
export type TextareaVariant = 'outline' | 'filled' | 'flushed';

/**
 * Textarea boyutu / Textarea size.
 */
export type TextareaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Textarea etkileşim durumu / Textarea interaction state.
 */
export type TextareaInteractionState = 'idle' | 'hover' | 'focused';

/**
 * CSS resize davranışı / CSS resize behavior.
 *
 * - `none` — Boyutlandırma yok / No resizing
 * - `vertical` — Sadece dikey / Vertical only (default)
 * - `horizontal` — Sadece yatay / Horizontal only
 * - `both` — Her iki yönde / Both directions
 */
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

/**
 * Core textarea props — framework-agnostic yapılandırma.
 * Core textarea props — framework-agnostic configuration.
 */
export interface TextareaProps {
  /** Görsel varyant / Visual variant */
  variant?: TextareaVariant;

  /** Boyut / Size */
  size?: TextareaSize;

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

  /**
   * CSS resize davranışı / CSS resize behavior.
   * @default 'vertical'
   */
  resize?: TextareaResize;

  /**
   * Otomatik boyutlandırma / Auto resize.
   *
   * true olduğunda textarea içerik büyüdükçe otomatik yükseklik alır.
   * resize prop'u bu durumda göz ardı edilir.
   */
  autoResize?: boolean;

  /**
   * Görüntülenecek satır sayısı / Number of visible rows.
   * @default 3
   */
  rows?: number;
}

/**
 * Textarea machine context — iç durum.
 * Textarea machine context — internal state.
 */
export interface TextareaMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: TextareaInteractionState;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;

  /** CSS resize davranışı / CSS resize behavior */
  resize: TextareaResize;

  /** Otomatik boyutlandırma / Auto resize */
  autoResize: boolean;

  /** Satır sayısı / Number of rows */
  rows: number;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type TextareaEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * getTextareaProps() dönüş tipi — DOM attribute'ları.
 * Return type of getTextareaProps() — DOM attributes.
 */
export interface TextareaDOMProps {
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  required: boolean | undefined;
  rows: number;
  'aria-invalid': boolean | undefined;
  'aria-required': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': TextareaInteractionState;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
}
