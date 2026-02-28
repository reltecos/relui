/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ButtonGroup type definitions — framework-agnostic.
 * ButtonGroup tip tanımları — framework bağımsız.
 *
 * ButtonGroup, birden fazla Button/IconButton'ı mantıksal olarak gruplar.
 * Ortak variant/size/color context sağlar ve isteğe bağlı attached
 * (yapışık) görünüm sunar.
 *
 * @packageDocumentation
 */

import type { ButtonVariant, ButtonSize, ButtonColor } from '../button';

/**
 * ButtonGroup yönü / ButtonGroup orientation.
 */
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

/**
 * ButtonGroup props — core yapılandırma.
 * ButtonGroup props — core configuration.
 */
export interface ButtonGroupProps {
  /** Yön / Orientation */
  orientation?: ButtonGroupOrientation;

  /** Ortak boyut / Shared size (overrides child buttons) */
  size?: ButtonSize;

  /** Ortak varyant / Shared variant (overrides child buttons) */
  variant?: ButtonVariant;

  /** Ortak renk / Shared color (overrides child buttons) */
  color?: ButtonColor;

  /**
   * Yapışık mod / Attached mode.
   *
   * true olduğunda butonlar arasındaki boşluk kaldırılır,
   * iç butonların border-radius'u sıfırlanır.
   *
   * When true, gap between buttons is removed and inner
   * buttons' border-radius is zeroed.
   */
  attached?: boolean;

  /** Tüm butonları devre dışı bırak / Disable all buttons */
  disabled?: boolean;
}

/**
 * ButtonGroup context — child Button/IconButton'lara aktarılır.
 * ButtonGroup context — passed to child Button/IconButton components.
 */
export interface ButtonGroupContext {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
}
