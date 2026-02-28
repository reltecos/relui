/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormGroup type definitions — framework-agnostic.
 * FormGroup tip tanımları — framework bağımsız.
 *
 * Birden fazla FormField'ı gruplar (fieldset + legend).
 * Groups multiple FormFields (fieldset + legend).
 *
 * @packageDocumentation
 */

import type { LabelSize } from '../label';

/**
 * FormGroup yönü / FormGroup orientation.
 */
export type FormGroupOrientation = 'horizontal' | 'vertical';

/**
 * FormGroup props — framework-agnostic yapılandırma.
 * FormGroup props — framework-agnostic configuration.
 */
export interface FormGroupProps {
  /** Grup başlığı / Group legend */
  legend?: string;

  /** Yerleşim yönü / Layout orientation */
  orientation?: FormGroupOrientation;

  /** Boyut (alt bileşenlere aktarılır) / Size (passed to children) */
  size?: LabelSize;

  /** Pasif durumu (alt bileşenlere aktarılır) / Disabled state (passed to children) */
  disabled?: boolean;
}
