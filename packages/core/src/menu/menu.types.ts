/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Menu type definitions — framework-agnostic.
 * Menu tip tanimlari — framework bagimsiz.
 *
 * Masaustu tarzi menu cubugu: File/Edit/View/Help pattern.
 *
 * @packageDocumentation
 */

/**
 * Menu boyutu / Menu size.
 */
export type MenuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tek menu ogesi / Single menu item.
 */
export interface MenuItem {
  /** Benzersiz tanimlayici / Unique identifier */
  key: string;

  /** Gorunen etiket / Display label */
  label: string;

  /** Ikon tanimi / Icon identifier */
  icon?: string;

  /** Klavye kisayolu metni / Keyboard shortcut label */
  shortcut?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Ayirici mi / Is divider */
  divider?: boolean;

  /** Alt ogeler (submenu) / Child items (submenu) */
  children?: MenuItem[];

  /** Secildi mi (check) / Is checked */
  checked?: boolean;
}

/**
 * Core Menu props — framework-agnostic yapilandirma.
 */
export interface MenuProps {
  /** Ust seviye menu ogeleri / Top-level menu items */
  items: MenuItem[];
}

/**
 * Menu machine context — ic durum.
 */
export interface MenuMachineContext {
  /** Tum ogeler / All items */
  items: MenuItem[];

  /** Acik menu yolu (ust seviye key + submenu key'leri) / Open menu path */
  openPath: string[];

  /** Vurgulanan oge key / Highlighted item key */
  highlightedKey: string | null;

  /** Menu bar aktif mi (herhangi bir menu acik) / Is menu bar active */
  isActive: boolean;
}

/**
 * State machine event'leri.
 */
export type MenuEvent =
  | { type: 'OPEN_MENU'; key: string }
  | { type: 'CLOSE_MENU' }
  | { type: 'CLOSE_ALL' }
  | { type: 'TOGGLE_MENU'; key: string }
  | { type: 'HIGHLIGHT'; key: string | null }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'HIGHLIGHT_FIRST' }
  | { type: 'HIGHLIGHT_LAST' }
  | { type: 'SELECT'; key: string }
  | { type: 'ENTER_SUBMENU' }
  | { type: 'EXIT_SUBMENU' }
  | { type: 'OPEN_NEXT_TOP' }
  | { type: 'OPEN_PREV_TOP' }
  | { type: 'SET_ITEMS'; items: MenuItem[] };

/**
 * Menubar DOM attribute'lari.
 */
export interface MenuBarDOMProps {
  role: 'menubar';
  'aria-label': string;
}

/**
 * Menu trigger DOM attribute'lari.
 */
export interface MenuTriggerDOMProps {
  role: 'menuitem';
  'aria-haspopup': true;
  'aria-expanded': boolean;
  'data-active': '' | undefined;
  'data-highlighted': '' | undefined;
}

/**
 * Menu item DOM attribute'lari.
 */
export interface MenuItemDOMProps {
  role: 'menuitem';
  'aria-disabled': true | undefined;
  'data-disabled': '' | undefined;
  'data-highlighted': '' | undefined;
  'data-checked': '' | undefined;
}

/**
 * Dropdown menu DOM attribute'lari.
 */
export interface MenuDropdownDOMProps {
  role: 'menu';
  'aria-label': string;
}
