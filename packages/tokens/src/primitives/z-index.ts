/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Z-index tokens — layering system.
 * Katman sıralama token'ları — bileşenlerin üst üste binme sırası.
 *
 * @packageDocumentation
 */

export const zIndex = {
  /** Negatif katman / Behind */
  behind: '-1',
  /** Temel katman / Base */
  base: '0',
  /** Dropdown, select menüler / Dropdowns */
  dropdown: '100',
  /** Yapışkan elemanlar / Sticky elements */
  sticky: '200',
  /** Sabit elemanlar (navbar, sidebar) / Fixed elements */
  fixed: '300',
  /** Drawer / Drawer panels */
  drawer: '400',
  /** Modal / Dialog */
  modal: '500',
  /** Popover */
  popover: '600',
  /** Toast / Notification */
  toast: '700',
  /** Tooltip */
  tooltip: '800',
  /** En üst katman (splash, loading overlay) / Topmost layer */
  overlay: '900',
  /** Maksimum — her şeyin üstünde / Maximum */
  max: '9999',
} as const;
