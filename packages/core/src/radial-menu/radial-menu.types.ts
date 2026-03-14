/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadialMenu type definitions — framework-agnostic.
 * RadialMenu tip tanimlari — framework bagimsiz.
 *
 * Dairesel sag tik menu: Blender/Maya pie menu pattern.
 *
 * @packageDocumentation
 */

/**
 * RadialMenu boyutu / RadialMenu size.
 */
export type RadialMenuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tek radial menu ogesi / Single radial menu item.
 */
export interface RadialMenuItem {
  /** Benzersiz tanimlayici / Unique identifier */
  key: string;

  /** Gorunen etiket / Display label */
  label: string;

  /** Ikon tanimi / Icon identifier */
  icon?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Alt ogeler (alt daire) / Child items (sub-circle) */
  children?: RadialMenuItem[];
}

/**
 * Core RadialMenu props — framework-agnostic yapilandirma.
 */
export interface RadialMenuProps {
  /** Ogeler / Items */
  items: RadialMenuItem[];
}

/**
 * Menu pozisyonu / Menu position.
 */
export interface RadialMenuPosition {
  /** X koordinati / X coordinate */
  x: number;
  /** Y koordinati / Y coordinate */
  y: number;
}

/**
 * Sektor bilgisi / Sector info.
 */
export interface SectorInfo {
  /** Sektor indeksi / Sector index */
  index: number;
  /** Baslangic acisi (derece) / Start angle (degrees) */
  startAngle: number;
  /** Bitis acisi (derece) / End angle (degrees) */
  endAngle: number;
  /** Orta aci (derece) / Mid angle (degrees) */
  midAngle: number;
  /** Ilgili oge / Associated item */
  item: RadialMenuItem;
}

/**
 * RadialMenu machine context — ic durum.
 */
export interface RadialMenuMachineContext {
  /** Tum ogeler / All items */
  items: RadialMenuItem[];

  /** Menu acik mi / Is menu open */
  open: boolean;

  /** Menu pozisyonu / Menu position */
  position: RadialMenuPosition;

  /** Vurgulanan sektor indeksi (-1 = yok) / Highlighted sector index (-1 = none) */
  highlightedIndex: number;

  /** Submenu yolu (iç içe dairesel menüler) / Submenu path */
  submenuPath: string[];
}

/**
 * State machine event'leri.
 */
export type RadialMenuEvent =
  | { type: 'OPEN'; position: RadialMenuPosition }
  | { type: 'CLOSE' }
  | { type: 'HIGHLIGHT_SECTOR'; index: number }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'SELECT' }
  | { type: 'SELECT_INDEX'; index: number }
  | { type: 'ENTER_SUBMENU' }
  | { type: 'EXIT_SUBMENU' }
  | { type: 'SET_ITEMS'; items: RadialMenuItem[] };

/**
 * Menu DOM attribute'lari.
 */
export interface RadialMenuDOMProps {
  role: 'menu';
  'aria-label': string;
}

/**
 * Sektor DOM attribute'lari.
 */
export interface RadialMenuSectorDOMProps {
  role: 'menuitem';
  'aria-label': string;
  'aria-disabled': true | undefined;
  'data-disabled': '' | undefined;
  'data-highlighted': '' | undefined;
  'data-index': number;
}
