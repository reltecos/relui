/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Button type definitions — framework-agnostic.
 * Button tip tanımları — framework bağımsız.
 *
 * @packageDocumentation
 */

/**
 * Buton görsel varyantı / Button visual variant.
 *
 * - `solid` — Dolgulu, birincil aksiyonlar / Filled, primary actions
 * - `outline` — Kenarlıklı / Bordered
 * - `ghost` — Sadece metin, hover'da arka plan / Text-only, bg on hover
 * - `soft` — Hafif arka plan / Subtle background
 * - `link` — Bağlantı görünümü / Link appearance
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft' | 'link';

/**
 * Buton boyutu / Button size.
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Buton renk şeması / Button color scheme.
 *
 * Token sistemindeki semantic renklere eşlenir.
 * Maps to semantic colors in the token system.
 */
export type ButtonColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Buton etkileşim durumu / Button interaction state.
 *
 * State machine tarafından yönetilir.
 * Managed by the state machine.
 */
export type ButtonInteractionState = 'idle' | 'hover' | 'active' | 'focused';

/**
 * Buton HTML element tipi / Button HTML element type.
 *
 * Farklı element tipleri farklı ARIA attribute'ları gerektirir.
 * Different element types require different ARIA attributes.
 */
export type ButtonElementType = 'button' | 'a' | 'div' | 'span';

/**
 * Core button props — framework-agnostic yapılandırma.
 * Core button props — framework-agnostic configuration.
 */
export interface ButtonProps {
  /** Görsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Buton boyutu / Button size */
  size?: ButtonSize;

  /** Renk şeması / Color scheme */
  color?: ButtonColor;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Yüklenme durumu / Loading state */
  loading?: boolean;

  /** Yüklenme metni / Loading text (replaces children while loading) */
  loadingText?: string;

  /** Tam genişlik / Full width */
  fullWidth?: boolean;

  /** HTML button type / HTML button type attribute */
  type?: 'button' | 'submit' | 'reset';

  /** Render edileceği element tipi / Element type to render as */
  elementType?: ButtonElementType;
}

/**
 * Button machine context — iç durum.
 * Button machine context — internal state.
 */
export interface ButtonMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: ButtonInteractionState;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Yükleniyor mu / Is loading */
  loading: boolean;

  /** Element tipi / Element type */
  elementType: ButtonElementType;

  /** HTML button type */
  type: 'button' | 'submit' | 'reset';
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type ButtonEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'POINTER_DOWN' }
  | { type: 'POINTER_UP' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'KEY_DOWN'; key: string }
  | { type: 'KEY_UP'; key: string }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_LOADING'; value: boolean };

/**
 * getButtonProps() dönüş tipi — DOM attribute'ları.
 * Return type of getButtonProps() — DOM attributes.
 */
export interface ButtonDOMProps {
  role: 'button' | undefined;
  type: 'button' | 'submit' | 'reset' | undefined;
  tabIndex: number | undefined;
  disabled: boolean | undefined;
  'aria-disabled': boolean | undefined;
  'aria-busy': boolean | undefined;
  'data-state': ButtonInteractionState;
  'data-disabled': '' | undefined;
  'data-loading': '' | undefined;
}
