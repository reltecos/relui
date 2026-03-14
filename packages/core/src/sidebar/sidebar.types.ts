/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sidebar type definitions — framework-agnostic.
 * Sidebar tip tanimlari — framework bagimsiz.
 *
 * Navigasyon paneli: daraltilabilir, gruplama, aktif izleme.
 *
 * @packageDocumentation
 */

/**
 * Sidebar boyutu / Sidebar size.
 */
export type SidebarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Sidebar pozisyonu / Sidebar position.
 */
export type SidebarPosition = 'left' | 'right';

/**
 * Tek navigasyon ogesi / Single navigation item.
 */
export interface SidebarItem {
  /** Benzersiz tanimlayici / Unique identifier */
  key: string;

  /** Gorunen etiket / Display label */
  label: string;

  /** Baglanti adresi (opsiyonel) / Link href (optional) */
  href?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Ikon tanimi (framework binding render eder) / Icon identifier */
  icon?: string;

  /** Badge metni / Badge text */
  badge?: string;

  /** Alt ogeler (grup) / Child items (group) */
  children?: SidebarItem[];

  /** Bolum ayirici mi / Is section divider */
  divider?: boolean;

  /** Bolum baslik mi / Is section header */
  sectionHeader?: boolean;
}

/**
 * Core Sidebar props — framework-agnostic yapilandirma.
 */
export interface SidebarProps {
  /** Navigasyon ogeleri / Navigation items */
  items: SidebarItem[];

  /** Baslangicta daraltilmis mi / Initially collapsed */
  defaultCollapsed?: boolean;

  /** Kontrollü daraltma / Controlled collapsed */
  collapsed?: boolean;

  /** Varsayilan aktif oge / Default active item key */
  defaultActiveKey?: string;

  /** Kontrollü aktif oge / Controlled active key */
  activeKey?: string;

  /** Varsayilan acik gruplar / Default expanded groups */
  defaultExpandedKeys?: string[];
}

/**
 * Sidebar machine context — ic durum.
 */
export interface SidebarMachineContext {
  /** Tum ogeler / All items */
  items: SidebarItem[];

  /** Daraltilmis mi / Is collapsed */
  collapsed: boolean;

  /** Aktif oge key / Active item key */
  activeKey: string | null;

  /** Acik grup key'leri / Expanded group keys */
  expandedKeys: Set<string>;
}

/**
 * State machine event'leri.
 */
export type SidebarEvent =
  | { type: 'TOGGLE_COLLAPSE' }
  | { type: 'EXPAND' }
  | { type: 'COLLAPSE' }
  | { type: 'SET_ACTIVE'; key: string }
  | { type: 'TOGGLE_GROUP'; key: string }
  | { type: 'EXPAND_GROUP'; key: string }
  | { type: 'COLLAPSE_GROUP'; key: string }
  | { type: 'EXPAND_ALL_GROUPS' }
  | { type: 'COLLAPSE_ALL_GROUPS' }
  | { type: 'SET_ITEMS'; items: SidebarItem[] }
  | { type: 'SET_COLLAPSED'; collapsed: boolean }
  | { type: 'SET_ACTIVE_KEY'; key: string | null };

/**
 * Nav DOM attribute'lari.
 */
export interface SidebarNavDOMProps {
  'aria-label': string;
  role: 'navigation';
  'data-collapsed': '' | undefined;
}

/**
 * Oge DOM attribute'lari.
 */
export interface SidebarItemDOMProps {
  'aria-current': 'page' | undefined;
  'aria-disabled': true | undefined;
  'data-active': '' | undefined;
  'data-disabled': '' | undefined;
}

/**
 * Grup DOM attribute'lari.
 */
export interface SidebarGroupDOMProps {
  'aria-expanded': boolean;
  'data-expanded': '' | undefined;
}
