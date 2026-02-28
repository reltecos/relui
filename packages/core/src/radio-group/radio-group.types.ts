/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadioGroup type definitions — framework-agnostic.
 * RadioGroup tip tanımları — framework bağımsız.
 *
 * RadioGroup, birden fazla Radio'yu mantıksal olarak gruplar.
 * Ortak name/size/color context sağlar ve tek seçim yönetir.
 *
 * @packageDocumentation
 */

import type { RadioSize, RadioColor } from '../radio';

/**
 * RadioGroup yönü / RadioGroup orientation.
 */
export type RadioGroupOrientation = 'horizontal' | 'vertical';

/**
 * RadioGroup props — core yapılandırma.
 * RadioGroup props — core configuration.
 */
export interface RadioGroupProps {
  /** Yön / Orientation */
  orientation?: RadioGroupOrientation;

  /** Ortak boyut / Shared size */
  size?: RadioSize;

  /** Ortak renk / Shared color */
  color?: RadioColor;

  /** Grup ismi / Group name (form entegrasyonu) */
  name?: string;

  /** Seçili değer / Selected value */
  value?: string;

  /** Tüm radio'ları devre dışı bırak / Disable all radios */
  disabled?: boolean;

  /** Salt okunur / Read-only */
  readOnly?: boolean;

  /** Geçersiz / Invalid */
  invalid?: boolean;

  /** Zorunlu / Required */
  required?: boolean;
}

/**
 * RadioGroup context — child Radio'lara aktarılır.
 * RadioGroup context — passed to child Radio components.
 */
export interface RadioGroupContext {
  size?: RadioSize;
  color?: RadioColor;
  name?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  onValueChange?: (value: string) => void;
}
