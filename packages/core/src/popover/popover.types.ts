/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Popover tipleri.
 * Popover types.
 *
 * @packageDocumentation
 */

// ── Placement ────────────────────────────────────────

/** Popover yerlesim yonu / Popover placement direction */
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Popover hizalama / Popover alignment */
export type PopoverAlignment = 'start' | 'center' | 'end';

// ── Events ───────────────────────────────────────────

/** Popover event'leri / Popover events */
export type PopoverEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' };

// ── Context ──────────────────────────────────────────

/** Popover state / Popover context */
export interface PopoverContext {
  /** Acik mi / Is open */
  open: boolean;
}

// ── Config ───────────────────────────────────────────

/** Popover yapilandirmasi / Popover configuration */
export interface PopoverConfig {
  /** Baslangic durumu / Initial open state */
  open?: boolean;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ──────────────────────────────────────────────

/** Popover API / Popover API */
export interface PopoverAPI {
  /** Guncel context / Get current context */
  getContext(): PopoverContext;
  /** Event gonder / Send event */
  send(event: PopoverEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
}
