/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Lookup itemi / Lookup item */
export interface LookupItem {
  id: string;
  label: string;
  data?: Record<string, unknown>;
}

/** Lookup context */
export interface LookupContext {
  readonly isOpen: boolean;
  readonly query: string;
  readonly items: ReadonlyArray<LookupItem>;
  readonly highlightedIndex: number;
  readonly selectedItem: LookupItem | null;
  readonly isLoading: boolean;
}

/** Lookup event leri */
export type LookupEvent =
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_ITEMS'; items: LookupItem[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'SELECT_ITEM'; index?: number }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'CLEAR' };

/** Lookup yapilandirmasi */
export interface LookupConfig {
  minChars?: number;
  onSelect?: (item: LookupItem) => void;
}

/** Lookup API */
export interface LookupAPI {
  getContext(): LookupContext;
  send(event: LookupEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
