/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Mention tipleri.
 * Mention types.
 *
 * @packageDocumentation
 */

/** Oneri itemi / Suggestion item */
export interface MentionItem {
  /** Benzersiz id / Unique ID */
  id: string;
  /** Gorunum etiketi / Display label */
  label: string;
  /** Ek veri / Extra data */
  data?: Record<string, unknown>;
}

/** Mention context / Mention context */
export interface MentionContext {
  /** Acik mi / Is open */
  readonly isOpen: boolean;
  /** Arama sorgusu / Search query */
  readonly query: string;
  /** Filtrelenmis oneriler / Filtered suggestions */
  readonly filteredItems: ReadonlyArray<MentionItem>;
  /** Vurgulanan indeks / Highlighted index */
  readonly highlightedIndex: number;
  /** Trigger karakter pozisyonu / Trigger character position */
  readonly triggerPosition: number | null;
}

/** Mention event leri / Mention events */
export type MentionEvent =
  | { type: 'OPEN'; triggerPosition: number }
  | { type: 'CLOSE' }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'SELECT_ITEM'; index?: number }
  | { type: 'SET_ITEMS'; items: MentionItem[] }
  | { type: 'RESET' };

/** Mention yapilandirmasi / Mention configuration */
export interface MentionConfig {
  /** Oneri listesi / Suggestion items */
  items?: MentionItem[];
  /** Secim callback / On select callback */
  onSelect?: (item: MentionItem) => void;
}

/** Mention API / Mention API */
export interface MentionAPI {
  getContext(): MentionContext;
  send(event: MentionEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
