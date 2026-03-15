/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ValidationSummary tipleri / ValidationSummary types.
 *
 * @packageDocumentation
 */

// ── Severity ────────────────────────────────────────────

/** Dogrulama hata ciddiyeti / Validation error severity. */
export type ValidationSeverity = 'error' | 'warning';

// ── Error Item ──────────────────────────────────────────

/** Dogrulama hatasi / Validation error item. */
export interface ValidationError {
  /** Benzersiz anahtar (genellikle field adi) / Unique key (typically field name) */
  field: string;
  /** Hata mesaji / Error message */
  message: string;
  /** Ciddiyet / Severity (default: 'error') */
  severity?: ValidationSeverity;
}

// ── Events ──────────────────────────────────────────────

/** ValidationSummary event tipleri / ValidationSummary event types. */
export type ValidationSummaryEvent =
  | { type: 'SET_ERRORS'; errors: ValidationError[] }
  | { type: 'ADD_ERROR'; error: ValidationError }
  | { type: 'REMOVE_ERROR'; field: string }
  | { type: 'CLEAR_ERRORS' };

// ── Context ─────────────────────────────────────────────

/** ValidationSummary durumu / ValidationSummary state. */
export interface ValidationSummaryContext {
  /** Hata listesi / Error list */
  errors: ValidationError[];
  /** Hata sayisi / Error count */
  errorCount: number;
  /** Uyari sayisi / Warning count */
  warningCount: number;
}

// ── Config ──────────────────────────────────────────────

/** ValidationSummary yapilandirmasi / ValidationSummary configuration. */
export interface ValidationSummaryConfig {
  /** Baslangic hatalari / Initial errors */
  errors?: ValidationError[];
  /** Hata degisince callback / On errors change callback */
  onErrorsChange?: (errors: ValidationError[]) => void;
}

// ── API ─────────────────────────────────────────────────

/** ValidationSummary API'si / ValidationSummary API. */
export interface ValidationSummaryAPI {
  /** Mevcut durumu al / Get current context */
  getContext(): ValidationSummaryContext;
  /** Event gonder / Send event */
  send(event: ValidationSummaryEvent): void;
  /** Dinleyici ekle / Subscribe to changes */
  subscribe(listener: () => void): () => void;
}
