/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Transfer oge tanimi / Transfer item definition */
export interface TransferItemDef {
  /** Benzersiz id / Unique id */
  id: string;
  /** Etiket / Label */
  label: string;
  /** Devre disi / Disabled */
  disabled?: boolean;
}

/** TransferList event tipleri / TransferList event types */
export type TransferListEvent =
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_ALL_RIGHT' }
  | { type: 'MOVE_ALL_LEFT' }
  | { type: 'SELECT_SOURCE'; itemId: string }
  | { type: 'DESELECT_SOURCE'; itemId: string }
  | { type: 'TOGGLE_SOURCE'; itemId: string }
  | { type: 'SELECT_TARGET'; itemId: string }
  | { type: 'DESELECT_TARGET'; itemId: string }
  | { type: 'TOGGLE_TARGET'; itemId: string }
  | { type: 'SET_FILTER_SOURCE'; value: string }
  | { type: 'SET_FILTER_TARGET'; value: string };

/** TransferList context / TransferList context */
export interface TransferListContext {
  readonly sourceIds: ReadonlySet<string>;
  readonly targetIds: ReadonlySet<string>;
  readonly selectedSourceIds: ReadonlySet<string>;
  readonly selectedTargetIds: ReadonlySet<string>;
  readonly filterSource: string;
  readonly filterTarget: string;
}

/** TransferList yapilandirma / TransferList config */
export interface TransferListConfig {
  /** Tum oge id leri / All item IDs */
  allIds: string[];
  /** Baslangicta hedef taraftaki id ler / Initially on target side */
  defaultTargetIds?: string[];
  /** Kaynak degisince / On source change */
  onSourceChange?: (ids: string[]) => void;
  /** Hedef degisince / On target change */
  onTargetChange?: (ids: string[]) => void;
}

/** TransferList API / TransferList API */
export interface TransferListAPI {
  getContext(): TransferListContext;
  send(event: TransferListEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
