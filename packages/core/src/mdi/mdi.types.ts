/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MDI (Multiple Document Interface) types — iç içe pencere yönetimi tipleri.
 *
 * @packageDocumentation
 */

/** MDI pencere durumu. */
export type MDIWindowState = 'normal' | 'minimized' | 'maximized';

/** MDI pencere düzenleme modu. */
export type MDIArrangement = 'cascade' | 'tile-horizontal' | 'tile-vertical';

/** MDI pencere yapılandırması. */
export interface MDIWindowConfig {
  /** Benzersiz pencere kimliği. */
  id: string;
  /** Pencere başlığı. */
  title: string;
  /** X pozisyonu. */
  x?: number;
  /** Y pozisyonu. */
  y?: number;
  /** Genişlik. Varsayılan: 400. */
  width?: number;
  /** Yükseklik. Varsayılan: 300. */
  height?: number;
}

/** MDI pencere durum bilgisi. */
export interface MDIWindowInfo {
  /** Pencere ID. */
  id: string;
  /** Pencere başlığı. */
  title: string;
  /** X pozisyonu. */
  x: number;
  /** Y pozisyonu. */
  y: number;
  /** Genişlik. */
  width: number;
  /** Yükseklik. */
  height: number;
  /** Pencere durumu. */
  state: MDIWindowState;
  /** Z-index. */
  zIndex: number;
  /** Aktif pencere mi. */
  active: boolean;
  /** Restore pozisyon/boyut (maximize öncesi). */
  restoreRect: { x: number; y: number; width: number; height: number };
}

/** MDI yapılandırma prop'ları. */
export interface MDIProps {
  /** Başlangıç pencereleri. */
  windows?: MDIWindowConfig[];
  /** Konteyner genişliği. Varsayılan: 800. */
  containerWidth?: number;
  /** Konteyner yüksekliği. Varsayılan: 600. */
  containerHeight?: number;
}

/** MDI state machine event'leri. */
export type MDIEvent =
  | { type: 'ADD_WINDOW'; window: MDIWindowConfig }
  | { type: 'REMOVE_WINDOW'; id: string }
  | { type: 'ACTIVATE_WINDOW'; id: string }
  | { type: 'MINIMIZE_WINDOW'; id: string }
  | { type: 'MAXIMIZE_WINDOW'; id: string }
  | { type: 'RESTORE_WINDOW'; id: string }
  | { type: 'CLOSE_WINDOW'; id: string }
  | { type: 'MOVE_WINDOW'; id: string; x: number; y: number }
  | { type: 'RESIZE_WINDOW'; id: string; width: number; height: number }
  | { type: 'SET_TITLE'; id: string; title: string }
  | { type: 'ARRANGE'; arrangement: MDIArrangement }
  | { type: 'SET_CONTAINER_SIZE'; width: number; height: number }
  | { type: 'MINIMIZE_ALL' }
  | { type: 'RESTORE_ALL' }
  | { type: 'CLOSE_ALL' };

/** MDI state machine API. */
export interface MDIAPI {
  /** Pencere bilgisi al. */
  getWindow: (id: string) => MDIWindowInfo | undefined;
  /** Tüm pencereleri al (z-index sırasına göre). */
  getWindows: () => MDIWindowInfo[];
  /** Aktif pencere bilgisi. */
  getActiveWindow: () => MDIWindowInfo | undefined;
  /** Aktif pencere ID. */
  getActiveWindowId: () => string | null;
  /** Pencere sayısı. */
  getWindowCount: () => number;
  /** Konteyner boyutları. */
  getContainerSize: () => { width: number; height: number };
  /** Event gönder. */
  send: (event: MDIEvent) => void;
}
