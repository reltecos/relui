/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Accordion tipleri.
 * Accordion types.
 *
 * @packageDocumentation
 */

// ── Events ───────────────────────────────────────────

/** Accordion event'leri / Accordion events */
export type AccordionEvent =
  | { type: 'TOGGLE'; itemId: string }
  | { type: 'EXPAND'; itemId: string }
  | { type: 'COLLAPSE'; itemId: string }
  | { type: 'EXPAND_ALL'; itemIds: string[] }
  | { type: 'COLLAPSE_ALL' };

// ── Context ──────────────────────────────────────────

/** Accordion state / Accordion context */
export interface AccordionContext {
  /** Acik olan item id'leri / Expanded item IDs */
  expandedIds: ReadonlySet<string>;
}

// ── Config ───────────────────────────────────────────

/** Accordion yapilandirmasi / Accordion configuration */
export interface AccordionConfig {
  /** Birden fazla item ayni anda acik olabilir mi / Allow multiple items open */
  allowMultiple?: boolean;
  /** Baslangicta acik olan item id'leri / Initially expanded item IDs */
  defaultExpanded?: string[];
  /** Expand/collapse degisince callback / On expand change callback */
  onExpandChange?: (expandedIds: string[]) => void;
}

// ── API ──────────────────────────────────────────────

/** Accordion API / Accordion API */
export interface AccordionAPI {
  /** Guncel context / Get current context */
  getContext(): AccordionContext;
  /** Event gonder / Send event */
  send(event: AccordionEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
}
