/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MasterDetail types — liste + detay yan yana layout tipleri.
 *
 * @packageDocumentation
 */

/** Master panel pozisyonu. */
export type MasterPosition = 'left' | 'right' | 'top' | 'bottom';

/** Panel görünürlük modu. */
export type DetailVisibility = 'always' | 'onSelect' | 'responsive';

/** MasterDetail yapılandırma prop'ları. */
export interface MasterDetailProps {
  /** Master panel pozisyonu. Varsayılan: 'left'. */
  masterPosition?: MasterPosition;
  /** Master panel boyutu (px veya %). Varsayılan: 300. */
  masterSize?: number | string;
  /** Detail panel görünürlük modu. Varsayılan: 'always'. */
  detailVisibility?: DetailVisibility;
  /** Seçili item ID. */
  selectedId?: string | null;
  /** Master panel daraltılabilir mi. Varsayılan: false. */
  collapsible?: boolean;
  /** Master panel daraltılmış mı. */
  collapsed?: boolean;
}

/** MasterDetail state machine event'leri. */
export type MasterDetailEvent =
  | { type: 'SELECT'; id: string }
  | { type: 'DESELECT' }
  | { type: 'TOGGLE_COLLAPSE' }
  | { type: 'SET_COLLAPSED'; value: boolean }
  | { type: 'SET_MASTER_SIZE'; value: number | string }
  | { type: 'SET_MASTER_POSITION'; value: MasterPosition };

/** MasterDetail state machine API. */
export interface MasterDetailAPI {
  /** Seçili item ID. */
  getSelectedId: () => string | null;
  /** Bir şey seçili mi. */
  hasSelection: () => boolean;
  /** Master panel daraltılmış mı. */
  isCollapsed: () => boolean;
  /** Master panel pozisyonu. */
  getMasterPosition: () => MasterPosition;
  /** Master panel boyutu. */
  getMasterSize: () => number | string;
  /** Detail panel görünür mü. */
  isDetailVisible: () => boolean;
  /** Event gönder. */
  send: (event: MasterDetailEvent) => void;
}
