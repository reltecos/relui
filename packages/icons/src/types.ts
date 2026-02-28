/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RelUI Icon type definitions.
 * RelUI İkon tip tanımları.
 *
 * @packageDocumentation
 */

import type { SVGProps, Ref } from 'react';

/**
 * İkon boyutu / Icon size.
 *
 * Sayısal değer (px) veya string ('1em', '1.5rem') kabul eder.
 */
export type IconSize = number | string;

/**
 * İkon props — tüm ikonların ortak props'ları.
 * Icon props — common props for all icons.
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * İkon boyutu / Icon size.
   *
   * Tek değer width ve height'ı birlikte set eder.
   * Single value sets both width and height.
   *
   * @default '1em'
   */
  size?: IconSize;

  /**
   * İkon rengi / Icon color.
   *
   * SVG stroke/fill rengi. 'currentColor' varsayılan — parent'ın color'ını miras alır.
   *
   * @default 'currentColor'
   */
  color?: string;

  /**
   * SVG çizgi kalınlığı / SVG stroke width.
   *
   * @default 2
   */
  strokeWidth?: number;

  /** Erişilebilirlik etiketi / Accessibility label */
  'aria-label'?: string;

  /** Gizli ikon (dekoratif) / Hidden icon (decorative) */
  'aria-hidden'?: boolean | 'true' | 'false';

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Ref / Ref */
  ref?: Ref<SVGSVGElement>;
}
