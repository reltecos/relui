/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Breakpoint tokens — responsive design.
 * Kırılım noktası token'ları — responsive tasarım için ekran genişlikleri.
 *
 * @packageDocumentation
 */

export const breakpoints = {
  /** 640px — Küçük mobil / Small mobile */
  sm: '640px',
  /** 768px — Tablet / Tablet */
  md: '768px',
  /** 1024px — Küçük masaüstü / Small desktop */
  lg: '1024px',
  /** 1280px — Masaüstü / Desktop */
  xl: '1280px',
  /** 1536px — Geniş ekran / Wide screen */
  '2xl': '1536px',
  /** 1920px — Full HD */
  '3xl': '1920px',
  /** 2560px — Ultra-wide / QHD */
  '4xl': '2560px',
} as const;

/** Breakpoint isimleri / Breakpoint names */
export type BreakpointKey = keyof typeof breakpoints;
