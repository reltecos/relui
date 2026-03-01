/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * InPlaceEditor type definitions — framework-agnostic.
 * InPlaceEditor tip tanımları — framework bağımsız.
 *
 * Metin görüntüler, tıklayınca düzenleme moduna geçer.
 * Enter ile kaydet, Escape ile iptal.
 *
 * @packageDocumentation
 */

import type { InputVariant, InputSize } from '../input';

// ── State & Activation ──────────────────────────────────────────

/**
 * InPlaceEditor durumu / InPlaceEditor state.
 *
 * - `reading` — salt okunur metin görüntüleme
 * - `editing` — input ile düzenleme
 */
export type InPlaceEditorState = 'reading' | 'editing';

/**
 * Düzenleme moduna geçiş yöntemi / Edit activation mode.
 *
 * - `click` — tek tıklama ile düzenlemeye geç
 * - `doubleClick` — çift tıklama ile düzenlemeye geç
 */
export type InPlaceEditorActivation = 'click' | 'doubleClick';

// ── Variant & Size (Input reuse) ────────────────────────────────

/** InPlaceEditor görsel varyantı — Input ile aynı. */
export type InPlaceEditorVariant = InputVariant;

/** InPlaceEditor boyutu — Input ile aynı. */
export type InPlaceEditorSize = InputSize;

// ── Props ───────────────────────────────────────────────────────

/**
 * InPlaceEditor props — core yapılandırma.
 * InPlaceEditor props — core configuration.
 */
export interface InPlaceEditorProps {
  /** Başlangıç değeri / Initial value */
  defaultValue?: string;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / ReadOnly state */
  readOnly?: boolean;

  /** Placeholder metni (boş değerde gösterilir) / Placeholder text */
  placeholder?: string;

  /**
   * Düzenleme moduna geçiş yöntemi / Edit activation mode.
   *
   * @default 'click'
   */
  activationMode?: InPlaceEditorActivation;

  /**
   * Blur olunca otomatik kaydet / Auto-confirm on blur.
   *
   * @default true
   */
  submitOnBlur?: boolean;

  /**
   * Edit moduna girince metni seç / Select text on entering edit mode.
   *
   * @default true
   */
  selectOnEdit?: boolean;
}

// ── Machine Context ─────────────────────────────────────────────

/**
 * InPlaceEditor machine context — iç durum.
 * InPlaceEditor machine context — internal state.
 */
export interface InPlaceEditorMachineContext {
  /** Mevcut durum / Current state */
  state: InPlaceEditorState;

  /** Kaydedilmiş değer / Committed value */
  value: string;

  /** Düzenleme sırasındaki çalışma kopyası / Working copy during editing */
  editValue: string;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is readOnly */
  readOnly: boolean;
}

// ── Events ──────────────────────────────────────────────────────

/**
 * InPlaceEditor event tipleri / InPlaceEditor event types.
 */
export type InPlaceEditorEvent =
  | { type: 'EDIT' }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' }
  | { type: 'SET_VALUE'; value: string }
  | { type: 'SET_EDIT_VALUE'; value: string }
  | { type: 'SET_DISABLED'; disabled: boolean }
  | { type: 'SET_READ_ONLY'; readOnly: boolean };

// ── DOM Props ───────────────────────────────────────────────────

/**
 * Display (okuma modu) element DOM props.
 */
export interface InPlaceEditorDisplayDOMProps {
  role: 'button';
  tabIndex: number;
  'aria-disabled'?: boolean;
  'aria-readonly'?: boolean;
  'data-state': InPlaceEditorState;
  'data-disabled'?: '';
  'data-readonly'?: '';
}

/**
 * Input (düzenleme modu) element DOM props.
 */
export interface InPlaceEditorInputDOMProps {
  value: string;
  disabled: boolean;
  readOnly: boolean;
  'aria-label'?: string;
  'data-state': InPlaceEditorState;
}

// ── API ─────────────────────────────────────────────────────────

/**
 * InPlaceEditor API — machine dönüş tipi.
 * InPlaceEditor API — machine return type.
 */
export interface InPlaceEditorAPI {
  /** Machine context'e erişim / Access machine context */
  getContext: () => InPlaceEditorMachineContext;

  /** Event gönder / Send event */
  send: (event: InPlaceEditorEvent) => void;

  /** Display element DOM props / Display element DOM props */
  getDisplayProps: () => InPlaceEditorDisplayDOMProps;

  /** Input element DOM props / Input element DOM props */
  getInputProps: () => InPlaceEditorInputDOMProps;
}
