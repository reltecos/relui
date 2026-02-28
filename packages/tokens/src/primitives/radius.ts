/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Border radius tokens.
 * Kenar yuvarlaklığı token'ları.
 *
 * @packageDocumentation
 */

export const radius = {
  /** 0px — keskin köşe / Sharp corner */
  none: '0',
  /** 2px */
  xs: '0.125rem',
  /** 4px */
  sm: '0.25rem',
  /** 6px — varsayılan / default */
  md: '0.375rem',
  /** 8px */
  lg: '0.5rem',
  /** 12px */
  xl: '0.75rem',
  /** 16px */
  '2xl': '1rem',
  /** 24px */
  '3xl': '1.5rem',
  /** 9999px — tam yuvarlak / Fully round */
  full: '9999px',
} as const;
