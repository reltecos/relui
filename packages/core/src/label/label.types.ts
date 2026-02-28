/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Label type definitions — framework-agnostic.
 * Label tip tanımları — framework bağımsız.
 *
 * Form elemanları için etiket bileşeni.
 * Label component for form elements.
 *
 * @packageDocumentation
 */

/**
 * Label boyutu / Label size.
 */
export type LabelSize = 'sm' | 'md' | 'lg';

/**
 * Label props — framework-agnostic yapılandırma.
 * Label props — framework-agnostic configuration.
 */
export interface LabelProps {
  /** Boyut / Size */
  size?: LabelSize;

  /** Zorunlu alan göstergesi / Required field indicator */
  required?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Hedef form elemanı id'si / Target form element id */
  htmlFor?: string;
}
