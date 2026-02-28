/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormField type definitions — framework-agnostic.
 * FormField tip tanımları — framework bağımsız.
 *
 * Label + input + yardımcı metin + hata mesajı sarmalayıcısı.
 * Label + input + helper text + error message wrapper.
 *
 * @packageDocumentation
 */

import type { LabelSize } from '../label';

/**
 * FormField props — framework-agnostic yapılandırma.
 * FormField props — framework-agnostic configuration.
 */
export interface FormFieldProps {
  /** Benzersiz kimlik / Unique identifier (auto-generated if not provided) */
  id?: string;

  /** Etiket metni / Label text */
  label?: string;

  /** Yardımcı metin / Helper text */
  helperText?: string;

  /** Hata mesajı / Error message */
  errorMessage?: string;

  /** Boyut / Size */
  size?: LabelSize;

  /** Zorunlu alan / Required field */
  required?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;
}

/**
 * FormField context — alt bileşenlere aktarılan bağlam.
 * FormField context — context passed to child components.
 *
 * ID'ler otomatik üretilir, aria bağlantıları kurulur.
 * IDs are auto-generated, aria connections established.
 */
export interface FormFieldContext {
  /** Form elemanı id'si / Form element id */
  inputId: string;

  /** Label id'si / Label id */
  labelId: string;

  /** Yardımcı metin id'si / Helper text id */
  helperId: string;

  /** Hata mesajı id'si / Error message id */
  errorId: string;

  /** Boyut / Size */
  size: LabelSize;

  /** Zorunlu mu / Is required */
  required: boolean;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Yardımcı metin var mı / Has helper text */
  hasHelperText: boolean;

  /** Hata mesajı var mı / Has error message */
  hasErrorMessage: boolean;
}

/**
 * FormField ID'lerini üret.
 * Generate FormField IDs.
 *
 * @param baseId - Temel ID / Base ID
 * @returns Üretilen ID'ler / Generated IDs
 *
 * @example
 * ```ts
 * const ids = createFormFieldIds('email');
 * // { inputId: 'email', labelId: 'email-label', helperId: 'email-helper', errorId: 'email-error' }
 * ```
 */
export function createFormFieldIds(baseId: string) {
  return {
    inputId: baseId,
    labelId: `${baseId}-label`,
    helperId: `${baseId}-helper`,
    errorId: `${baseId}-error`,
  };
}
