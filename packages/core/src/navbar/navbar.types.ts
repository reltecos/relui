/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Navbar type definitions — framework-agnostic.
 * Navbar tip tanimlari — framework bagimsiz.
 *
 * Ust navigasyon cubugu: logo, linkler, aksiyonlar, mobil menu.
 *
 * @packageDocumentation
 */

/**
 * Navbar boyutu / Navbar size.
 */
export type NavbarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Navbar varyanti / Navbar variant.
 */
export type NavbarVariant = 'solid' | 'transparent' | 'blur';

/**
 * Tek navigasyon ogesi / Single navigation item.
 */
export interface NavbarItem {
  /** Benzersiz tanimlayici / Unique identifier */
  key: string;

  /** Gorunen etiket / Display label */
  label: string;

  /** Baglanti adresi (opsiyonel) / Link href (optional) */
  href?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Ikon tanimi / Icon identifier */
  icon?: string;

  /** Alt ogeler (dropdown) / Child items (dropdown) */
  children?: NavbarItem[];
}

/**
 * Core Navbar props — framework-agnostic yapilandirma.
 */
export interface NavbarProps {
  /** Navigasyon ogeleri / Navigation items */
  items: NavbarItem[];

  /** Varsayilan aktif oge / Default active item key */
  defaultActiveKey?: string;

  /** Kontrollu aktif oge / Controlled active key */
  activeKey?: string;

  /** Varsayilan mobil menu acik mi / Default mobile menu open */
  defaultMobileOpen?: boolean;

  /** Kontrollu mobil menu / Controlled mobile menu */
  mobileOpen?: boolean;
}

/**
 * Navbar machine context — ic durum.
 */
export interface NavbarMachineContext {
  /** Tum ogeler / All items */
  items: NavbarItem[];

  /** Aktif oge key / Active item key */
  activeKey: string | null;

  /** Mobil menu acik mi / Is mobile menu open */
  mobileOpen: boolean;
}

/**
 * State machine event'leri.
 */
export type NavbarEvent =
  | { type: 'SET_ACTIVE'; key: string }
  | { type: 'TOGGLE_MOBILE' }
  | { type: 'OPEN_MOBILE' }
  | { type: 'CLOSE_MOBILE' }
  | { type: 'SET_ITEMS'; items: NavbarItem[] }
  | { type: 'SET_ACTIVE_KEY'; key: string | null }
  | { type: 'SET_MOBILE_OPEN'; open: boolean };

/**
 * Nav DOM attribute'lari.
 */
export interface NavbarNavDOMProps {
  'aria-label': string;
  role: 'navigation';
}

/**
 * Oge DOM attribute'lari.
 */
export interface NavbarItemDOMProps {
  'aria-current': 'page' | undefined;
  'aria-disabled': true | undefined;
  'data-active': '' | undefined;
  'data-disabled': '' | undefined;
}

/**
 * Mobil menu toggle DOM attribute'lari.
 */
export interface NavbarMobileToggleDOMProps {
  'aria-expanded': boolean;
  'aria-label': string;
}
